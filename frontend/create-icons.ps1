# Script para criar ícones básicos para o Tauri
# Este é um placeholder - você pode substituir por ícones reais depois

Write-Host "Criando ícones básicos para o CRM System..."

# Criar diretório de ícones se não existir
if (!(Test-Path "src-tauri\icons")) {
    New-Item -ItemType Directory -Path "src-tauri\icons" -Force
}

# Criar arquivos de ícone placeholder
$iconFiles = @(
    "32x32.png",
    "128x128.png", 
    "128x128@2x.png",
    "icon.icns",
    "icon.ico"
)

foreach ($icon in $iconFiles) {
    $path = "src-tauri\icons\$icon"
    if (!(Test-Path $path)) {
        New-Item -ItemType File -Path $path -Force
        Write-Host "Criado: $path"
    }
}

Write-Host "Ícones criados! Você pode substituí-los por ícones reais depois."
Write-Host "Para ícones reais, você pode usar ferramentas como:"
Write-Host "- https://www.favicon-generator.org/"
Write-Host "- https://www.icoconverter.com/"
Write-Host "- Ou criar seus próprios ícones em um editor de imagem" 