# Platform Self-Validation

Etapas de validación de capacidades de la plataforma

|  Paso  | Etapa                                    | Qué valida                                                | Observación                                                                           |
| :----: | :--------------------------------------- | :-------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| **1**  | Checkout e instalación                   | Entorno reproducible                                      | `--frozen-lockfile` es correcto.                                                      |
| **2**  | Synchronize registry package             | Resolución y sincronización de `@arch-platform/contracts` | Verificar que el comando actualice el estado esperado.                                |
| **3**  | Version artifact                         | Versionado prerelease                                     | Confirmar que `dev` produzca la versión esperada y no modifique archivos inesperados. |
| **4**  | Build selected artifact                  | Build selectivo                                           | Verificar que solo construya el alcance previsto y sus dependencias necesarias.       |
| **5**  | Verify generated state                   | Persistencia del estado                                   | Comprueba existencia, pero no validez ni coherencia.                                  |
| **6**  | Compliance — first evaluation / approval | Evaluación y aprobación                                   | La segunda ejecución necesita demostrar que el estado cambia de forma verificable.    |
| **7**  | Security — first evaluation / approval   | Evaluación y aprobación de seguridad                      | Mismo requisito: comprobar la transición de estado, no solo el código de salida.      |
| **8**  | Pack artifact                            | Generación del paquete distribuible                       | Confirmar que produce el artefacto esperado.                                          |
| **9**  | Inspect artifact                         | Inspección del paquete                                    | Debe inspeccionar el artefacto generado, no únicamente el workspace.                  |
| **10** | Evaluate publication                     | Evaluación de publicación                                 | `--dry-run` debería evaluar sin publicar ni introducir efectos externos.              |

Etapas, objetivos y observaciones de la validación de plataforma.

Platform validation · 10 etapas de validación documentadas
