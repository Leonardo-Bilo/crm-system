@echo off
echo ========================================
echo    INSTALADOR CRM SYSTEM - COMPLETO
echo ========================================
echo.
echo Este instalador irá:
echo 1. Configurar o ambiente Python
echo 2. Instalar o backend Flask
echo 3. Instalar o frontend desktop
echo 4. Criar atalhos de inicialização
echo.
echo IMPORTANTE: Esta instalação não requer privilégios de administrador
echo e será feita na pasta do usuário.
echo.
pause

REM Define diretórios
set INSTALL_DIR=%USERPROFILE%\Desktop\CRM System
set BACKEND_DIR=%INSTALL_DIR%\backend
set FRONTEND_DIR=%INSTALL_DIR%\frontend
set VENV_DIR=%USERPROFILE%\crm_venv

echo.
echo [1/5] Criando estrutura de pastas...
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
if not exist "%BACKEND_DIR%" mkdir "%BACKEND_DIR%"
if not exist "%FRONTEND_DIR%" mkdir "%FRONTEND_DIR%"

echo [2/5] Copiando arquivos do backend...
xcopy "crm-backend\*" "%BACKEND_DIR%\" /E /I /Y >nul
if errorlevel 1 (
    echo ERRO: Falha ao copiar arquivos do backend
    pause
    exit /b 1
)

echo [3/5] Configurando ambiente Python...
REM Verifica se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python não está instalado
    echo Por favor, instale o Python 3.8+ e tente novamente
    pause
    exit /b 1
)

REM Cria ambiente virtual
if exist "%VENV_DIR%" rmdir /s /q "%VENV_DIR%"
python -m venv "%VENV_DIR%"
if errorlevel 1 (
    echo ERRO: Falha ao criar ambiente virtual
    pause
    exit /b 1
)

REM Ativa ambiente e instala dependências
call "%VENV_DIR%\Scripts\activate.bat"
python -m pip install --upgrade pip
pip install -r "%BACKEND_DIR%\requirements.txt"

echo [4/5] Instalando frontend...
if exist "..\crm-frontend\crm-frontend\src-tauri\target\release\bundle\msi\CRM System_0.1.0_x64_en-US.msi" (
    echo Instalando aplicativo desktop...
    copy "..\crm-frontend\crm-frontend\src-tauri\target\release\bundle\msi\CRM System_0.1.0_x64_en-US.msi" "%FRONTEND_DIR%\"
    msiexec /i "%FRONTEND_DIR%\CRM System_0.1.0_x64_en-US.msi" /quiet
    timeout /t 5 /nobreak >nul
) else (
    echo AVISO: Instalador do frontend não encontrado
    echo Procurando em outras localizações...
    if exist "frontend\CRM System_0.1.0_x64_en-US.msi" (
        echo Instalador encontrado na pasta frontend local
        msiexec /i "frontend\CRM System_0.1.0_x64_en-US.msi" /quiet
        timeout /t 5 /nobreak >nul
    ) else (
        echo AVISO: Instalador do frontend não encontrado
        echo O frontend será acessado via navegador
    )
)

echo [5/5] Criando scripts de inicialização...

REM Script principal de inicialização
echo @echo off > "%INSTALL_DIR%\iniciar_crm.bat"
echo echo ======================================== >> "%INSTALL_DIR%\iniciar_crm.bat"
echo echo    INICIANDO CRM SYSTEM >> "%INSTALL_DIR%\iniciar_crm.bat"
echo echo ======================================== >> "%INSTALL_DIR%\iniciar_crm.bat"
echo echo. >> "%INSTALL_DIR%\iniciar_crm.bat"
echo echo Ativando ambiente Python... >> "%INSTALL_DIR%\iniciar_crm.bat"
echo call "%VENV_DIR%\Scripts\activate.bat" >> "%INSTALL_DIR%\iniciar_crm.bat"
echo echo. >> "%INSTALL_DIR%\iniciar_crm.bat"
echo echo Iniciando servidor backend... >> "%INSTALL_DIR%\iniciar_crm.bat"
echo cd /d "%BACKEND_DIR%" >> "%INSTALL_DIR%\iniciar_crm.bat"
echo start /min python -m flask run --host=127.0.0.1 --port=5000 >> "%INSTALL_DIR%\iniciar_crm.bat"
echo echo. >> "%INSTALL_DIR%\iniciar_crm.bat"
echo echo Aguardando servidor inicializar... >> "%INSTALL_DIR%\iniciar_crm.bat"
echo timeout /t 3 /nobreak ^>nul >> "%INSTALL_DIR%\iniciar_crm.bat"
echo echo. >> "%INSTALL_DIR%\iniciar_crm.bat"
echo echo Abrindo CRM no navegador... >> "%INSTALL_DIR%\iniciar_crm.bat"
echo start "" "http://127.0.0.1:5000" >> "%INSTALL_DIR%\iniciar_crm.bat"
echo echo. >> "%INSTALL_DIR%\iniciar_crm.bat"
echo echo CRM System iniciado com sucesso! >> "%INSTALL_DIR%\iniciar_crm.bat"
echo echo Pressione qualquer tecla para fechar esta janela... >> "%INSTALL_DIR%\iniciar_crm.bat"
echo pause ^>nul >> "%INSTALL_DIR%\iniciar_crm.bat"

REM Atalho na área de trabalho
echo @echo off > "%USERPROFILE%\Desktop\CRM System.bat"
echo cd /d "%INSTALL_DIR%" >> "%USERPROFILE%\Desktop\CRM System.bat"
echo call iniciar_crm.bat >> "%USERPROFILE%\Desktop\CRM System.bat"

echo.
echo ========================================
echo    INSTALAÇÃO CONCLUÍDA!
echo ========================================
echo.
echo O CRM System foi instalado com sucesso!
echo.
echo Localização: %INSTALL_DIR%
echo Ambiente Python: %VENV_DIR%
echo.
echo Para iniciar o sistema:
echo 1. Clique duas vezes no atalho "CRM System" na área de trabalho
echo 2. Ou execute: %INSTALL_DIR%\iniciar_crm.bat
echo.
echo O sistema irá:
echo - Iniciar o servidor backend Flask
echo - Abrir o CRM no navegador
echo - Manter o servidor rodando em segundo plano
echo.
echo Para parar o servidor, feche a janela do navegador.
echo.
pause 