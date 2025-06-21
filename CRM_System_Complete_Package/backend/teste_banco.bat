@echo off
echo === TESTE DE CONEXAO COM BANCO ===
echo.

cd src
echo Testando importacao do modelo...
python -c "from models.cliente import db; print('Import OK')"

echo.
echo Testando conexao com banco...
python -c "from models.cliente import db; from main import app; with app.app_context(): db.engine.connect(); print('Conexao OK')"

echo.
echo Se chegou ate aqui, o banco esta OK!
pause 