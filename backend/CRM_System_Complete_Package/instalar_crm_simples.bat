@echo off
echo ========================================
echo    INSTALADOR CRM SYSTEM - SIMPLES
echo ========================================
echo.

REM Define a pasta de instalação na área de trabalho do usuário
set INSTALL_DIR=%USERPROFILE%\Desktop\CRM System
set BACKEND_DIR=%INSTALL_DIR%\backend
set FRONTEND_DIR=%INSTALL_DIR%\frontend

echo Instalando CRM System em: %INSTALL_DIR%
echo.

REM Cria as pastas necessárias
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
if not exist "%BACKEND_DIR%" mkdir "%BACKEND_DIR%"
if not exist "%FRONTEND_DIR%" mkdir "%FRONTEND_DIR%"

echo [1/4] Copiando arquivos do backend...
xcopy "crm-backend\*" "%BACKEND_DIR%\" /E /I /Y >nul
if errorlevel 1 (
    echo ERRO: Não foi possível copiar os arquivos do backend
    pause
    exit /b 1
)

echo [2/4] Copiando instalador do frontend...
if exist "frontend\CRM_System_0.0.0_x64_en-US.msi" (
    copy "frontend\CRM_System_0.0.0_x64_en-US.msi" "%FRONTEND_DIR%\" >nul
) else (
    echo AVISO: Instalador do frontend não encontrado
    echo Você precisará instalar o frontend manualmente
)

echo [3/4] Criando scripts de inicialização...
echo @echo off > "%INSTALL_DIR%\iniciar_crm.bat"
echo echo Iniciando CRM System... >> "%INSTALL_DIR%\iniciar_crm.bat"
echo cd /d "%BACKEND_DIR%" >> "%INSTALL_DIR%\iniciar_crm.bat"
echo start /min python -m flask run --host=127.0.0.1 --port=5000 >> "%INSTALL_DIR%\iniciar_crm.bat"
echo timeout /t 3 /nobreak ^>nul >> "%INSTALL_DIR%\iniciar_crm.bat"
echo start "" "http://127.0.0.1:5000" >> "%INSTALL_DIR%\iniciar_crm.bat"
echo pause >> "%INSTALL_DIR%\iniciar_crm.bat"

echo [4/4] Criando atalho na área de trabalho...
echo @echo off > "%USERPROFILE%\Desktop\CRM System.bat"
echo cd /d "%INSTALL_DIR%" >> "%USERPROFILE%\Desktop\CRM System.bat"
echo call iniciar_crm.bat >> "%USERPROFILE%\Desktop\CRM System.bat"

echo.
echo ========================================
echo    INSTALAÇÃO CONCLUÍDA!
echo ========================================
echo.
echo O CRM System foi instalado em: %INSTALL_DIR%
echo.
echo Para iniciar o sistema:
echo 1. Clique duas vezes no atalho "CRM System" na área de trabalho
echo 2. Ou execute: %INSTALL_DIR%\iniciar_crm.bat
echo.
echo O backend será iniciado automaticamente e o navegador abrirá.
echo.
pause 