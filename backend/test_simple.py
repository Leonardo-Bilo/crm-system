#!/usr/bin/env python3
"""
Teste simples para verificar o erro 500 na API de produtos
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_produtos_api():
    """Testa a API de produtos"""
    print("🔍 Testando API de produtos...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/produtos")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Sucesso! Produtos encontrados: {len(data.get('produtos', data))}")
        else:
            print(f"❌ Erro {response.status_code}")
            try:
                error_data = response.json()
                print(f"Erro: {error_data}")
            except:
                print(f"Resposta: {response.text}")
                
    except Exception as e:
        print(f"❌ Exceção: {str(e)}")

def test_export_pdf():
    """Testa a exportação PDF"""
    print("\n🔍 Testando exportação PDF...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/produtos/exportar-pdf")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ PDF gerado com sucesso!")
        else:
            print(f"❌ Erro {response.status_code}")
            try:
                error_data = response.json()
                print(f"Erro: {error_data}")
            except:
                print(f"Resposta: {response.text}")
                
    except Exception as e:
        print(f"❌ Exceção: {str(e)}")

def test_estatisticas():
    """Testa as estatísticas"""
    print("\n🔍 Testando estatísticas...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/produtos/estatisticas")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Estatísticas: {data}")
        else:
            print(f"❌ Erro {response.status_code}")
            try:
                error_data = response.json()
                print(f"Erro: {error_data}")
            except:
                print(f"Resposta: {response.text}")
                
    except Exception as e:
        print(f"❌ Exceção: {str(e)}")

if __name__ == "__main__":
    print("🚀 Iniciando testes simples...")
    test_produtos_api()
    test_export_pdf()
    test_estatisticas()
    print("\n✅ Testes concluídos!") 