# Cria ou atualiza o .env.local com NEXTAUTH_SECRET gerado (nao precisa de Node/npm)
# Execute: .\scripts\setup-env.ps1

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path $PSScriptRoot -Parent
$envPath = Join-Path $projectRoot ".env.local"

# Gerar 32 bytes aleatorios e converter para Base64
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)

$content = @"
# Cole a URL do MySQL do Railway (Variables do servico MySQL no Railway)
DATABASE_URL=COLE_A_URL_DO_RAILWAY_AQUI

# Gerado automaticamente por setup-env.ps1
NEXTAUTH_SECRET=$secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
WHATSAPP_NUMBER=5511999999999
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
"@

# Se .env.local ja existir, manter DATABASE_URL se ja foi preenchida
if (Test-Path $envPath) {
    $atual = Get-Content $envPath -Raw
    if ($atual -match 'DATABASE_URL=(.+)' -and $matches[1] -notmatch 'COLE_A_URL') {
        $content = $content -replace 'DATABASE_URL=COLE_A_URL_DO_RAILWAY_AQUI', "DATABASE_URL=$($matches[1].Trim())"
    }
}

Set-Content -Path $envPath -Value $content -Encoding UTF8

Write-Host ""
Write-Host "OK .env.local criado/atualizado em: $envPath" -ForegroundColor Green
Write-Host "   NEXTAUTH_SECRET foi gerado automaticamente." -ForegroundColor Gray
Write-Host ""
Write-Host "Proximo passo: abra .env.local e substitua" -ForegroundColor Yellow
Write-Host "   DATABASE_URL=COLE_A_URL_DO_RAILWAY_AQUI" -ForegroundColor White
Write-Host "   pela URL do MySQL que voce copiou do Railway." -ForegroundColor Gray
Write-Host ""
Write-Host "Depois rode: npm run db:init" -ForegroundColor Cyan
Write-Host ""
