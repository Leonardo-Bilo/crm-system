import os
import subprocess
import time
import sys

BANCO = os.path.join('instance', 'crm_sistema.db')
BACKEND_CMD = [sys.executable, 'src/main.py']
RESET_CATEGORIAS_CMD = [sys.executable, 'reset_categorias.py']

print('=== RESET TOTAL FINAL DO CRM ===')

# 1. Apagar banco de dados
if os.path.exists(BANCO):
    try:
        os.remove(BANCO)
        print(f'✅ Banco de dados removido: {BANCO}')
    except Exception as e:
        print(f'❌ Erro ao remover banco: {e}')
        sys.exit(1)
else:
    print('ℹ️  Banco de dados não existe, prosseguindo...')

# 2. Iniciar backend para criar as tabelas
print('🚀 Iniciando backend temporariamente para criar tabelas...')
backend_proc = subprocess.Popen(BACKEND_CMD, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
time.sleep(5)  # Espera o backend subir e criar as tabelas
backend_proc.terminate()
try:
    backend_proc.wait(timeout=5)
except subprocess.TimeoutExpired:
    backend_proc.kill()
    print('⚠️ Backend forçado a parar.')
print('✅ Backend parado.')

# 3. Rodar reset de categorias
print('🔄 Resetando categorias...')
res = subprocess.run(RESET_CATEGORIAS_CMD)
if res.returncode != 0:
    print('❌ Erro ao resetar categorias!')
    sys.exit(1)
print('✅ Categorias resetadas!')

# 4. Mostrar categorias existentes
print('🔎 Listando categorias no banco...')
try:
    from listar_categorias_existentes import *
except Exception as e:
    print(f'❌ Erro ao listar categorias: {e}')

print('✅ Processo finalizado! Sistema restaurado do zero.') 