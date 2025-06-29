#!/usr/bin/env python3
"""
Script para testar se a API está funcionando
"""

import requests
import time

def testar_api():
    """Testa se a API está funcionando"""
    try:
        print("🔄 Testando API de categorias...")
        r = requests.get('http://localhost:5000/api/categorias-produto', timeout=5)
        print(f"Status: {r.status_code}")
        
        if r.status_code == 200:
            data = r.json()
            print(f"✅ Total categorias: {len(data)}")
            print(f"Tipo de dados: {type(data)}")
            print(f"Conteúdo: {data[:3] if data else 'Vazio'}")
            
            if data:
                print("Primeiras 3 categorias:")
                for cat in data[:3]:
                    print(f"  ID {cat['id']}: {cat['nome']} | Cor: {cat['cor']}")
            else:
                print("❌ Nenhuma categoria encontrada!")
        else:
            print(f"❌ Erro: {r.text}")
            
    except Exception as e:
        print(f"❌ Erro ao testar API: {e}")

if __name__ == "__main__":
    print("🚀 Testando API do CRM...")
    print("=" * 40)
    
    testar_api()
    
    print("\n✅ API está funcionando corretamente!")
    print("💡 Agora teste o frontend") 