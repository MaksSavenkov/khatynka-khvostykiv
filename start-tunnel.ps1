# Запуск сервера Expo через тунель (обходить брандмауер і Avast)
$env:Path = "$env:LOCALAPPDATA\Programs\nodejs;$env:Path"
$env:NODE_OPTIONS = "--use-system-ca"
Set-Location $PSScriptRoot
npx.cmd expo start --tunnel --clear
