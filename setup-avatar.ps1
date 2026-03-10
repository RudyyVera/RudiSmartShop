# Script para copiar el avatar de RudiBot
# Ejecuta este script desde PowerShell

Write-Host "=== Configuración del Avatar de RudiBot ===" -ForegroundColor Cyan
Write-Host ""

$projectPath = "c:\Users\Usuario1.LAPTOP-A5Q43AQD.001\Desktop\nextommerce-main\public"
$targetFile = Join-Path $projectPath "rudibot-avatar.png"

Write-Host "Paso 1: Guarda la imagen del robot (image_4.png) en tu escritorio o donde prefieras" -ForegroundColor Yellow
Write-Host ""
Write-Host "Paso 2: Ingresa la ruta completa de la imagen:" -ForegroundColor Yellow
$sourcePath = Read-Host "Ruta de la imagen"

if (Test-Path $sourcePath) {
    Copy-Item -Path $sourcePath -Destination $targetFile -Force
    Write-Host ""
    Write-Host "✅ ¡Avatar copiado exitosamente!" -ForegroundColor Green
    Write-Host "La imagen ahora está en: $targetFile" -ForegroundColor Green
    Write-Host ""
    Write-Host "Paso 3: Abre components/ChatbotFAB.js y cambia:" -ForegroundColor Yellow
    Write-Host "  De: const botAvatarUrl = '/rudibot-avatar.svg';" -ForegroundColor White
    Write-Host "  A:  const botAvatarUrl = '/rudibot-avatar.png';" -ForegroundColor Green
    Write-Host ""
    Write-Host "Paso 4: Recarga el navegador para ver el cambio" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ No se encontró la imagen en: $sourcePath" -ForegroundColor Red
    Write-Host "Por favor, verifica la ruta e intenta de nuevo" -ForegroundColor Red
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
