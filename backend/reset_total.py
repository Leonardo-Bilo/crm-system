import os
import subprocess
import time
import requests
import signal
import sys

BANCO = os.path.join('instance', 'crm_sistema.db')
BACKEND_CMD = [sys.executable, 'src/main.py']
RESET_CATEGORIAS_CMD = [sys.executable, 'reset_categorias.py']

print('=== RESET TOTAL AUTOMÁTICO DO CRM ===')

# 1. Parar backend rodando (se possível)
# (No Windows, normalmente não há backend rodando em background via script)

# 2. Apagar banco de dados
if os.path.exists(BANCO):
    try:
        os.remove(BANCO)
        print(f'✅ Banco de dados removido: {BANCO}')
    except Exception as e:
        print(f'❌ Erro ao remover banco: {e}')
        sys.exit(1)
else:
    print('ℹ️  Banco de dados não existe, prosseguindo...')

# 3. Iniciar backend para criar as tabelas
print('🚀 Iniciando backend temporariamente para criar tabelas...')
backend_proc = subprocess.Popen(BACKEND_CMD, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
time.sleep(5)  # Espera o backend subir e criar as tabelas

# 4. Parar backend
backend_proc.terminate()
try:
    backend_proc.wait(timeout=5)
except subprocess.TimeoutExpired:
    backend_proc.kill()
    print('⚠️ Backend forçado a parar.')
print('✅ Backend parado.')

# 5. Rodar reset de categorias
print('🔄 Resetando categorias...')
res = subprocess.run(RESET_CATEGORIAS_CMD)
if res.returncode != 0:
    print('❌ Erro ao resetar categorias!')
    sys.exit(1)
print('✅ Categorias resetadas!')

# 6. Iniciar backend novamente para testar API
print('🚀 Iniciando backend para testar API...')
backend_proc = subprocess.Popen(BACKEND_CMD, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
time.sleep(5)

try:
    print('🔎 Testando API de categorias...')
    r = requests.get('http://localhost:5000/api/categorias-produto', timeout=5)
    if r.status_code == 200:
        cats = r.json().get('categorias', [])
        print(f'✅ API OK! {len(cats)} categorias retornadas.')
        print('Exemplo:', cats[:3])
    else:
        print(f'❌ API retornou status {r.status_code}')
except Exception as e:
    print(f'❌ Erro ao testar API: {e}')

backend_proc.terminate()
try:
    backend_proc.wait(timeout=5)
except subprocess.TimeoutExpired:
    backend_proc.kill()
    print('⚠️ Backend forçado a parar.')
print('✅ Processo finalizado!') 