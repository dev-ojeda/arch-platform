import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

import type { Artifact, ArtifactManifest, OutputFingerprint } from '@arch-platform/platform-model';
/**
 * Calcula de forma eficiente la huella SHA-256 de un archivo individual.
 */
async function calculateFileHash(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  return `sha256:${hash}`;
}

/**
 * Escanea recursivamente un archivo o directorio y genera las huellas correspondientes.
 * @param targetPath Ruta absoluta o relativa al workspace que se va a escanear.
 * @param baseWorkspacePath Ruta base del workspace para normalizar los caminos relativos.
 */
async function generateFingerprintsForPath(
  targetPath: string,
  baseWorkspacePath: string,
): Promise<OutputFingerprint[]> {
  const fingerprints: OutputFingerprint[] = [];
  const stat = await fs.stat(targetPath);

  if (stat.isFile()) {
    // Si es un archivo, obtenemos su ruta relativa respecto al workspace
    const relativePath = path.relative(baseWorkspacePath, targetPath);
    const integrity = await calculateFileHash(targetPath);

    fingerprints.push({
      path: relativePath,
      sizeInBytes: stat.size,
      integrity,
    });
  } else if (stat.isDirectory()) {
    // Si es un directorio, leemos sus elementos y los procesamos recursivamente
    const entries = await fs.readdir(targetPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(targetPath, entry.name);
      const subFingerprints = await generateFingerprintsForPath(fullPath, baseWorkspacePath);
      fingerprints.push(...subFingerprints);
    }
  }

  return fingerprints;
}

/**
 * Función principal para construir el ArtifactManifest a partir de los outputs físicos.
 */
export async function createArtifactManifest(
  artifact: Artifact,
  outputs: string[],
  baseWorkspacePath: string,
): Promise<ArtifactManifest> {
  const allFingerprints: OutputFingerprint[] = [];

  // Escanear cada uno de los outputs declarados (ej: ["dist"])
  for (const outputPath of outputs) {
    // Aseguramos la ruta absoluta combinándola con la base del workspace si es necesario
    const absoluteOutputPath = path.isAbsolute(outputPath)
      ? outputPath
      : path.join(baseWorkspacePath, outputPath);

    try {
      const fingerprints = await generateFingerprintsForPath(absoluteOutputPath, baseWorkspacePath);
      allFingerprints.push(...fingerprints);
    } catch (error) {
      // Manejar el caso donde el output declarado no exista físicamente tras el build
      console.warn(`⚠️ No se pudo procesar el output: ${outputPath}. Saltando...`, error);
    }
  }

  return {
    artifact,
    outputs,
    outputFingerprint: allFingerprints,
    createdAt: Date.now(),
    schemaVersion: 2, // Incrementado por el cambio de firmas
  };
}

// async function test() {
//   const myArtifact: Artifact = {
//     packageName: '@arch-platform/generator-mvc',
//     id: 'srcHashXYZ-configHashABC-depsHash123',
//   };

//   const baseWorkspace = process.cwd(); // Directorio raíz de tu proyecto

//   // Generamos el manifiesto con los archivos reales en disco
//   const finalManifest = await createArtifactManifest(myArtifact, ['dist'], baseWorkspace);

//   // Guardar el manifiesto generado en la caché del artefacto
//   await fs.writeFile(
//     path.join(baseWorkspace, 'artifact-cache', myArtifact.packageName, 'manifest.json'),
//     JSON.stringify(finalManifest, null, 2),
//   );
// }
