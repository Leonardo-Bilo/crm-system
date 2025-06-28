#!/usr/bin/env python3
"""
Script simples para testar e criar categorias
"""

import requests
import time

def testar_backend():
    """Testa se o backend está rodando"""
    try:
        response = requests.get("http://localhost:5000/api/categorias-produto", timeout=5)
        if response.status_code == 200:
            print("✅ Backend está rodando!")
            return True
        else:
            print(f"❌ Backend respondeu com status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend não está rodando. Inicie com: python src/main.py")
        return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def criar_categorias():
    """Cria as categorias padrão"""
    try:
        print("🔄 Criando categorias padrão...")
        response = requests.post(
            "http://localhost:5000/api/categorias-produto/criar-padrao",
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Categorias criadas com sucesso!")
            print(f"📊 Total: {result.get('total_categorias', 0)} categorias")
            return True
        else:
            print(f"❌ Erro ao criar categorias: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def listar_categorias():
    """Lista as categorias criadas"""
    try:
        response = requests.get("http://localhost:5000/api/categorias-produto", timeout=5)
        if response.status_code == 200:
            data = response.json()
            categorias = data.get('categorias', [])
            
            if categorias:
                print(f"\n📋 Categorias encontradas ({len(categorias)}):")
                for cat in categorias[:10]:  # Mostrar apenas as primeiras 10
                    print(f"  ID {cat['id']}: {cat['nome']} | Cor: {cat['cor']}")
                if len(categorias) > 10:
                    print(f"  ... e mais {len(categorias) - 10} categorias")
            else:
                print("❌ Nenhuma categoria encontrada")
                
        else:
            print(f"❌ Erro ao listar categorias: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erro ao listar categorias: {e}")

if __name__ == "__main__":
    print("🚀 Testando sistema de categorias...")
    print("=" * 50)
    
    # Testar se backend está rodando
    if testar_backend():
        # Criar categorias
        if criar_categorias():
            # Listar categorias
            listar_categorias()
        else:
            print("\n💡 Dica: Verifique se o banco de dados está configurado corretamente")
    else:
        print("\n💡 Para iniciar o backend:")
        print("1. cd backend")
        print("2. python src/main.py")
        print("3. Execute este script novamente") 