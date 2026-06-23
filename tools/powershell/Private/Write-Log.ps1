function Write-Section {

  param(
    [Parameter(Mandatory)]
    [string]$Message
  )

  Write-Host ''
  Write-Host ('=' * 60) -ForegroundColor Cyan
  Write-Host " $Message" -ForegroundColor Cyan
  Write-Host ('=' * 60) -ForegroundColor Cyan
}

function Write-Log {

  param(
    [Parameter(Mandatory)]
    [string]$Message,

    [ValidateSet(
      'Info',
      'Success',
      'Warning',
      'Error'
    )]
    [string]$Level = 'Info'
  )

  $color = switch ($Level) {

    'Info' { 'Gray' }
    'Success' { 'Green' }
    'Warning' { 'Yellow' }
    'Error' { 'Red' }
  }

  Write-Host `
    "[$Level] $Message" `
    -ForegroundColor $color
}