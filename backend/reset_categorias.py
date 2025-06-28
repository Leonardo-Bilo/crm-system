#!/usr/bin/env python3
"""
Script para resetar, criar e testar categorias no banco e na API.
"""
import os
import sys
import time
from sqlalchemy import text

# Adiciona o src ao path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.main import app
from src.models.produto import CategoriaProduto, Produto
from src.models.cliente import db

# Categorias padrão
CATEGORIAS_PRODUTOS = [
    {"id": 1, "nome": "Eletrônicos", "descricao": "Produtos eletrônicos e tecnológicos", "cor": "#3B82F6"},
    {"id": 2, "nome": "Informática", "descricao": "Computadores, notebooks e acessórios", "cor": "#1E40AF"},
    {"id": 3, "nome": "Smartphones", "descricao": "Celulares e acessórios móveis", "cor": "#7C3AED"},
    {"id": 4, "nome": "Vestuário", "descricao": "Roupas, calçados e acessórios", "cor": "#EC4899"},
    {"id": 5, "nome": "Casa e Jardim", "descricao": "Produtos para casa e jardinagem", "cor": "#10B981"},
    {"id": 6, "nome": "Esportes", "descricao": "Equipamentos e roupas esportivas", "cor": "#F59E0B"},
    {"id": 7, "nome": "Livros", "descricao": "Livros, revistas e material didático", "cor": "#8B5CF6"},
    {"id": 8, "nome": "Brinquedos", "descricao": "Brinquedos e jogos", "cor": "#EF4444"},
    {"id": 9, "nome": "Beleza", "descricao": "Produtos de beleza e cosméticos", "cor": "#F97316"},
    {"id": 10, "nome": "Saúde", "descricao": "Produtos de saúde e bem-estar", "cor": "#06B6D4"},
    {"id": 11, "nome": "Automotivo", "descricao": "Produtos para veículos", "cor": "#84CC16"},
    {"id": 12, "nome": "Ferramentas", "descricao": "Ferramentas e equipamentos", "cor": "#6B7280"},
    {"id": 13, "nome": "Alimentos", "descricao": "Produtos alimentícios", "cor": "#FBBF24"},
    {"id": 14, "nome": "Bebidas", "descricao": "Bebidas e refrigerantes", "cor": "#34D399"},
    {"id": 15, "nome": "Limpeza", "descricao": "Produtos de limpeza", "cor": "#60A5FA"},
    {"id": 16, "nome": "Papelaria", "descricao": "Material escolar e de escritório", "cor": "#A78BFA"},
    {"id": 17, "nome": "Móveis", "descricao": "Móveis e decoração", "cor": "#F87171"},
    {"id": 18, "nome": "Jóias", "descricao": "Jóias e bijuterias", "cor": "#FCD34D"},
    {"id": 19, "nome": "Relógios", "descricao": "Relógios e cronômetros", "cor": "#A3E635"},
    {"id": 20, "nome": "Câmeras", "descricao": "Câmeras e equipamentos fotográficos", "cor": "#818CF8"},
    {"id": 21, "nome": "Áudio", "descricao": "Equipamentos de áudio e som", "cor": "#FB7185"},
    {"id": 22, "nome": "Games", "descricao": "Jogos eletrônicos e consoles", "cor": "#4F46E5"},
    {"id": 23, "nome": "Pet Shop", "descricao": "Produtos para animais de estimação", "cor": "#F472B6"},
    {"id": 24, "nome": "Bebês", "descricao": "Produtos para bebês e crianças", "cor": "#34D399"},
    {"id": 25, "nome": "Camping", "descricao": "Equipamentos para camping e outdoor", "cor": "#059669"},
    {"id": 26, "nome": "Musical", "descricao": "Instrumentos musicais e acessórios", "cor": "#DC2626"},
    {"id": 27, "nome": "Arte", "descricao": "Material de arte e artesanato", "cor": "#EA580C"},
    {"id": 28, "nome": "Fitness", "descricao": "Equipamentos de academia e fitness", "cor": "#7C2D12"},
    {"id": 29, "nome": "Viagem", "descricao": "Produtos para viagem e turismo", "cor": "#1D4ED8"},
    {"id": 30, "nome": "Escritório", "descricao": "Produtos para escritório", "cor": "#374151"},
    {"id": 31, "nome": "Industrial", "descricao": "Produtos industriais", "cor": "#1F2937"},
    {"id": 32, "nome": "Construção", "descricao": "Material de construção", "cor": "#92400E"},
    {"id": 33, "nome": "Energia", "descricao": "Produtos relacionados a energia", "cor": "#F59E0B"},
    {"id": 34, "nome": "Segurança", "descricao": "Produtos de segurança", "cor": "#DC2626"},
    {"id": 35, "nome": "Telecomunicações", "descricao": "Produtos de telecomunicações", "cor": "#2563EB"},
    {"id": 36, "nome": "Outros", "descricao": "Outros produtos", "cor": "#6B7280"}
]
CATEGORIAS_SERVICOS = [
    {"id": 37, "nome": "Consultoria", "descricao": "Serviços de consultoria", "cor": "#8B5CF6"},
    {"id": 38, "nome": "Manutenção", "descricao": "Serviços de manutenção", "cor": "#F59E0B"},
    {"id": 39, "nome": "Tecnologia", "descricao": "Serviços de tecnologia", "cor": "#3B82F6"},
    {"id": 40, "nome": "Design", "descricao": "Serviços de design", "cor": "#EC4899"},
    {"id": 41, "nome": "Marketing", "descricao": "Serviços de marketing", "cor": "#10B981"},
    {"id": 42, "nome": "Educação", "descricao": "Serviços educacionais", "cor": "#F97316"},
    {"id": 43, "nome": "Saúde", "descricao": "Serviços de saúde", "cor": "#EF4444"},
    {"id": 44, "nome": "Beleza", "descricao": "Serviços de beleza", "cor": "#F472B6"},
    {"id": 45, "nome": "Limpeza", "descricao": "Serviços de limpeza", "cor": "#60A5FA"},
    {"id": 46, "nome": "Transporte", "descricao": "Serviços de transporte", "cor": "#34D399"},
    {"id": 47, "nome": "Eventos", "descricao": "Serviços para eventos", "cor": "#A78BFA"},
    {"id": 48, "nome": "Jurídico", "descricao": "Serviços jurídicos", "cor": "#6B7280"},
    {"id": 49, "nome": "Contabilidade", "descricao": "Serviços contábeis", "cor": "#F87171"},
    {"id": 50, "nome": "Segurança", "descricao": "Serviços de segurança", "cor": "#DC2626"},
    {"id": 51, "nome": "Instalação", "descricao": "Serviços de instalação", "cor": "#F59E0B"},
    {"id": 52, "nome": "Reparo", "descricao": "Serviços de reparo", "cor": "#7C3AED"},
    {"id": 53, "nome": "Treinamento", "descricao": "Serviços de treinamento", "cor": "#06B6D4"},
    {"id": 54, "nome": "Suporte", "descricao": "Serviços de suporte técnico", "cor": "#84CC16"},
    {"id": 55, "nome": "Desenvolvimento", "descricao": "Desenvolvimento de software", "cor": "#1E40AF"},
    {"id": 56, "nome": "Hosting", "descricao": "Serviços de hospedagem", "cor": "#7C2D12"},
    {"id": 57, "nome": "Domínio", "descricao": "Serviços de domínio", "cor": "#059669"},
    {"id": 58, "nome": "Backup", "descricao": "Serviços de backup", "cor": "#1D4ED8"},
    {"id": 59, "nome": "Cloud", "descricao": "Serviços em nuvem", "cor": "#374151"},
    {"id": 60, "nome": "SEO", "descricao": "Serviços de SEO", "cor": "#1F2937"},
    {"id": 61, "nome": "Social Media", "descricao": "Gestão de redes sociais", "cor": "#92400E"},
    {"id": 62, "nome": "Fotografia", "descricao": "Serviços fotográficos", "cor": "#F59E0B"},
    {"id": 63, "nome": "Vídeo", "descricao": "Serviços de vídeo", "cor": "#DC2626"},
    {"id": 64, "nome": "Áudio", "descricao": "Serviços de áudio", "cor": "#2563EB"},
    {"id": 65, "nome": "Tradução", "descricao": "Serviços de tradução", "cor": "#6B7280"},
    {"id": 66, "nome": "Outros", "descricao": "Outros serviços", "cor": "#9CA3AF"}
]

