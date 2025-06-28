#!/usr/bin/env python3
"""
Script de teste completo para as APIs de Produtos/Serviços
Testa CRUD completo, categorias, filtros e funcionalidades avançadas
"""

import requests
import json
import time
from datetime import datetime

# Configuração
BASE_URL = "http://localhost:5000"
API_BASE = f"{BASE_URL}/api"

def print_section(title):
    """Imprime uma seção de teste"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def print_test(test_name, success=True, details=""):
    """Imprime resultado de um teste"""
    status = "✅ PASSOU" if success else "❌ FALHOU"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

def test_api_connection():
    """Testa se a API está respondendo"""
    print_section("TESTE DE CONEXÃO")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print_test("API respondendo", True, f"Status: {response.status_code}")
            return True
        else:
            print_test("API respondendo", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("API respondendo", False, f"Erro: {str(e)}")
        return False

def test_categorias_crud():
    """Testa CRUD completo de categorias"""
    print_section("TESTE CRUD CATEGORIAS")
    
    # Listar categorias
    try:
        response = requests.get(f"{API_BASE}/categorias-produto")
        if response.status_code == 200:
            categorias = response.json()
            print_test("Listar categorias", True, f"Encontradas: {len(categorias)}")
        else:
            print_test("Listar categorias", False, f"Status: {response.status_code}")
            return []
    except Exception as e:
        print_test("Listar categorias", False, f"Erro: {str(e)}")
        return []
    
    # Criar categoria de teste
    nova_categoria = {
        "nome": f"Categoria Teste {datetime.now().strftime('%H%M%S')}",
        "descricao": "Categoria criada para testes"
    }
    
    try:
        response = requests.post(f"{API_BASE}/categorias-produto", json=nova_categoria)
        if response.status_code == 201:
            categoria_criada = response.json()
            categoria_id = categoria_criada['id']
            print_test("Criar categoria", True, f"ID: {categoria_id}")
        else:
            print_test("Criar categoria", False, f"Status: {response.status_code}")
            return []
    except Exception as e:
        print_test("Criar categoria", False, f"Erro: {str(e)}")
        return []
    
    # Buscar categoria criada
    try:
        response = requests.get(f"{API_BASE}/categorias-produto/{categoria_id}")
        if response.status_code == 200:
            categoria = response.json()
            print_test("Buscar categoria", True, f"Nome: {categoria['nome']}")
        else:
            print_test("Buscar categoria", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Buscar categoria", False, f"Erro: {str(e)}")
    
    # Atualizar categoria
    categoria_atualizada = {
        "nome": f"Categoria Atualizada {datetime.now().strftime('%H%M%S')}",
        "descricao": "Categoria atualizada para testes"
    }
    
    try:
        response = requests.put(f"{API_BASE}/categorias-produto/{categoria_id}", json=categoria_atualizada)
        if response.status_code == 200:
            print_test("Atualizar categoria", True, "Categoria atualizada")
        else:
            print_test("Atualizar categoria", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Atualizar categoria", False, f"Erro: {str(e)}")
    
    return [categoria_id]

def test_produtos_crud():
    """Testa CRUD completo de produtos"""
    print_section("TESTE CRUD PRODUTOS")
    
    # Listar produtos
    try:
        response = requests.get(f"{API_BASE}/produtos")
        if response.status_code == 200:
            produtos = response.json()
            print_test("Listar produtos", True, f"Encontrados: {len(produtos.get('produtos', produtos))}")
        else:
            print_test("Listar produtos", False, f"Status: {response.status_code}")
            return []
    except Exception as e:
        print_test("Listar produtos", False, f"Erro: {str(e)}")
        return []
    
    # Criar produto de teste
    novo_produto = {
        "nome": f"Produto Teste {datetime.now().strftime('%H%M%S')}",
        "descricao": "Produto criado para testes",
        "codigo": f"TESTE{datetime.now().strftime('%H%M%S')}",
        "tipo": "produto",
        "categoria_id": 1,
        "custo": 10.50,
        "valor_venda": 25.00,
        "estoque_atual": 100,
        "estoque_minimo": 10,
        "unidade_medida": "un",
        "fornecedor": "Fornecedor Teste",
        "tempo_entrega": "5",
        "observacoes": "Produto para testes",
        "status": "ativo",
        "destaque": True
    }
    
    try:
        response = requests.post(f"{API_BASE}/produtos", json=novo_produto)
        if response.status_code == 201:
            produto_criado = response.json()
            produto_id = produto_criado['id']
            print_test("Criar produto", True, f"ID: {produto_id}")
        else:
            print_test("Criar produto", False, f"Status: {response.status_code}")
            return []
    except Exception as e:
        print_test("Criar produto", False, f"Erro: {str(e)}")
        return []
    
    # Buscar produto criado
    try:
        response = requests.get(f"{API_BASE}/produtos/{produto_id}")
        if response.status_code == 200:
            produto = response.json()
            print_test("Buscar produto", True, f"Nome: {produto['nome']}")
        else:
            print_test("Buscar produto", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Buscar produto", False, f"Erro: {str(e)}")
    
    # Atualizar produto
    produto_atualizado = {
        "nome": f"Produto Atualizado {datetime.now().strftime('%H%M%S')}",
        "descricao": "Produto atualizado para testes",
        "valor_venda": 30.00,
        "estoque_atual": 150
    }
    
    try:
        response = requests.put(f"{API_BASE}/produtos/{produto_id}", json=produto_atualizado)
        if response.status_code == 200:
            print_test("Atualizar produto", True, "Produto atualizado")
        else:
            print_test("Atualizar produto", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Atualizar produto", False, f"Erro: {str(e)}")
    
    # Criar serviço de teste
    novo_servico = {
        "nome": f"Serviço Teste {datetime.now().strftime('%H%M%S')}",
        "descricao": "Serviço criado para testes",
        "codigo": f"SERV{datetime.now().strftime('%H%M%S')}",
        "tipo": "servico",
        "categoria_id": 1,
        "custo": 15.00,
        "valor_venda": 50.00,
        "fornecedor": "Prestador Teste",
        "tempo_entrega": "2",
        "observacoes": "Serviço para testes",
        "status": "ativo",
        "destaque": False
    }
    
    try:
        response = requests.post(f"{API_BASE}/produtos", json=novo_servico)
        if response.status_code == 201:
            servico_criado = response.json()
            servico_id = servico_criado['id']
            print_test("Criar serviço", True, f"ID: {servico_id}")
        else:
            print_test("Criar serviço", False, f"Status: {response.status_code}")
            servico_id = None
    except Exception as e:
        print_test("Criar serviço", False, f"Erro: {str(e)}")
        servico_id = None
    
    return [produto_id, servico_id]

def test_filtros_e_busca():
    """Testa filtros e busca de produtos"""
    print_section("TESTE FILTROS E BUSCA")
    
    # Buscar por nome
    try:
        response = requests.get(f"{API_BASE}/produtos?busca=Teste")
        if response.status_code == 200:
            produtos = response.json()
            print_test("Busca por nome", True, f"Encontrados: {len(produtos.get('produtos', produtos))}")
        else:
            print_test("Busca por nome", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Busca por nome", False, f"Erro: {str(e)}")
    
    # Filtrar por tipo
    try:
        response = requests.get(f"{API_BASE}/produtos?tipo=produto")
        if response.status_code == 200:
            produtos = response.json()
            print_test("Filtrar por tipo produto", True, f"Encontrados: {len(produtos.get('produtos', produtos))}")
        else:
            print_test("Filtrar por tipo produto", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Filtrar por tipo produto", False, f"Erro: {str(e)}")
    
    # Filtrar por status
    try:
        response = requests.get(f"{API_BASE}/produtos?status=ativo")
        if response.status_code == 200:
            produtos = response.json()
            print_test("Filtrar por status ativo", True, f"Encontrados: {len(produtos.get('produtos', produtos))}")
        else:
            print_test("Filtrar por status ativo", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Filtrar por status ativo", False, f"Erro: {str(e)}")

def test_estatisticas():
    """Testa endpoints de estatísticas"""
    print_section("TESTE ESTATÍSTICAS")
    
    # Estatísticas gerais
    try:
        response = requests.get(f"{API_BASE}/produtos/estatisticas")
        if response.status_code == 200:
            stats = response.json()
            print_test("Estatísticas gerais", True, f"Total: {stats.get('total', 'N/A')}")
        else:
            print_test("Estatísticas gerais", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Estatísticas gerais", False, f"Erro: {str(e)}")
    
    # Produtos em destaque
    try:
        response = requests.get(f"{API_BASE}/produtos?destaque=true")
        if response.status_code == 200:
            produtos = response.json()
            print_test("Produtos em destaque", True, f"Encontrados: {len(produtos.get('produtos', produtos))}")
        else:
            print_test("Produtos em destaque", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Produtos em destaque", False, f"Erro: {str(e)}")
    
    # Produtos com estoque baixo
    try:
        response = requests.get(f"{API_BASE}/produtos?estoque_baixo=true")
        if response.status_code == 200:
            produtos = response.json()
            print_test("Produtos estoque baixo", True, f"Encontrados: {len(produtos.get('produtos', produtos))}")
        else:
            print_test("Produtos estoque baixo", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Produtos estoque baixo", False, f"Erro: {str(e)}")

def test_exportacao():
    """Testa endpoints de exportação"""
    print_section("TESTE EXPORTAÇÃO")
    
    # Exportar Excel
    try:
        response = requests.get(f"{API_BASE}/produtos/exportar-excel")
        if response.status_code == 200:
            print_test("Exportar Excel", True, f"Tamanho: {len(response.content)} bytes")
        else:
            print_test("Exportar Excel", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Exportar Excel", False, f"Erro: {str(e)}")
    
    # Exportar PDF
    try:
        response = requests.get(f"{API_BASE}/produtos/exportar-pdf")
        if response.status_code == 200:
            print_test("Exportar PDF", True, f"Tamanho: {len(response.content)} bytes")
        else:
            print_test("Exportar PDF", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Exportar PDF", False, f"Erro: {str(e)}")

def limpar_dados_teste(produto_ids, categoria_ids):
    """Remove dados de teste"""
    print_section("LIMPEZA DE DADOS DE TESTE")
    
    # Remover produtos
    for produto_id in produto_ids:
        if produto_id:
            try:
                response = requests.delete(f"{API_BASE}/produtos/{produto_id}")
                if response.status_code == 200:
                    print_test(f"Remover produto {produto_id}", True)
                else:
                    print_test(f"Remover produto {produto_id}", False, f"Status: {response.status_code}")
            except Exception as e:
                print_test(f"Remover produto {produto_id}", False, f"Erro: {str(e)}")
    
    # Remover categorias
    for categoria_id in categoria_ids:
        if categoria_id:
            try:
                response = requests.delete(f"{API_BASE}/categorias-produto/{categoria_id}")
                if response.status_code == 200:
                    print_test(f"Remover categoria {categoria_id}", True)
                else:
                    print_test(f"Remover categoria {categoria_id}", False, f"Status: {response.status_code}")
            except Exception as e:
                print_test(f"Remover categoria {categoria_id}", False, f"Erro: {str(e)}")

def main():
    """Função principal"""
    print("🚀 INICIANDO TESTES COMPLETOS DA API DE PRODUTOS/SERVIÇOS")
    print(f"📡 URL Base: {BASE_URL}")
    print(f"⏰ Início: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Teste de conexão
    if not test_api_connection():
        print("\n❌ API não está respondendo. Verifique se o backend está rodando.")
        return
    
    # Aguardar um pouco para garantir que a API está pronta
    time.sleep(1)
    
    # Testes de categorias
    categoria_ids = test_categorias_crud()
    
    # Testes de produtos
    produto_ids = test_produtos_crud()
    
    # Testes de filtros e busca
    test_filtros_e_busca()
    
    # Testes de estatísticas
    test_estatisticas()
    
    # Testes de exportação
    test_exportacao()
    
    # Limpeza (opcional - comentar se quiser manter os dados)
    # limpar_dados_teste(produto_ids, categoria_ids)
    
    print_section("RESUMO DOS TESTES")
    print("✅ Testes concluídos!")
    print(f"⏰ Fim: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\n📝 Próximos passos:")
    print("1. Verifique se o frontend está rodando em http://localhost:5173")
    print("2. Acesse a seção 'Produtos/Serviços' no menu lateral")
    print("3. Teste as funcionalidades: criar, editar, filtrar, exportar")
    print("4. Verifique se as estatísticas estão sendo exibidas corretamente")

if __name__ == "__main__":
    main() 