@echo off
echo === TESTE DO BACKEND ===
echo.

echo 1. Verificando Python...
python --version
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Python nao encontrado!
    pause
    exit /b
)

echo.
echo 2. Verificando ambiente virtual...
if NOT EXIST venv (
    echo Criando ambiente virtual...
    python -m venv venv
)

echo.
echo 3. Ativando ambiente virtual...
call venv\Scripts\activate

echo.
echo 4. Verificando dependencias...
pip list | findstr flask
if %ERRORLEVEL% NEQ 0 (
    echo Instalando dependencias...
    pip install -r requirements.txt
)

echo.
echo 5. Testando conexao com banco...
cd src
python -c "from models.cliente import db; print('Conexao com banco OK')"
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Problema com banco de dados!
    pause
    exit /b
)

echo.
echo 6. Iniciando Flask...
set FLASK_APP=main.py
set FLASK_ENV=production
flask run

pause 