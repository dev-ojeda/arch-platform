# @arch-platform/distribution

CLI de distribución de ARCH para ejecutar el MVP de **build** en un workspace consumidor.

> Estado: MVP de build. Este paquete expone actualmente el comando `build`; no documenta ni promete otros comandos de ARCH.

## Requisitos

- Node.js compatible con el workspace consumidor.
- pnpm, si el workspace se administra con pnpm.
- Un workspace que contenga los paquetes que ARCH debe compilar.
- TypeScript instalado en el paquete consumidor cuando se utiliza el builder `tsc`.

## Instalación

Desde la raíz del workspace consumidor, una vez publicado el paquete en el registro configurado:

```bash
pnpm add -D @arch-platform/distribution
```

El paquete registra el ejecutable `arch-cli`.

## Uso

Mostrar la ayuda:

```bash
pnpm exec arch-cli --help
```

Mostrar la ayuda de build:

```bash
pnpm exec arch-cli build --help
```

Compilar el workspace:

```bash
pnpm exec arch-cli build
```

Compilar un paquete específico:

```bash
pnpm exec arch-cli build --package @scope/package-name
```

`--package` recibe el nombre del paquete tal como aparece en su `package.json`.

## Configuración del paquete

ARCH lee la configuración `arch` del `package.json` del paquete que se desea compilar. Ejemplo mínimo para un paquete TypeScript que genera `dist`:

```json
{
  "name": "@scope/package-name",
  "version": "1.0.0",
  "arch": {
    "artifactType": "runtime",
    "build": {
      "builder": "tsc",
      "outputs": ["dist"]
    }
  }
}
```

- `artifactType`: clasifica el artefacto; en este ejemplo, `runtime`.
- `build.builder`: identifica el builder que ARCH debe utilizar; en este ejemplo, `tsc`.
- `build.outputs`: directorios de salida del build; en este ejemplo, `dist`.

La configuración y los requisitos concretos del builder deben corresponder al paquete consumidor.

## Resultado del comando

El CLI muestra un resumen del build con estos contadores:

- `Executed`: builds ejecutados.
- `Restored`: artefactos restaurados desde la caché.
- `Cached`: resultados reutilizados sin ejecutar el build.
- `Failed`: builds fallidos.

El comando informa `BUILD COMPLETED` cuando no hay fallos y `BUILD FAILED` cuando hay uno o más. El proceso termina con código `0` si no hubo fallos y `1` en caso contrario.

## Caché y restauración

El MVP de build puede:

1. Ejecutar el build inicial.
2. Reutilizar el resultado cuando no cambian las entradas relevantes.
3. Invalidar la caché y volver a ejecutar cuando cambia el código fuente.
4. Restaurar el artefacto almacenado cuando la salida local falta y existe un resultado restaurable.

Los contadores del resumen permiten observar cuál de estos caminos ocurrió.

## Alcance del MVP

Este paquete documenta únicamente la distribución del CLI y el comando `build`, incluyendo ejecución, caché, invalidación y restauración.

No implica que otros comandos o capacidades de ARCH estén disponibles a través de este paquete.

## Desarrollo del paquete

Dentro del monorepo ARCH:

```bash
pnpm arch build --package @arch-platform/distribution
```

El paquete se configura para generar `dist` mediante `tsup`. El ejecutable publicado es `bin/arch-cli.js`.