def resetar_categorias():
    with app.app_context():
        print("🔄 Apagando todas as tabelas...")
        db.drop_all()
        print("✅ Todas as tabelas removidas!")
        print("🔄 Recriando todas as tabelas...")
        db.create_all()
        print("✅ Todas as tabelas criadas!")
        print("🔄 Inserindo categorias padrão...")
        nomes_usados = set()
        categorias = []
        # Produtos
        for cat in CATEGORIAS_PRODUTOS:
            nome = cat['nome']
            if nome in nomes_usados:
                nome = f"{nome} (Produto)"
            nomes_usados.add(nome)
            categorias.append({**cat, 'nome': nome})
        # Serviços
        for cat in CATEGORIAS_SERVICOS:
            nome = cat['nome']
            if nome in nomes_usados:
                nome = f"{nome} (Serviço)"
            nomes_usados.add(nome)
            categorias.append({**cat, 'nome': nome})
        for cat in categorias:
            categoria = CategoriaProduto(
                id=cat['id'],
                nome=cat['nome'],
                descricao=cat['descricao'],
                cor=cat['cor']
            )
            db.session.add(categoria)
        db.session.commit()
        print(f"✅ {len(categorias)} categorias inseridas!")

def testar_api():
    import requests
    print("🔄 Testando API de categorias...")
    time.sleep(2)
    try:
        r = requests.get('http://localhost:5000/api/categorias-produto', timeout=5)
        if r.status_code == 200:
            cats = r.json().get('categorias', [])
            print(f"✅ API OK! {len(cats)} categorias retornadas.")
            print("Exemplo:", cats[:3])
        else:
            print(f"❌ API retornou status {r.status_code}")
    except Exception as e:
        print(f"❌ Erro ao testar API: {e}")

if __name__ == "__main__":
    print("=== RESET TOTAL DE CATEGORIAS ===")
    resetar_categorias()
    print("=== AGORA INICIE O BACKEND ===")
    print("python src/main.py (dentro da pasta backend)")
    print("Depois acesse http://localhost:5000/api/categorias-produto para testar.")
    print("Se quiser testar automaticamente, deixe o backend rodando e execute este script novamente!")
    # Teste automático se backend já estiver rodando
    try:
        testar_api()
    except:
        pass 