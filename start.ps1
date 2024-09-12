$scriptDir = Join-Path -Path ([Environment]::GetFolderPath("Desktop")) -ChildPath "pdfgen"
Set-Location $scriptDir

Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Hidden -PassThru | Out-Null
Start-Process -FilePath "explorer" -ArgumentList "http://localhost:3000"