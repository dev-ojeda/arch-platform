### Tipos de Release en SemVer

| Tipo de Release  | Qué significa / Cuándo se usa                                            | Ejemplo de cambio                                | Resultado (`0.1.0` ➔ Nuevo)          |
| :--------------- | :----------------------------------------------------------------------- | :----------------------------------------------- | :----------------------------------- |
| **`patch`**      | Corrección de errores que **no** rompen compatibilidad (bug fixes).      | Arreglar un botón que no guardaba datos.         | **`0.1.1`**                          |
| **`minor`**      | Nueva funcionalidad compatible con versiones anteriores (features).      | Añadir un botón nuevo sin alterar los viejos.    | **`0.2.0`**                          |
| **`major`**      | Cambios incompatibles o que **rompen** la API previa (breaking changes). | Cambiar el nombre de una función existente.      | **`1.0.0`**                          |
| **`prerelease`** | Incrementa el identificador previo de versión en desarrollo.             | Pasar de `1.0.0-beta.0` a `1.0.0-beta.1`.        | **`0.1.0-0`** (si no hay tag previo) |
| **`premajor`**   | Salta directamente a una versión mayor en fase preliminar.               | Preparar la siguiente gran versión en alfa.      | **`1.0.0-0`**                        |
| **`preminor`**   | Salta directamente a una versión menor preliminar.                       | Preparar una feature mediana en fase de pruebas. | **`0.2.0-0`**                        |
| **`prepatch`**   | Salta directamente a un parche preliminar.                               | Preparar un fix rápido en versión de pruebas.    | **`0.1.1-0`**                        |
