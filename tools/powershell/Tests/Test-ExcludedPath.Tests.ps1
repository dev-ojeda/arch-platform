Describe "Test-ExcludedPath" {

  It "Returns true for .git directory" {

      Test-ExcludedPath `
          "C:\repo\.git\objects" |
      Should -BeTrue
  }

  It "Returns false for source directory" {

      Test-ExcludedPath `
          "C:\repo\packages\core" |
      Should -BeFalse
  }
}