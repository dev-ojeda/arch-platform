
# Native Kernel32 API (P/Invoke)
Add-Type @'
using System;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;

public static class DirectoryLocker
{
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern SafeFileHandle CreateFile(
        string fileName,
        uint desiredAccess,
        uint shareMode,
        IntPtr securityAttributes,
        uint creationDisposition,
        uint flagsAndAttributes,
        IntPtr templateFile
    );
}
'@

$cacheRoot = "E:\desarrollo\arch-platform-all\arch-platform\.arch-platform-cache\artifacts\@arch-platform\contracts\e17da0d813896c03e56a7ac8d2ca1c4901681420a7f6138df80e6d237787a3ea-e6ed40ccd5fa1169fc392b3bbfb81d3c44a049291b06ef46c7b4c9de0438d2cc-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

[PSCustomObject]@{
  Estado = "Attempting to acquire exclusive directory lock"
  Ruta   = $cacheRoot
} | Format-List

$handle = [DirectoryLocker]::CreateFile(
  $cacheRoot,
  0x00010000, # DELETE
  0,          # No FILE_SHARE_READ, WRITE or DELETE
  [IntPtr]::Zero,
  3,          # OPEN_EXISTING
  0x02000000, # FILE_FLAG_BACKUP_SEMANTICS
  [IntPtr]::Zero
)

if ($handle.IsInvalid) {
  $errorCode = [Runtime.InteropServices.Marshal]::GetLastWin32Error()
  Write-Error "Could not acquire native handle. Win32Error: $errorCode"
  exit 1
}

try {
  [PSCustomObject]@{
    Estado      = "EXCLUSIVE LOCK ACQUIRED"
    Resultado   = "Valid handle: $(-not $handle.IsInvalid)"
    Instruccion = "Keep this console open. Run the BUILD in another terminal to reproduce EBUSY."
  } | Format-List

  Read-Host "Press ENTER after the build test to release the directory"
}
finally {
  if ($null -ne $handle -and -not $handle.IsClosed) {
    $handle.Dispose()
    Write-Host "Handle released. Directory is available again."
  }
}
