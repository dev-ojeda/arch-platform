Describe "Remove-PathSafe" {

  It "Deletes temporary directory" {

      $path =
      Join-Path `
          $TestDrive `
          "temp"

      New-Item `
          -ItemType Directory `
          -Path $path

      Remove-PathSafe `
          -Path $path

      Test-Path $path |
      Should -BeFalse
  }
}