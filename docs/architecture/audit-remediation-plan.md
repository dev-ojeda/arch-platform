# Plan de remediación de auditoría

## Objetivo

Convertir los hallazgos de la auditoría técnica en cambios verificables, sin habilitar publicaciones públicas hasta que los controles de aprobación, procedencia e integridad estén implementados.

## Decisiones para revisar

- [ ] Definir cuáles paquetes son miembros reales del workspace: incluir `contracts`, `generators/mvc` y, si corresponde, `apps/vscode-extension`; o formalizar su consumo únicamente desde el registro.
- [ ] Corregir la ruta de `@arch-platform/generator-mvc` en `config/arch.manifest.json`.
- [ ] Decidir el modelo de releases: Changesets para todos los paquetes publicables o un flujo alternativo explícito.
- [ ] Establecer los entornos autorizados para publicar y los responsables de aprobación.
- [ ] Acordar el repositorio/registro destino y la política de visibilidad de cada paquete.

## Fase 1 — Restaurar coherencia del monorepo

- [ ] Alinear `pnpm-workspace.yaml`, `package.json`, `config/arch.manifest.json` y dependencias `workspace:*`.
- [ ] Corregir los nombres obsoletos de `.changeset/config.json`.
- [ ] Añadir validación de rutas del manifiesto y de paquetes de Changesets al CI.
- [ ] Verificar instalación congelada, build, typecheck, tests y extension de VS Code desde un clon limpio.

**Salida:** todos los paquetes declarados se resuelven de forma inequívoca y el workspace se instala con `--frozen-lockfile`.

## Fase 2 — Endurecer aprobación y publicación

- [ ] Eliminar la promoción automática de `transition` a `approved`.
- [ ] Persistir aprobaciones con identidad, fecha, hash del artefacto y control de acceso fuera del workspace.
- [ ] Crear un workflow de release protegido, con GitHub Environments y aprobación requerida.
- [ ] Usar trusted publishing/OIDC y evitar credenciales npm de larga duración.
- [ ] Requerir provenance, SBOM y firma/attestation antes de `npm publish`.

**Salida:** un ejecutor no puede autoaprobar ni publicar un tarball sin aprobación externa y evidencia verificable.

## Fase 3 — Seguridad y confianza de artefactos

- [ ] Mantener las huellas SHA-256 de la caché, pero añadir procedencia firmada y verificación del emisor.
- [ ] Generar SBOM por artefacto y escanear dependencias, secretos y código.
- [ ] Sustituir o complementar los CVEs locales con una fuente autenticada y actualizable.
- [ ] Definir política de severidad, excepciones con caducidad y bloqueo de publicación.

**Salida:** cada release conserva hash, SBOM, resultados de análisis y attestation verificables.

## Fase 4 — Gobernanza operativa

- [ ] Fijar GitHub Actions por SHA y habilitar controles de ramas requeridos.
- [ ] Completar los ADR de release, pruebas y observabilidad.
- [ ] Añadir retención de artefactos, trazabilidad de decisiones y procedimiento de rollback.
- [ ] Establecer métricas: tasa de cache-hit, tiempo de pipeline, cobertura de paquetes y vulnerabilidades abiertas.

**Salida:** el proceso queda documentado, auditable y observable.

## Orden propuesto

1. Fase 1.
2. Congelar publicaciones públicas.
3. Fase 2.
4. Fase 3.
5. Fase 4 y habilitación gradual de releases.

## Criterio de cierre

No habilitar publicación automática hasta que las salidas de las fases 1 a 3 estén verificadas en CI y aprobadas por los responsables definidos.
