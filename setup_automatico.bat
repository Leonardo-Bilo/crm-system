@echo off
echo ========================================
echo    SETUP AUTOMATICO DO CRM
echo ========================================
echo.

echo [1/5] Navegando para o diretorio correto...
cd /d "%~dp0backend"
if %errorlevel% neq 0 (
    echo ERRO: Diretorio backend nao encontrado!
    echo Certifique-se de estar na pasta crm-backend
    pause
    exit /b 1
)
echo ✅ Diretorio correto: %cd%
echo.

echo [2/5] Verificando Python...
python --version
if %errorlevel% neq 0 (
    echo ERRO: Python nao encontrado!
    echo Instale o Python primeiro: https://python.org
    pause
    exit /b 1
)
echo.

echo [3/5] Verificando arquivos necessarios...
if not exist "src\main.py" (
    echo ERRO: Arquivo src\main.py nao encontrado!
    echo Certifique-se de estar na pasta correta
    pause
    exit /b 1
)
if not exist "criar_categorias_direto.py" (
    echo ERRO: Arquivo criar_categorias_direto.py nao encontrado!
    pause
    exit /b 1
)
echo ✅ Todos os arquivos encontrados
echo.

echo [4/5] Criando categorias no banco...
python criar_categorias_direto.py
if %errorlevel% neq 0 (
    echo ERRO: Falha ao criar categorias!
    echo Tentando criar banco primeiro...
    python -c "from src.main import app; from src.models.cliente import db; app.app_context().push(); db.create_all(); print('Banco criado!')"
    python criar_categorias_direto.py
    if %errorlevel% neq 0 (
        echo ERRO: Falha definitiva ao criar categorias!
        pause
        exit /b 1
    )
)
echo.

echo [5/5] Iniciando o backend...
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