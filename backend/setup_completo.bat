@echo off
echo ========================================
echo    SETUP AUTOMATICO DO CRM
echo ========================================
echo.

echo [1/4] Verificando Python...
python --version
if %errorlevel% neq 0 (
    echo ERRO: Python nao encontrado!
    echo Instale o Python primeiro: https://python.org
    pause
    exit /b 1
)
echo.

echo [2/4] Instalando dependencias...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo AVISO: Erro ao instalar dependencias, continuando...
)
echo.

echo [3/4] Criando categorias no banco...
python criar_categorias_direto.py
if %errorlevel% neq 0 (
    echo ERRO: Falha ao criar categorias!
    pause
    exit /b 1
)
echo.

echo [4/4] Iniciando o backend...
echo.
echo ========================================
echo    BACKEND INICIADO COM SUCESSO!
echo ========================================
echo.
echo URL: http://localhost:5000
echo API Categorias: http://localhost:5000/api/categorias-produto
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
python src/main.py 