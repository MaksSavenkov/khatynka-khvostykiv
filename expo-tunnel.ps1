$env:Path = "$env:LOCALAPPDATA\Programs\nodejs;$env:Path"
$env:NODE_OPTIONS = "--use-system-ca"
Set-Location "$env:USERPROFILE\vibe-session\my-app"
npx.cmd expo start --tunnel
