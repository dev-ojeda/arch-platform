Scenario:

consumer
|
| import type { UserService }
v
provider

UserService is a runtime class.

Expected:

- TypeOnlyImportRule -> diagnostic
