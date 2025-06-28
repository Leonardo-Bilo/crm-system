#!/usr/bin/env python3
"""
Script para criar categorias padrão com IDs fixos no banco de dados
"""

import requests
import json

def criar_categorias_padrao():
    """Cria as categorias padrão via API"""
    try:
        # URL da API
        url = "http://localhost:5000/api/categorias-produto/criar-padrao"
        
        # Fazer requisição POST
        response = requests.post(url, headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Categorias criadas com sucesso!")
            print(f"📊 Categorias criadas: {result['categorias_criadas']}")
            print(f"📊 Categorias de produtos: {result['categorias_produtos']}")
            print(f"📊 Categorias de serviços: {result['categorias_servicos']}")
            print(f"📊 Total: {result['total_categorias']}")
            
            # Listar categorias criadas
            print("\n📋 Categorias criadas:")
            listar_categorias()
            
        else:
            print(f"❌ Erro: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Erro: Não foi possível conectar ao servidor.")
        print("Certifique-se de que o backend está rodando em http://localhost:5000")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")

def listar_categorias():
    """Lista todas as categorias no banco"""
    try:
        url = "http://localhost:5000/api/categorias-produto"
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            categorias = data.get('categorias', [])
            
            # Separar produtos e serviços
            produtos = [c for c in categorias if c['id'] <= 36]
            servicos = [c for c in categorias if c['id'] > 36]
            
            print("\n🏷️  CATEGORIAS DE PRODUTOS:")
            for cat in produtos:
                print(f"  ID {cat['id']:2d}: {cat['nome']:<20} | Cor: {cat['cor']}")
            
            print("\n🔧 CATEGORIAS DE SERVIÇOS:")
            for cat in servicos:
                print(f"  ID {cat['id']:2d}: {cat['nome']:<20} | Cor: {cat['cor']}")
                
        else:
            print(f"❌ Erro ao listar categorias: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erro ao listar categorias: {e}")

if __name__ == "__main__":
    print("🚀 Criando categorias padrão...")
    print("=" * 50)
    criar_categorias_padrao() 