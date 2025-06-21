@echo off
echo Script chamado pelo Tauri! > log_tauri_backend.txt
echo Iniciando run_backend.bat... >> log_backend.txt
REM Ativa o ambiente virtual e inicia o backend Flask

REM Checa se o Python está instalado
where python >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Python não encontrado! Instale o Python 3.8+ e tente novamente. >> log_backend.txt
    pause
    exit /b
)

REM Cria o ambiente virtual se não existir
IF NOT EXIST venv (
    echo Criando ambiente virtual... >> log_backend.txt
    python -m venv venv
)

REM Ativa o ambiente virtual
call venv\Scripts\activate

REM Instala as dependências
echo Instalando dependências... >> log_backend.txt
pip install --upgrade pip
pip install -r requirements.txt

REM Inicia o backend Flask
echo Iniciando o backend... >> log_backend.txt
cd src
set FLASK_APP=main.py
set FLASK_ENV=production
flask run >> ..\log_backend.txt 2>&1

echo run_backend.bat finalizado >> ..\log_backend.txt
pause 