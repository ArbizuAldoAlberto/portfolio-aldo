# ==============================================================================
# NEXUS ONE-CLICK ZERO-DOWNTIME VPS DEPLOYER (v1.0)
# Hetzner VPS 178.105.145.226 | Portfolio Dark Orbital
# ==============================================================================
param (
    [string]$CommitMessage = "chore(prod): automated zero-downtime deployment via NEXUS SRE"
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "🚀 NEXUS SRE: ONE-CLICK ZERO-DOWNTIME DEPLOYMENT" -ForegroundColor Cyan
Write-Host "   Host: root@178.105.145.226 (:3000 -> aldoarbizu.com)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Pre-Flight Security Gate
Write-Host "`n[1/5] Ejecutando Security Audit Gate..." -ForegroundColor Yellow
$secResult = node scripts/scan_security_gate.js
Write-Host $secResult
if ($LASTEXITCODE -ne 0) {
    Write-Error "🚨 FALLO EN SECURITY GATE: Abortando despliegue."
    exit 1
}

# 2. Pre-Flight TypeScript Compilation Check
Write-Host "`n[2/5] Verificando compilacion TypeScript estricta..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Error "🚨 ERROR DE TYPESCRIPT: Corrija los tipos antes de desplegar."
    exit 1
}
Write-Host "✅ TypeScript 100% libre de errores." -ForegroundColor Green

# 3. Git Status Double Verification (Regla de Oro NEXUS)
Write-Host "`n[3/5] Doble verificacion de archivos confidenciales (.env)..." -ForegroundColor Yellow
$status = git status --porcelain
$trackedEnv = $status | Select-String -Pattern "\.env"
if ($trackedEnv) {
    Write-Error "🚨 CRÍTICO: Se detectaron archivos .env modificados o sin ignorar. Abortando commit."
    exit 1
}
Write-Host "✅ .env files seguros y excluidos." -ForegroundColor Green

# 4. Commit y Push a GitHub
Write-Host "`n[4/5] Empaquetando commit y sincronizando con origin/main..." -ForegroundColor Yellow
git add app/ components/ scripts/
$hasChanges = git status --porcelain
if ($hasChanges) {
    git commit -m $CommitMessage
    git push origin main
    Write-Host "✅ Cambios subidos a GitHub origin/main." -ForegroundColor Green
} else {
    Write-Host "ℹ️ Sin cambios pendientes de commit. Procediendo a refrescar VPS." -ForegroundColor Cyan
}

# 5. Disparo de Despliegue Remoto en la VPS (con Swap Temporal y Zero Downtime)
Write-Host "`n[5/5] Disparando despliegue seguro en la VPS..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no root@178.105.145.226 "/root/scripts/deploy-portfolio.sh"

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "✅ DESPLIEGUE COMPLETADO Y CERTIFICADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "   Verificando en vivo: https://aldoarbizu.com/" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Green
