@echo off
echo ========================================
echo    CONFIGURADOR DE AMBIENTE PYTHON
echo ========================================
echo.

REM Verifica se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python não está instalado ou não está no PATH
    echo Por favor, instale o Python 3.8+ e tente novamente
    pause
    exit /b 1
)

echo Python encontrado!
python --version

echo.
echo [1/3] Criando ambiente virtual na pasta do usuário...
set VENV_DIR=%USERPROFILE%\crm_venv

REM Remove ambiente virtual existente se houver
if exist "%VENV_DIR%" (
    echo Removendo ambiente virtual existente...
    rmdir /s /q "%VENV_DIR%"
)

REM Cria novo ambiente virtual
python -m venv "%VENV_DIR%"
if errorlevel 1 (
    echo ERRO: Não foi possível criar o ambiente virtual
    pause
    exit /b 1
)

echo [2/3] Ativando ambiente virtual e instalando dependências...
call "%VENV_DIR%\Scripts\activate.bat"

REM Atualiza pip
python -m pip install --upgrade pip

REM Instala dependências
echo Instalando dependências do CRM...
pip install -r requirements.txt

if errorlevel 1 (
    echo ERRO: Falha ao instalar dependências
    echo Tentando instalar uma por vez...
    
    pip install Flask==3.1.0
    pip install flask-cors==6.0.0
    pip install Flask-SQLAlchemy==3.1.1
    pip install PyMySQL==1.1.1
    pip install pandas
    pip install openpyxl==3.1.5
    pip install reportlab==4.4.1
)

echo [3/3] Configurando variáveis de ambiente...
echo @echo off > "%USERPROFILE%\Desktop\CRM System.bat"
echo set PYTHONPATH=%VENV_DIR%\Scripts >> "%USERPROFILE%\Desktop\CRM System.bat"
echo call "%VENV_DIR%\Scripts\activate.bat" >> "%USERPROFILE%\Desktop\CRM System.bat"
echo cd /d "%~dp0backend" >> "%USERPROFILE%\Desktop\CRM System.bat"
echo start /min python -m flask run --host=127.0.0.1 --port=5000 >> "%USERPROFILE%\Desktop\CRM System.bat"
echo timeout /t 3 /nobreak ^>nul >> "%USERPROFILE%\Desktop\CRM System.bat"
echo start "" "http://127.0.0.1:5000" >> "%USERPROFILE%\Desktop\CRM System.bat"
echo pause >> "%USERPROFILE%\Desktop\CRM System.bat"

echo.
echo ========================================
echo    CONFIGURAÇÃO CONCLUÍDA!
echo ========================================
echo.
echo Ambiente virtual criado em: %VENV_DIR%
echo.
echo Para iniciar o CRM:
echo 1. Clique duas vezes no atalho "CRM System" na área de trabalho
echo 2. Ou execute: "%VENV_DIR%\Scripts\activate.bat" ^&^& python -m flask run
echo.
pause 