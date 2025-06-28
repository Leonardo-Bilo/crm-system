import os
from src.main import app

print('=== Diagnóstico do Banco de Dados ===')

# Caminho do banco configurado
uri = app.config['SQLALCHEMY_DATABASE_URI']
print(f'URI configurada: {uri}')

# Caminho absoluto do banco
if uri.startswith('sqlite:///'):
    banco_rel = uri.replace('sqlite:///', '')
    banco_abs = os.path.abspath(banco_rel)
    print(f'Banco de dados (relativo): {banco_rel}')
    print(f'Banco de dados (absoluto): {banco_abs}')
    print(f'Existe? {os.path.exists(banco_abs)}')
else:
    print('Banco não é SQLite ou URI diferente.')

print('\n=== Arquivos .db encontrados no projeto ===')
for root, dirs, files in os.walk(".."):
    for file in files:
        if file.endswith('.db'):
            path = os.path.abspath(os.path.join(root, file))
            print(path) 