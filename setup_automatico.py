#!/usr/bin/env python3
"""
Script automático para setup completo do CRM
"""

import os
import sys
import subprocess
import time

def executar_comando(comando, descricao):
    """Executa um comando e mostra o resultado"""
    print(f"🔄 {descricao}...")
    try:
        resultado = subprocess.run(comando, shell=True, capture_output=True, text=True, cwd=os.path.join(os.path.dirname(__file__), 'backend'))
        if resultado.returncode == 0:
            print(f"✅ {descricao} - Sucesso!")
            if resultado.stdout:
                print(f"   {resultado.stdout.strip()}")
            return True
        else:
            print(f"❌ {descricao} - Erro!")
            if resultado.stderr:
                print(f"   {resultado.stderr.strip()}")
            return False
    except Exception as e:
        print(f"❌ {descricao} - Exceção: {e}")
        return False

def main():
    print("🚀 SETUP AUTOMÁTICO DO CRM")
    print("=" * 50)
    
    # Verificar se estamos no diretório correto
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    if not os.path.exists(backend_dir):
        print("❌ Diretório 'backend' não encontrado!")
        print("Certifique-se de estar na pasta crm-backend")
        return False
    
    print(f"📁 Diretório backend: {backend_dir}")
    
    # 1. Verificar Python
    if not executar_comando("python --version", "Verificando Python"):
        return False
    
    # 2. Verificar arquivos necessários
    main_py = os.path.join(backend_dir, 'src', 'main.py')
    categorias_py = os.path.join(backend_dir, 'criar_categorias_direto.py')
    
    if not os.path.exists(main_py):
        print("❌ Arquivo src/main.py não encontrado!")
        return False
    
    if not os.path.exists(categorias_py):
        print("❌ Arquivo criar_categorias_direto.py não encontrado!")
        return False
    
    print("✅ Todos os arquivos necessários encontrados")
    
    # 3. Criar banco se necessário
    print("🔄 Verificando banco de dados...")
    try:
        sys.path.append(backend_dir)
        from src.main import app
        from src.models.cliente import db
        
        with app.app_context():
            db.create_all()
            print("✅ Banco de dados verificado/criado")
    except Exception as e:
        print(f"⚠️  Aviso: {e}")
    
    # 4. Criar categorias
    if not executar_comando("python criar_categorias_direto.py", "Criando categorias"):
        return False
    
    # 5. Iniciar backend
    print("\n🎉 SETUP CONCLUÍDO COM SUCESSO!")
    print("=" * 50)
    print("🚀 Iniciando o backend...")
    print("📱 URL: http://localhost:5000")
    print("🔗 API Categorias: http://localhost:5000/api/categorias-produto")
    print("⏹️  Pressione Ctrl+C para parar")
    print("=" * 50)
    
    # Iniciar o backend
    try:
        subprocess.run(["python", "src/main.py"], cwd=backend_dir)
    except KeyboardInterrupt:
        print("\n👋 Backend parado pelo usuário")
    except Exception as e:
        print(f"❌ Erro ao iniciar backend: {e}")
        return False
    
    return True

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Setup interrompido pelo usuário")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}") 