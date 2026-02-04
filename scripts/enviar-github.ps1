# Script para enviar o projeto ao GitHub
# Execute no PowerShell na pasta do projeto: .\scripts\enviar-github.ps1
# Ou: powershell -ExecutionPolicy Bypass -File scripts\enviar-github.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host ""
Write-Host "=== Enviando projeto para o GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Inicializar repo se ainda nao existir
if (-not (Test-Path .git)) {
    Write-Host "Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Adicionar e commitar
Write-Host "Adicionando arquivos..." -ForegroundColor Yellow
git add .
git status

Write-Host ""
Write-Host "Fazendo commit..." -ForegroundColor Yellow
git commit -m "PH Silva Imobiliária - deploy Vercel + Railway MySQL" 2>$null
if ($LASTEXITCODE -ne 0) {
    git commit -m "PH Silva Imobiliária - deploy Vercel + Railway MySQL" --allow-empty
}

Write-Host ""
Write-Host "=== Próximos passos (faça você mesmo) ===" -ForegroundColor Green
Write-Host ""
Write-Host "1. Crie um repositório no GitHub: https://github.com/new"
Write-Host "   Nome sugerido: ph-silva-imobiliaria"
Write-Host "   Nao marque 'Add README' (o projeto já tem arquivos)."
Write-Host ""
Write-Host "2. Conecte e envie (troque SEU_USUARIO pelo seu usuário do GitHub):"
Write-Host ""
Write-Host "   git remote add origin https://github.com/SEU_USUARIO/ph-silva-imobiliaria.git" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "   Se o remote já existir, use antes:"
Write-Host "   git remote set-url origin https://github.com/SEU_USUARIO/ph-silva-imobiliaria.git" -ForegroundColor DarkGray
Write-Host ""
Write-Host "3. Depois: importe o repo na Vercel e configure DATABASE_URL com a URL do Railway." -ForegroundColor Cyan
Write-Host ""
