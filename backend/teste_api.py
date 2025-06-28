#!/usr/bin/env python3
"""
Script para testar se a API está funcionando
"""

import requests
import time

def testar_api():
    """Testa se a API está funcionando"""
    try:
        print("🔄 Testando API...")
        
        # Aguardar um pouco para o servidor inicializar
        time.sleep(2)
        
        # Testar endpoint de categorias
        response = requests.get("http://localhost:5000/api/categorias-produto", timeout=5)
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            categorias = data.get('categorias', [])
            
            print(f"✅ API funcionando!")
            print(f"📋 Total de categorias: {len(categorias)}")
            
            if categorias:
                print(f"🏷️  Primeiras 5 categorias:")
                for i, cat in enumerate(categorias[:5], 1):
                    print(f"   {i}. {cat['nome']} (ID: {cat['id']}, Cor: {cat['cor']})")
                
                # Verificar se há categorias de produtos e serviços
                produtos = [c for c in categorias if c['id'] <= 36]
                servicos = [c for c in categorias if c['id'] > 36]
                
                print(f"\n📊 Resumo:")
                print(f"   Produtos: {len(produtos)} categorias")
                print(f"   Serviços: {len(servicos)} categorias")
                
                return True
            else:
                print("❌ Nenhuma categoria encontrada!")
                return False
        else:
            print(f"❌ Erro na API: {response.status_code}")
            print(f"   Resposta: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Não foi possível conectar ao servidor!")
        print("   Certifique-se de que o backend está rodando")
        return False
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testando API do CRM...")
    print("=" * 40)
    
    if testar_api():
        print("\n✅ API está funcionando corretamente!")
        print("💡 Agora teste o frontend")
    else:
        print("\n❌ API não está funcionando!")
        print("💡 Verifique se o backend está rodando") 