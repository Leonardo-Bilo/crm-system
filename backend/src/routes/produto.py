from flask import Blueprint, request, jsonify, send_file
from src.models.produto import db, Produto, CategoriaProduto, TipoProduto, StatusProduto
from datetime import datetime
from sqlalchemy import or_, func, and_
import pandas as pd
import io
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

produto_bp = Blueprint('produto', __name__)

# CRUD para Categorias de Produto
@produto_bp.route('/categorias-produto', methods=['GET'])
def listar_categorias_produto():
    try:
        categorias = CategoriaProduto.query.all()
        return jsonify([categoria.to_dict() for categoria in categorias])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/categorias-produto', methods=['POST'])
def criar_categoria_produto():
    try:
        dados = request.get_json()
        if not dados.get("nome"):
            return jsonify({"erro": "Nome é obrigatório"}), 400
        
        categoria = CategoriaProduto(
            nome=dados['nome'],
            descricao=dados.get('descricao'),
            cor=dados.get('cor', '#3B82F6')
        )
        db.session.add(categoria)
        db.session.commit()
        return jsonify(categoria.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/categorias-produto/<int:categoria_id>', methods=['PUT'])
def atualizar_categoria_produto(categoria_id):
    try:
        categoria = CategoriaProduto.query.get_or_404(categoria_id)
        dados = request.get_json()
        
        if 'nome' in dados:
            categoria.nome = dados['nome']
        if 'descricao' in dados:
            categoria.descricao = dados['descricao']
        if 'cor' in dados:
            categoria.cor = dados['cor']
        
        db.session.commit()
        return jsonify(categoria.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/categorias-produto/<int:categoria_id>', methods=['DELETE'])
def deletar_categoria_produto(categoria_id):
    try:
        categoria = CategoriaProduto.query.get_or_404(categoria_id)
        
        # Verificar se há produtos usando esta categoria
        produtos_count = Produto.query.filter_by(categoria_id=categoria_id).count()
        if produtos_count > 0:
            return jsonify({"erro": f"Não é possível deletar. Existem {produtos_count} produtos usando esta categoria."}), 400
        
        db.session.delete(categoria)
        db.session.commit()
        return jsonify({"mensagem": "Categoria deletada com sucesso"})
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/categorias-produto/criar-padrao', methods=['POST'])
def criar_categorias_padrao():
    try:
        # Primeiro, limpar todas as categorias existentes
        CategoriaProduto.query.delete()
        db.session.commit()
        
        # Categorias para Produtos (IDs 1-36)
        categorias_produtos = [
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
        
        # Categorias para Serviços (IDs 37-66)
        categorias_servicos = [
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
        
        # Combinar todas as categorias
        todas_categorias = categorias_produtos + categorias_servicos
        
        categorias_criadas = 0
        
        for cat_data in todas_categorias:
            categoria = CategoriaProduto(
                id=cat_data['id'],  # Forçar ID específico
                nome=cat_data['nome'],
                descricao=cat_data['descricao'],
                cor=cat_data['cor']
            )
            db.session.add(categoria)
            categorias_criadas += 1
        
        # Commit das alterações
        db.session.commit()
        
        return jsonify({
            "mensagem": "Categorias padrão criadas com sucesso",
            "categorias_criadas": categorias_criadas,
            "categorias_produtos": len(categorias_produtos),
            "categorias_servicos": len(categorias_servicos),
            "total_categorias": CategoriaProduto.query.count()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

# CRUD para Produtos/Serviços
@produto_bp.route('/produtos', methods=['GET'])
def listar_produtos():
    try:
        # Parâmetros de busca e filtragem
        busca = request.args.get('busca', '')
        categoria_id = request.args.get('categoria_id')
        tipo = request.args.get('tipo')
        status = request.args.get('status')
        destaque = request.args.get('destaque')
        estoque_baixo = request.args.get('estoque_baixo')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        query = Produto.query
        
        # Aplicar filtro de busca se fornecido
        if busca:
            query = query.filter(
                or_(
                    Produto.nome.ilike(f'%{busca}%'),
                    Produto.descricao.ilike(f'%{busca}%'),
                    Produto.codigo.ilike(f'%{busca}%'),
                    Produto.fornecedor.ilike(f'%{busca}%')
                )
            )
        
        # Filtrar por categoria
        if categoria_id:
            query = query.filter_by(categoria_id=categoria_id)
        
        # Filtrar por tipo
        if tipo:
            query = query.filter_by(tipo=TipoProduto(tipo))
        
        # Filtrar por status
        if status:
            query = query.filter_by(status=StatusProduto(status))
        
        # Filtrar por destaque
        if destaque is not None:
            destaque_bool = destaque.lower() == 'true'
            query = query.filter_by(destaque=destaque_bool)
        
        # Filtrar por estoque baixo
        if estoque_baixo is not None:
            estoque_bool = estoque_baixo.lower() == 'true'
            if estoque_bool:
                query = query.filter(
                    and_(
                        Produto.tipo == TipoProduto.PRODUTO,
                        Produto.estoque_atual <= Produto.estoque_minimo
                    )
                )
        
        # Ordenar por nome
        query = query.order_by(Produto.nome)
        
        # Paginação
        produtos_paginados = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'produtos': [produto.to_dict() for produto in produtos_paginados.items],
            'total': produtos_paginados.total,
            'pages': produtos_paginados.pages,
            'current_page': page,
            'per_page': per_page
        })
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/produtos/<int:produto_id>', methods=['GET'])
def obter_produto(produto_id):
    try:
        produto = Produto.query.get_or_404(produto_id)
        return jsonify(produto.to_dict_detailed())
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/produtos', methods=['POST'])
def criar_produto():
    try:
        dados = request.get_json()
        if not dados.get("nome"):
            return jsonify({"erro": "Nome é obrigatório"}), 400
        
        # Validar custo
        custo = dados.get('custo')
        if custo is None or custo == '':
            custo = 0.0
        else:
            try:
                custo = float(custo)
                if custo < 0:
                    return jsonify({"erro": "Custo deve ser maior ou igual a zero"}), 400
            except (ValueError, TypeError):
                return jsonify({"erro": "Custo deve ser um número válido"}), 400
        
        # Validar valor de venda
        valor_venda = dados.get('valor_venda')
        if valor_venda is None or valor_venda == '':
            valor_venda = 0.0
        else:
            try:
                valor_venda = float(valor_venda)
                if valor_venda < 0:
                    return jsonify({"erro": "Valor de venda deve ser maior ou igual a zero"}), 400
            except (ValueError, TypeError):
                return jsonify({"erro": "Valor de venda deve ser um número válido"}), 400
        
        # Validar estoque atual
        estoque_atual = dados.get('estoque_atual')
        if estoque_atual is None or estoque_atual == '':
            estoque_atual = 0
        else:
            try:
                estoque_atual = int(estoque_atual)
                if estoque_atual < 0:
                    return jsonify({"erro": "Estoque atual deve ser maior ou igual a zero"}), 400
            except (ValueError, TypeError):
                return jsonify({"erro": "Estoque atual deve ser um número inteiro válido"}), 400
        
        # Validar estoque mínimo
        estoque_minimo = dados.get('estoque_minimo')
        if estoque_minimo is None or estoque_minimo == '':
            estoque_minimo = 0
        else:
            try:
                estoque_minimo = int(estoque_minimo)
                if estoque_minimo < 0:
                    return jsonify({"erro": "Estoque mínimo deve ser maior ou igual a zero"}), 400
            except (ValueError, TypeError):
                return jsonify({"erro": "Estoque mínimo deve ser um número inteiro válido"}), 400
        
        # Validar categoria_id
        categoria_id = dados.get('categoria_id')
        if categoria_id is not None and categoria_id != '':
            try:
                categoria_id = int(categoria_id)
                categoria = CategoriaProduto.query.get(categoria_id)
                if not categoria:
                    return jsonify({"erro": "Categoria não encontrada"}), 400
            except (ValueError, TypeError):
                return jsonify({"erro": "ID da categoria deve ser um número válido"}), 400
        else:
            categoria_id = None
        
        # Validar código único
        codigo = dados.get('codigo')
        if codigo:
            produto_existente = Produto.query.filter_by(codigo=codigo).first()
            if produto_existente:
                return jsonify({"erro": "Já existe um produto/serviço cadastrado com este código. Por favor, escolha um código diferente."}), 400
        
        produto = Produto(
            nome=dados['nome'],
            descricao=dados.get('descricao'),
            codigo=codigo,
            tipo=TipoProduto(dados.get('tipo', 'produto')),
            categoria_id=categoria_id,
            custo=custo,
            valor_venda=valor_venda,
            estoque_atual=estoque_atual,
            estoque_minimo=estoque_minimo,
            unidade_medida=dados.get('unidade_medida', 'un'),
            fornecedor=dados.get('fornecedor'),
            tempo_entrega=dados.get('tempo_entrega'),
            status=StatusProduto(dados.get('status', 'ativo')),
            destaque=dados.get('destaque', False)
        )
        
        db.session.add(produto)
        db.session.commit()
        return jsonify(produto.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        # Mensagem amigável para erro de código duplicado
        if 'UNIQUE constraint failed: produtos.codigo' in str(e):
            return jsonify({"erro": "Já existe um produto/serviço cadastrado com este código. Por favor, escolha um código diferente."}), 400
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/produtos/<int:produto_id>', methods=['PUT'])
def atualizar_produto(produto_id):
    try:
        produto = Produto.query.get_or_404(produto_id)
        dados = request.get_json()
        
        # Validar categoria_id
        if 'categoria_id' in dados:
            categoria_id = dados['categoria_id']
            if categoria_id is not None:
                categoria = CategoriaProduto.query.get(categoria_id)
                if not categoria:
                    return jsonify({"erro": "Categoria não encontrada"}), 400
            produto.categoria_id = categoria_id
        
        # Atualizar campos básicos
        if 'nome' in dados:
            produto.nome = dados['nome']
        if 'descricao' in dados:
            produto.descricao = dados['descricao']
        if 'codigo' in dados:
            produto.codigo = dados['codigo']
        if 'tipo' in dados:
            produto.tipo = TipoProduto(dados['tipo'])
        if 'custo' in dados:
            produto.custo = float(dados['custo'])
        if 'valor_venda' in dados:
            produto.valor_venda = float(dados['valor_venda'])
        if 'estoque_atual' in dados:
            produto.estoque_atual = int(dados['estoque_atual'])
        if 'estoque_minimo' in dados:
            produto.estoque_minimo = int(dados['estoque_minimo'])
        if 'unidade_medida' in dados:
            produto.unidade_medida = dados['unidade_medida']
        if 'fornecedor' in dados:
            produto.fornecedor = dados['fornecedor']
        if 'tempo_entrega' in dados:
            produto.tempo_entrega = dados['tempo_entrega']
        if 'status' in dados:
            produto.status = StatusProduto(dados['status'])
        if 'destaque' in dados:
            produto.destaque = dados['destaque']
        
        db.session.commit()
        return jsonify(produto.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/produtos/<int:produto_id>', methods=['DELETE'])
def deletar_produto(produto_id):
    try:
        produto = Produto.query.get_or_404(produto_id)
        db.session.delete(produto)
        db.session.commit()
        return jsonify({"mensagem": "Produto deletado com sucesso"})
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

# Funcionalidades específicas
@produto_bp.route('/produtos/<int:produto_id>/ajustar-estoque', methods=['PUT'])
def ajustar_estoque(produto_id):
    try:
        produto = Produto.query.get_or_404(produto_id)
        dados = request.get_json()
        
        if produto.tipo != TipoProduto.PRODUTO:
            return jsonify({"erro": "Apenas produtos podem ter estoque ajustado"}), 400
        
        quantidade = dados.get('quantidade')
        tipo_ajuste = dados.get('tipo', 'adicionar')  # adicionar, remover, definir
        
        if quantidade is None:
            return jsonify({"erro": "Quantidade é obrigatória"}), 400
        
        if tipo_ajuste == 'adicionar':
            produto.estoque_atual += int(quantidade)
        elif tipo_ajuste == 'remover':
            produto.estoque_atual -= int(quantidade)
            if produto.estoque_atual < 0:
                produto.estoque_atual = 0
        elif tipo_ajuste == 'definir':
            produto.estoque_atual = int(quantidade)
        else:
            return jsonify({"erro": "Tipo de ajuste inválido"}), 400
        
        db.session.commit()
        return jsonify(produto.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/produtos/estoque-baixo', methods=['GET'])
def listar_estoque_baixo():
    try:
        produtos = Produto.query.filter(
            and_(
                Produto.tipo == TipoProduto.PRODUTO,
                Produto.estoque_atual <= Produto.estoque_minimo
            )
        ).all()
        
        return jsonify([produto.to_dict() for produto in produtos])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/produtos/destaque', methods=['GET'])
def listar_destaque():
    try:
        produtos = Produto.query.filter_by(destaque=True, status=StatusProduto.ATIVO).all()
        return jsonify([produto.to_dict() for produto in produtos])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/produtos/relatorio', methods=['GET'])
def relatorio_produtos():
    try:
        # Estatísticas gerais
        total_produtos = Produto.query.count()
        total_ativos = Produto.query.filter_by(status=StatusProduto.ATIVO).count()
        total_inativos = Produto.query.filter_by(status=StatusProduto.INATIVO).count()
        total_esgotados = Produto.query.filter_by(status=StatusProduto.ESGOTADO).count()
        
        # Produtos com estoque baixo
        estoque_baixo = Produto.query.filter(
            and_(
                Produto.tipo == TipoProduto.PRODUTO,
                Produto.estoque_atual <= Produto.estoque_minimo
            )
        ).count()
        
        # Valor total em estoque
        produtos_estoque = Produto.query.filter_by(tipo=TipoProduto.PRODUTO).all()
        valor_total_estoque = sum(p.estoque_atual * p.custo for p in produtos_estoque)
        
        # Produtos por categoria
        categorias_stats = db.session.query(
            CategoriaProduto.nome,
            func.count(Produto.id).label('quantidade')
        ).outerjoin(Produto).group_by(CategoriaProduto.id, CategoriaProduto.nome).all()
        
        return jsonify({
            'total_produtos': total_produtos,
            'total_ativos': total_ativos,
            'total_inativos': total_inativos,
            'total_esgotados': total_esgotados,
            'estoque_baixo': estoque_baixo,
            'valor_total_estoque': valor_total_estoque,
            'produtos_por_categoria': [
                {'categoria': cat.nome, 'quantidade': cat.quantidade}
                for cat in categorias_stats
            ]
        })
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/produtos/importar-excel', methods=['POST'])
def importar_produtos_excel():
    try:
        if 'file' not in request.files:
            return jsonify({"erro": "Nenhum arquivo enviado"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"erro": "Nenhum arquivo selecionado"}), 400
        
        if not file.filename.endswith('.xlsx'):
            return jsonify({"erro": "Arquivo deve ser um Excel (.xlsx)"}), 400
        
        # Ler o arquivo Excel
        df = pd.read_excel(file)
        
        produtos_criados = 0
        erros = []
        
        for index, row in df.iterrows():
            try:
                # Validar dados obrigatórios
                if pd.isna(row.get('nome')) or not row.get('nome'):
                    erros.append(f"Linha {index + 2}: Nome é obrigatório")
                    continue
                
                if pd.isna(row.get('custo')) or row.get('custo') < 0:
                    erros.append(f"Linha {index + 2}: Custo deve ser maior ou igual a zero")
                    continue
                
                if pd.isna(row.get('valor_venda')) or row.get('valor_venda') < 0:
                    erros.append(f"Linha {index + 2}: Valor de venda deve ser maior ou igual a zero")
                    continue
                
                # Criar produto
                produto = Produto(
                    nome=str(row.get('nome', '')),
                    descricao=str(row.get('descricao', '')) if not pd.isna(row.get('descricao')) else None,
                    codigo=str(row.get('codigo', '')) if not pd.isna(row.get('codigo')) else None,
                    tipo=TipoProduto(str(row.get('tipo', 'produto')).lower()),
                    categoria_id=int(row.get('categoria_id')) if not pd.isna(row.get('categoria_id')) else None,
                    custo=float(row.get('custo', 0)),
                    valor_venda=float(row.get('valor_venda', 0)),
                    estoque_atual=int(row.get('estoque_atual', 0)) if not pd.isna(row.get('estoque_atual')) else 0,
                    estoque_minimo=int(row.get('estoque_minimo', 0)) if not pd.isna(row.get('estoque_minimo')) else 0,
                    unidade_medida=str(row.get('unidade_medida', 'un')) if not pd.isna(row.get('unidade_medida')) else 'un',
                    fornecedor=str(row.get('fornecedor', '')) if not pd.isna(row.get('fornecedor')) else None,
                    tempo_entrega=str(row.get('tempo_entrega', '')) if not pd.isna(row.get('tempo_entrega')) else None,
                    status=StatusProduto(str(row.get('status', 'ativo')).lower()),
                    destaque=bool(row.get('destaque', False)) if not pd.isna(row.get('destaque')) else False
                )
                
                db.session.add(produto)
                produtos_criados += 1
                
            except Exception as e:
                erros.append(f"Linha {index + 2}: {str(e)}")
        
        if erros:
            db.session.rollback()
            return jsonify({
                "erro": "Erros encontrados durante a importação",
                "erros": erros,
                "produtos_criados": 0
            }), 400
        
        db.session.commit()
        return jsonify({
            "mensagem": f"{produtos_criados} produtos importados com sucesso",
            "produtos_criados": produtos_criados
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

# Rotas para estatísticas
@produto_bp.route('/produtos/estatisticas', methods=['GET'])
def estatisticas_produtos():
    try:
        # Estatísticas gerais
        total_produtos = Produto.query.count()
        total_produtos_tipo = Produto.query.filter_by(tipo=TipoProduto.PRODUTO).count()
        total_servicos = Produto.query.filter_by(tipo=TipoProduto.SERVICO).count()
        total_ativos = Produto.query.filter_by(status=StatusProduto.ATIVO).count()
        total_inativos = Produto.query.filter_by(status=StatusProduto.INATIVO).count()
        total_esgotados = Produto.query.filter_by(status=StatusProduto.ESGOTADO).count()
        total_destaque = Produto.query.filter_by(destaque=True).count()
        
        # Produtos com estoque baixo
        estoque_baixo = Produto.query.filter(
            and_(
                Produto.tipo == TipoProduto.PRODUTO,
                Produto.estoque_atual <= Produto.estoque_minimo
            )
        ).count()
        
        # Valor total em estoque
        valor_total = db.session.query(func.sum(Produto.valor_venda * Produto.estoque_atual)).filter(
            Produto.tipo == TipoProduto.PRODUTO
        ).scalar() or 0
        
        # Custo total em estoque
        custo_total = db.session.query(func.sum(Produto.custo * Produto.estoque_atual)).filter(
            Produto.tipo == TipoProduto.PRODUTO
        ).scalar() or 0
        
        # Lucro potencial
        lucro_potencial = valor_total - custo_total
        
        # Estatísticas por categoria
        categorias_stats = db.session.query(
            CategoriaProduto.nome,
            func.count(Produto.id).label('quantidade'),
            func.sum(Produto.valor_venda * Produto.estoque_atual).label('valor_total')
        ).outerjoin(Produto).group_by(CategoriaProduto.id, CategoriaProduto.nome).all()
        
        return jsonify({
            'total': total_produtos,
            'produtos': total_produtos_tipo,
            'servicos': total_servicos,
            'ativos': total_ativos,
            'inativos': total_inativos,
            'esgotados': total_esgotados,
            'em_destaque': total_destaque,
            'estoque_baixo': estoque_baixo,
            'valor_total_estoque': float(valor_total),
            'custo_total_estoque': float(custo_total),
            'lucro_potencial': float(lucro_potencial),
            'por_categoria': [
                {
                    'categoria': stat.nome or 'Sem categoria',
                    'quantidade': stat.quantidade,
                    'valor_total': float(stat.valor_total or 0)
                }
                for stat in categorias_stats
            ]
        })
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

# Rotas para exportação
@produto_bp.route('/produtos/exportar-excel', methods=['GET'])
def exportar_produtos_excel():
    try:
        # Buscar todos os produtos
        produtos = Produto.query.all()
        
        # Preparar dados para o Excel
        dados = []
        for produto in produtos:
            dados.append({
                'ID': produto.id,
                'Nome': produto.nome,
                'Descrição': produto.descricao or '',
                'Código': produto.codigo or '',
                'Tipo': produto.tipo.value,
                'Categoria': produto.categoria.nome if produto.categoria else 'Sem categoria',
                'Custo (R$)': produto.custo,
                'Valor de Venda (R$)': produto.valor_venda,
                'Estoque Atual': produto.estoque_atual if produto.tipo == TipoProduto.PRODUTO else '',
                'Estoque Mínimo': produto.estoque_minimo if produto.tipo == TipoProduto.PRODUTO else '',
                'Unidade de Medida': produto.unidade_medida if produto.tipo == TipoProduto.PRODUTO else '',
                'Fornecedor': produto.fornecedor or '',
                'Tempo de Entrega (dias)': produto.tempo_entrega or '',
                'Status': produto.status.value,
                'Destaque': 'Sim' if produto.destaque else 'Não',
                'Data de Criação': produto.data_criacao.strftime('%d/%m/%Y %H:%M') if produto.data_criacao else '',
                'Última Atualização': produto.data_atualizacao.strftime('%d/%m/%Y %H:%M') if produto.data_atualizacao else ''
            })
        
        # Criar DataFrame
        df = pd.DataFrame(dados)
        
        # Criar buffer para o arquivo
        output = io.BytesIO()
        
        # Escrever para Excel
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Produtos e Serviços', index=False)
            
            # Ajustar largura das colunas
            worksheet = writer.sheets['Produtos e Serviços']
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                adjusted_width = min(max_length + 2, 50)
                worksheet.column_dimensions[column_letter].width = adjusted_width
        
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=f'produtos_servicos_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
        )
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/produtos/exportar-pdf', methods=['GET'])
def exportar_produtos_pdf():
    try:
        # Buscar todos os produtos
        produtos = Produto.query.all()
        
        # Criar buffer para o PDF
        buffer = io.BytesIO()
        
        # Criar documento PDF
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        elements = []
        
        # Estilos
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            spaceAfter=30,
            alignment=1  # Centralizado
        )
        
        # Título
        elements.append(Paragraph("Relatório de Produtos e Serviços", title_style))
        elements.append(Spacer(1, 20))
        
        # Informações do relatório
        elements.append(Paragraph(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}", styles['Normal']))
        elements.append(Paragraph(f"Total de itens: {len(produtos)}", styles['Normal']))
        elements.append(Spacer(1, 20))
        
        # Preparar dados para a tabela
        table_data = [['Nome', 'Tipo', 'Categoria', 'Valor (R$)', 'Status', 'Estoque']]
        
        for produto in produtos:
            estoque_info = f"{produto.estoque_atual} {produto.unidade_medida}" if produto.tipo == TipoProduto.PRODUTO else "N/A"
            table_data.append([
                produto.nome[:30] + '...' if len(produto.nome) > 30 else produto.nome,
                produto.tipo.value.title(),
                produto.categoria.nome if produto.categoria else 'Sem categoria',
                f"R$ {produto.valor_venda:.2f}",
                produto.status.value.title(),
                estoque_info
            ])
        
        # Criar tabela
        table = Table(table_data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ALIGN', (3, 1), (3, -1), 'RIGHT'),  # Alinhar valores à direita
        ]))
        
        elements.append(table)
        
        # Construir PDF
        doc.build(elements)
        buffer.seek(0)
        
        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'relatorio_produtos_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        )
    except Exception as e:
        return jsonify({'erro': str(e)}), 500 