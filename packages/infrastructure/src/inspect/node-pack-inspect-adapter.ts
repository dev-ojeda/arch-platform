import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import * as tar from 'tar';

import type { PackInspectPort, PackInspection } from '@arch-platform/platform-model';

import { safeParse } from '../serialization/safe-parse.js';

interface PackageJson {
  readonly name?: string;
  readonly version?: string;
}

export class NodePackInspectAdapter implements PackInspectPort {
  async inspect(content: Uint8Array): Promise<PackInspection> {
    const filesInside: string[] = [];

    let packageName: string | undefined;
    let packageVersion: string | undefined;

    // Convertimos de forma segura el Uint8Array a un Readable Stream
    const input = Readable.from(
      Buffer.from(content.buffer, content.byteOffset, content.byteLength),
    );

    // Creamos el stream de lectura de tar.list
    const tarParser = tar.list({
      gzip: true,
      onentry: (entry) => {
        if (entry.type !== 'File') {
          return;
        }

        filesInside.push(entry.path);

        if (!entry.path.endsWith('package.json')) {
          // Es crítico reanudar el flujo de las entradas que no nos interesan
          // para que no se congele la lectura del stream
          entry.resume();
          return;
        }

        const chunks: Buffer[] = [];

        // Escuchamos los eventos de forma síncrona según la API de tar
        entry.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        entry.on('end', () => {
          const packageJson = safeParse<PackageJson>(Buffer.concat(chunks).toString('utf8'));

          if (packageJson) {
            packageName = packageJson.name;
            packageVersion = packageJson.version;
          }
        });
      },
    });

    // Conectamos el input con el parser usando pipeline de promesas para controlar el fin del flujo
    await pipeline(input, tarParser);

    if (!packageName || !packageVersion) {
      throw new Error('No se encontró un package.json válido dentro del archivo .tgz');
    }

    return Object.freeze({
      name: packageName,
      version: packageVersion,
      filesInside: Object.freeze(filesInside),
    });
  }
}
