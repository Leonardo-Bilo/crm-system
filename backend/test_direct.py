#!/usr/bin/env python3
"""
Teste direto das rotas de produtos
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_direct_routes():
    """Testa as rotas diretamente"""
    print("🔍 Testando rotas diretamente...")
    
    # Testar rota básica de produtos
    print("\n1. Testando /api/produtos:")
    try:
        response = requests.get(f"{BASE_URL}/api/produtos")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Sucesso! Produtos: {len(data.get('produtos', data))}")
        else:
            print(f"   ❌ Erro: {response.text}")
    except Exception as e:
        print(f"   ❌ Exceção: {str(e)}")
    
    # Testar rota de estatísticas
    print("\n2. Testando /api/produtos/estatisticas:")
    try:
        response = requests.get(f"{BASE_URL}/api/produtos/estatisticas")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Sucesso! Estatísticas: {data}")
        else:
            print(f"   ❌ Erro: {response.text}")
    except Exception as e:
        print(f"   ❌ Exceção: {str(e)}")
    
    # Testar rota de exportação Excel
    print("\n3. Testando /api/produtos/exportar-excel:")
    try:
        response = requests.get(f"{BASE_URL}/api/produtos/exportar-excel")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print(f"   ✅ Sucesso! Excel gerado ({len(response.content)} bytes)")
        else:
            print(f"   ❌ Erro: {response.text}")
    except Exception as e:
        print(f"   ❌ Exceção: {str(e)}")
    
    # Testar rota de exportação PDF
    print("\n4. Testando /api/produtos/exportar-pdf:")
    try:
        response = requests.get(f"{BASE_URL}/api/produtos/exportar-pdf")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print(f"   ✅ Sucesso! PDF gerado ({len(response.content)} bytes)")
        else:
            print(f"   ❌ Erro: {response.text}")
    except Exception as e:
        print(f"   ❌ Exceção: {str(e)}")

if __name__ == "__main__":
    print("🚀 Iniciando testes diretos...")
    test_direct_routes()
    print("\n✅ Testes concluídos!") 