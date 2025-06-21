from flask import Blueprint, request, jsonify
from src.models.cliente import db, Cliente, HistoricoCompra, Agendamento, Lembrete, Tag, Categoria, Notificacao, InteracaoCliente, StatusAgendamento, PrioridadeLembrete, TipoNotificacao
from datetime import datetime, timedelta
from sqlalchemy import or_, func, and_
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import pandas as pd
import re

cliente_bp = Blueprint('cliente', __name__)

def formatar_telefone(telefone):
    """Formata o telefone para incluir parênteses no DDD"""
    if not telefone:
        return telefone
    
    # Remove todos os caracteres não numéricos
    numeros = re.sub(r'[^\d]', '', str(telefone))
    
    # Se tem pelo menos 10 dígitos (DDD + número)
    if len(numeros) >= 10:
        # Pega os primeiros 2 dígitos como DDD
        ddd = numeros[:2]
        # O resto é o número
        numero = numeros[2:]
        
        # Formata: (DDD) NÚMERO
        if len(numero) == 8:  # Telefone fixo
            return f"({ddd}) {numero[:4]}-{numero[4:]}"
        elif len(numero) == 9:  # Celular
            return f"({ddd}) {numero[:5]}-{numero[5:]}"
        else:
            return f"({ddd}) {numero}"
    
    # Se tem menos de 10 dígitos, retorna como está
    return telefone

# CRUD para Clientes
@cliente_bp.route('/clientes', methods=['GET'])
def listar_clientes():
    try:
        # Parâmetros de busca e filtragem
        busca = request.args.get('busca', '')
        categoria_id = request.args.get('categoria_id')
        tag_id = request.args.get('tag_id')
        ativo = request.args.get('ativo', 'true').lower() == 'true'
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        query = Cliente.query.filter_by(ativo=ativo)
        
        # Aplicar filtro de busca se fornecido
        if busca:
            query = query.filter(
                or_(
                    Cliente.nome.ilike(f'%{busca}%'),
                    Cliente.email.ilike(f'%{busca}%'),
                    Cliente.telefone.ilike(f'%{busca}%')
                )
            )
        
        # Filtrar por categoria
        if categoria_id:
            query = query.filter_by(categoria_id=categoria_id)
        
        # Filtrar por tag
        if tag_id:
            query = query.filter(Cliente.tags.any(Tag.id == tag_id))
        
        # Paginação
        clientes_paginados = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        def get_data_ultima_compra(cliente):
            if not cliente.historico_compras or len(cliente.historico_compras) == 0:
                return None
            try:
                ultima_compra = max(cliente.historico_compras, key=lambda x: x.data_compra)
                return ultima_compra.data_compra.strftime('%Y-%m-%d')
            except Exception as e:
                print(f"Erro ao calcular data da última compra para cliente {cliente.id}: {e}")
                return None

        def get_datas_compras(cliente):
            if not cliente.historico_compras or len(cliente.historico_compras) == 0:
                return []
            try:
                # Ordenar compras por data (mais recente primeiro) e pegar as últimas 3
                compras_ordenadas = sorted(cliente.historico_compras, key=lambda x: x.data_compra, reverse=True)
                return [compra.data_compra.strftime('%Y-%m-%d') for compra in compras_ordenadas[:3]]
            except Exception as e:
                print(f"Erro ao obter datas das compras para cliente {cliente.id}: {e}")
                return []

        return jsonify({
            'clientes': [
                {
                    **cliente.to_dict(), 
                    'quantidade_total_compras': sum([compra.quantidade for compra in cliente.historico_compras]),
                    'valor_total_compras': sum([compra.valor for compra in cliente.historico_compras]),
                    'data_ultima_compra': get_data_ultima_compra(cliente),
                    'datas_compras': get_datas_compras(cliente)
                }
                for cliente in clientes_paginados.items
            ],
            'total': clientes_paginados.total,
            'pages': clientes_paginados.pages,
            'current_page': page,
            'per_page': per_page
        })
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/clientes/<int:cliente_id>', methods=['GET'])
def obter_cliente(cliente_id):
    try:
        cliente = Cliente.query.get_or_404(cliente_id)
        return jsonify(cliente.to_dict_detailed())
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/clientes', methods=['POST'])
def criar_cliente():
    try:
        dados = request.get_json()
        if not dados.get("nome"):
            return jsonify({"erro": "Nome é obrigatório"}), 400
        
        # Validar categoria_id
        categoria_id = dados.get('categoria_id')
        if categoria_id is not None:
            categoria = Categoria.query.get(categoria_id)
            if not categoria:
                return jsonify({"erro": "Categoria não encontrada"}), 400
        
        cliente = Cliente(
            nome=dados['nome'],
            email=dados.get('email'),
            telefone=formatar_telefone(dados.get('telefone')),
            endereco=dados.get('endereco'),
            notas=dados.get('notas'),
            categoria_id=categoria_id
        )
        if dados.get('tag_ids'):
            tags = Tag.query.filter(Tag.id.in_(dados['tag_ids'])).all()
            cliente.tags = tags
        db.session.add(cliente)
        db.session.commit()
        # Adicionar compra inicial se informado
        valor = dados.get('valor_total_compras', 0)
        quantidade = dados.get('quantidade_total_compras', 0)
        if valor > 0 and quantidade > 0:
            data_compra = None
            if dados.get('data_ultima_compra'):
                try:
                    data_compra = datetime.fromisoformat(dados['data_ultima_compra'])
                except Exception:
                    data_compra = datetime.utcnow()
            else:
                data_compra = datetime.utcnow()
            compra = HistoricoCompra(
                cliente_id=cliente.id,
                produto_servico='Compra inicial',
                valor=valor,
                quantidade=quantidade,
                data_compra=data_compra
            )
            db.session.add(compra)
            db.session.commit()
        return jsonify(cliente.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/clientes/<int:cliente_id>', methods=['PUT'])
def atualizar_cliente(cliente_id):
    try:
        cliente = Cliente.query.get_or_404(cliente_id)
        dados = request.get_json()
        
        # Validar categoria_id
        if 'categoria_id' in dados:
            categoria_id = dados['categoria_id']
            if categoria_id is not None:
                categoria = Categoria.query.get(categoria_id)
                if not categoria:
                    return jsonify({"erro": "Categoria não encontrada"}), 400
            cliente.categoria_id = categoria_id
        if 'nome' in dados:
            cliente.nome = dados['nome']
        if 'email' in dados:
            cliente.email = dados['email']
        if 'telefone' in dados:
            cliente.telefone = formatar_telefone(dados['telefone'])
        if 'endereco' in dados:
            cliente.endereco = dados['endereco']
        if 'notas' in dados:
            cliente.notas = dados['notas']
        if 'ativo' in dados:
            cliente.ativo = dados['ativo']
        if 'tag_ids' in dados:
            tags = Tag.query.filter(Tag.id.in_(dados['tag_ids'])).all()
            cliente.tags = tags
        cliente.data_atualizacao = datetime.utcnow()
        db.session.commit()
        # Adicionar compra inicial se informado e atualizar se já existir
        valor = dados.get('valor_total_compras', 0)
        quantidade = dados.get('quantidade_total_compras', 0)
        if valor > 0 and quantidade > 0:
            data_compra = None
            if dados.get('data_ultima_compra'):
                try:
                    data_compra = datetime.fromisoformat(dados['data_ultima_compra'])
                except Exception:
                    data_compra = datetime.utcnow()
            else:
                data_compra = datetime.utcnow()
            compra_inicial = HistoricoCompra.query.filter_by(cliente_id=cliente.id, produto_servico='Compra inicial').first()
            if compra_inicial:
                compra_inicial.valor = valor
                compra_inicial.quantidade = quantidade
                if 'data_ultima_compra' in dados:
                    compra_inicial.data_compra = data_compra
                db.session.commit()
            else:
                compra = HistoricoCompra(
                    cliente_id=cliente.id,
                    produto_servico='Compra inicial',
                    valor=valor,
                    quantidade=quantidade,
                    data_compra=data_compra
                )
                db.session.add(compra)
                db.session.commit()
        return jsonify(cliente.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/clientes/<int:cliente_id>', methods=['DELETE'])
def deletar_cliente(cliente_id):
    try:
        cliente = Cliente.query.get_or_404(cliente_id)
        # Excluir agendamentos, lembretes, histórico de compras, notificações e interações do cliente
        Agendamento.query.filter_by(cliente_id=cliente_id).delete()
        Lembrete.query.filter_by(cliente_id=cliente_id).delete()
        HistoricoCompra.query.filter_by(cliente_id=cliente_id).delete()
        Notificacao.query.filter_by(destinatario=cliente.email).delete() # Assumindo que notificações são por email do cliente
        InteracaoCliente.query.filter_by(cliente_id=cliente_id).delete()

        db.session.delete(cliente)
        db.session.commit()
        
        return jsonify({"mensagem": "Cliente e dados associados deletados com sucesso"})
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

# CRUD para Tags
@cliente_bp.route('/tags', methods=['GET'])
def listar_tags():
    try:
        tags = Tag.query.all()
        return jsonify([tag.to_dict() for tag in tags])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/tags', methods=['POST'])
def criar_tag():
    try:
        dados = request.get_json()
        
        if not dados.get('nome'):
            return jsonify({'erro': 'Nome da tag é obrigatório'}), 400
        
        tag = Tag(
            nome=dados['nome'],
            cor=dados.get('cor', '#3B82F6'),
            descricao=dados.get('descricao')
        )
        
        db.session.add(tag)
        db.session.commit()
        
        return jsonify(tag.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/tags/<int:tag_id>', methods=['PUT'])
def atualizar_tag(tag_id):
    try:
        tag = Tag.query.get_or_404(tag_id)
        dados = request.get_json()
        
        if 'nome' in dados:
            tag.nome = dados['nome']
        if 'cor' in dados:
            tag.cor = dados['cor']
        if 'descricao' in dados:
            tag.descricao = dados['descricao']
        
        db.session.commit()
        return jsonify(tag.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/tags/<int:tag_id>', methods=['DELETE'])
def deletar_tag(tag_id):
    try:
        tag = Tag.query.get_or_404(tag_id)
        db.session.delete(tag)
        db.session.commit()
        
        return jsonify({'mensagem': 'Tag deletada com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

# CRUD para Categorias
@cliente_bp.route('/categorias', methods=['GET'])
def listar_categorias():
    try:
        categorias = Categoria.query.all()
        return jsonify([categoria.to_dict() for categoria in categorias])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/categorias', methods=['POST'])
def criar_categoria():
    try:
        dados = request.get_json()
        
        if not dados.get('nome'):
            return jsonify({'erro': 'Nome da categoria é obrigatório'}), 400
        
        categoria = Categoria(
            nome=dados['nome'],
            descricao=dados.get('descricao')
        )
        
        db.session.add(categoria)
        db.session.commit()
        
        return jsonify(categoria.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

# CRUD para Agendamentos Avançados
@cliente_bp.route('/agendamentos', methods=['GET'])
def listar_agendamentos():
    try:
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        status = request.args.get('status')
        cliente_id = request.args.get('cliente_id')
        tipo = request.args.get('tipo')
        
        query = Agendamento.query
        
        if data_inicio:
            query = query.filter(Agendamento.data_agendamento >= datetime.fromisoformat(data_inicio))
        if data_fim:
            query = query.filter(Agendamento.data_agendamento <= datetime.fromisoformat(data_fim))
        if status:
            query = query.filter(Agendamento.status == StatusAgendamento(status))
        if cliente_id:
            query = query.filter_by(cliente_id=cliente_id)
        if tipo:
            query = query.filter_by(tipo=tipo)
        
        agendamentos = query.order_by(Agendamento.data_agendamento).all()
        
        return jsonify([agendamento.to_dict() for agendamento in agendamentos])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/agendamentos', methods=['POST'])
def criar_agendamento():
    try:
        dados = request.get_json()
        
        if not dados.get('titulo') or not dados.get('data_agendamento') or not dados.get('cliente_id'):
            return jsonify({'erro': 'Título, data do agendamento e cliente são obrigatórios'}), 400
        
        agendamento = Agendamento(
            cliente_id=dados['cliente_id'],
            titulo=dados['titulo'],
            descricao=dados.get('descricao'),
            data_agendamento=datetime.fromisoformat(dados['data_agendamento']),
            data_fim=datetime.fromisoformat(dados['data_fim']) if dados.get('data_fim') else None,
            status=StatusAgendamento(dados.get('status', 'agendado')),
            tipo=dados.get('tipo'),
            local=dados.get('local'),
            observacoes=dados.get('observacoes')
        )
        
        db.session.add(agendamento)
        db.session.commit()
        
        # Criar notificação se solicitado
        if dados.get('enviar_notificacao'):
            criar_notificacao_agendamento(agendamento)
        
        return jsonify(agendamento.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/agendamentos/<int:agendamento_id>', methods=['PUT'])
def atualizar_agendamento(agendamento_id):
    try:
        agendamento = Agendamento.query.get_or_404(agendamento_id)
        dados = request.get_json()
        
        if 'titulo' in dados:
            agendamento.titulo = dados['titulo']
        if 'descricao' in dados:
            agendamento.descricao = dados['descricao']
        if 'data_agendamento' in dados:
            agendamento.data_agendamento = datetime.fromisoformat(dados['data_agendamento'])
        if 'data_fim' in dados:
            agendamento.data_fim = datetime.fromisoformat(dados['data_fim']) if dados['data_fim'] else None
        if 'status' in dados:
            agendamento.status = StatusAgendamento(dados['status'])
        if 'tipo' in dados:
            agendamento.tipo = dados['tipo']
        if 'local' in dados:
            agendamento.local = dados['local']
        if 'observacoes' in dados:
            agendamento.observacoes = dados['observacoes']
        
        agendamento.data_atualizacao = datetime.utcnow()
        db.session.commit()
        
        return jsonify(agendamento.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

# CRUD para Lembretes Avançados
@cliente_bp.route('/lembretes', methods=['GET'])
def listar_lembretes():
    try:
        pendentes = request.args.get('pendentes', 'false').lower() == 'true'
        prioridade = request.args.get('prioridade')
        cliente_id = request.args.get('cliente_id')
        vencidos = request.args.get('vencidos', 'false').lower() == 'true'
        
        query = Lembrete.query
        
        if pendentes:
            query = query.filter(Lembrete.concluido == False)
        
        if prioridade:
            query = query.filter(Lembrete.prioridade == PrioridadeLembrete(prioridade))
        
        if cliente_id:
            query = query.filter_by(cliente_id=cliente_id)
        
        if vencidos:
            query = query.filter(and_(
                Lembrete.data_lembrete <= datetime.utcnow(),
                Lembrete.concluido == False
            ))
        
        lembretes = query.order_by(Lembrete.data_lembrete).all()
        
        return jsonify([lembrete.to_dict() for lembrete in lembretes])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/lembretes', methods=['POST'])
def criar_lembrete():
    try:
        dados = request.get_json()
        
        if not dados.get('titulo') or not dados.get('data_lembrete'):
            return jsonify({'erro': 'Título e data do lembrete são obrigatórios'}), 400
        
        lembrete = Lembrete(
            cliente_id=dados.get('cliente_id'),
            titulo=dados['titulo'],
            descricao=dados.get('descricao'),
            data_lembrete=datetime.fromisoformat(dados['data_lembrete']),
            prioridade=PrioridadeLembrete(dados.get('prioridade', 'media')),
            recorrente=dados.get('recorrente', False),
            intervalo_recorrencia=dados.get('intervalo_recorrencia')
        )
        
        db.session.add(lembrete)
        db.session.commit()
        
        # Criar notificação se solicitado
        if dados.get('enviar_notificacao'):
            criar_notificacao_lembrete(lembrete)
        
        return jsonify(lembrete.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/lembretes/<int:lembrete_id>', methods=['PUT'])
def atualizar_lembrete(lembrete_id):
    try:
        lembrete = Lembrete.query.get_or_404(lembrete_id)
        dados = request.get_json()
        
        if 'titulo' in dados:
            lembrete.titulo = dados['titulo']
        if 'descricao' in dados:
            lembrete.descricao = dados['descricao']
        if 'data_lembrete' in dados:
            lembrete.data_lembrete = datetime.fromisoformat(dados['data_lembrete'])
        if 'prioridade' in dados:
            lembrete.prioridade = PrioridadeLembrete(dados['prioridade'])
        if 'status' in dados:
            lembrete.concluido = dados['status'] == 'concluido'
            if dados['status'] == 'concluido' and not lembrete.data_conclusao:
                lembrete.data_conclusao = datetime.utcnow()
        if 'recorrencia' in dados:
            lembrete.intervalo_recorrencia = dados['recorrencia']
            lembrete.recorrente = dados['recorrencia'] != 'nenhuma'
        
        lembrete.data_atualizacao = datetime.utcnow()
        db.session.commit()
        
        return jsonify(lembrete.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/lembretes/<int:lembrete_id>', methods=['DELETE'])
def deletar_lembrete(lembrete_id):
    try:
        lembrete = Lembrete.query.get_or_404(lembrete_id)
        db.session.delete(lembrete)
        db.session.commit()
        return jsonify({'mensagem': 'Lembrete deletado com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/lembretes/<int:lembrete_id>/concluir', methods=['PUT'])
def concluir_lembrete(lembrete_id):
    try:
        lembrete = Lembrete.query.get_or_404(lembrete_id)
        lembrete.concluido = True
        lembrete.data_conclusao = datetime.utcnow()
        
        # Se for recorrente, criar próximo lembrete
        if lembrete.recorrente and lembrete.intervalo_recorrencia:
            criar_proximo_lembrete_recorrente(lembrete)
        
        db.session.commit()
        
        return jsonify(lembrete.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

# Funções auxiliares para notificações
def criar_notificacao_agendamento(agendamento):
    try:
        cliente = agendamento.cliente
        notificacao = Notificacao(
            tipo=TipoNotificacao.EMAIL,
            destinatario=cliente.email,
            assunto=f'Agendamento: {agendamento.titulo}',
            mensagem=f'Olá {cliente.nome},\n\nVocê tem um agendamento marcado para {agendamento.data_agendamento.strftime("%d/%m/%Y às %H:%M")}.\n\nTítulo: {agendamento.titulo}\nDescrição: {agendamento.descricao or "Não informado"}\nLocal: {agendamento.local or "Não informado"}\n\nAtenciosamente,\nEquipe CRM',
            agendamento_id=agendamento.id
        )
        
        db.session.add(notificacao)
        db.session.commit()
        
        # Enviar email
        enviar_email(notificacao)
        
    except Exception as e:
        print(f"Erro ao criar notificação de agendamento: {e}")

def criar_notificacao_lembrete(lembrete):
    try:
        cliente = lembrete.cliente
        notificacao = Notificacao(
            tipo=TipoNotificacao.EMAIL,
            destinatario=cliente.email,
            assunto=f'Lembrete: {lembrete.titulo}',
            mensagem=f'Olá {cliente.nome},\n\nEste é um lembrete sobre: {lembrete.titulo}\n\nDescrição: {lembrete.descricao or "Não informado"}\nData: {lembrete.data_lembrete.strftime("%d/%m/%Y às %H:%M")}\nPrioridade: {lembrete.prioridade.value}\n\nAtenciosamente,\nEquipe CRM',
            lembrete_id=lembrete.id
        )
        
        db.session.add(notificacao)
        db.session.commit()
        
        # Enviar email
        enviar_email(notificacao)
        
    except Exception as e:
        print(f"Erro ao criar notificação de lembrete: {e}")

def enviar_email(notificacao):
    try:
        # Configurações do email (usar variáveis de ambiente em produção)
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        email_usuario = os.getenv('EMAIL_USUARIO', 'seu_email@gmail.com')
        email_senha = os.getenv('EMAIL_SENHA', 'sua_senha')
        
        # Criar mensagem
        msg = MIMEMultipart()
        msg['From'] = email_usuario
        msg['To'] = notificacao.destinatario
        msg['Subject'] = notificacao.assunto
        
        msg.attach(MIMEText(notificacao.mensagem, 'plain'))
        
        # Enviar email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(email_usuario, email_senha)
        text = msg.as_string()
        server.sendmail(email_usuario, notificacao.destinatario, text)
        server.quit()
        
        # Marcar como enviada
        notificacao.enviada = True
        notificacao.data_envio = datetime.utcnow()
        db.session.commit()
        
    except Exception as e:
        notificacao.erro = str(e)
        db.session.commit()
        print(f"Erro ao enviar email: {e}")

def criar_proximo_lembrete_recorrente(lembrete_original):
    try:
        # Calcular próxima data baseada no intervalo
        proxima_data = lembrete_original.data_lembrete
        
        if lembrete_original.intervalo_recorrencia == 'diario':
            proxima_data += timedelta(days=1)
        elif lembrete_original.intervalo_recorrencia == 'semanal':
            proxima_data += timedelta(weeks=1)
        elif lembrete_original.intervalo_recorrencia == 'mensal':
            proxima_data += timedelta(days=30)
        elif lembrete_original.intervalo_recorrencia == 'anual':
            proxima_data += timedelta(days=365)
        
        # Criar novo lembrete
        novo_lembrete = Lembrete(
            cliente_id=lembrete_original.cliente_id,
            titulo=lembrete_original.titulo,
            descricao=lembrete_original.descricao,
            data_lembrete=proxima_data,
            prioridade=lembrete_original.prioridade,
            recorrente=True,
            intervalo_recorrencia=lembrete_original.intervalo_recorrencia
        )
        
        db.session.add(novo_lembrete)
        db.session.commit()
        
    except Exception as e:
        print(f"Erro ao criar lembrete recorrente: {e}")

# Relatórios avançados
@cliente_bp.route('/relatorios/resumo', methods=['GET'])
def relatorio_resumo():
    try:
        total_clientes = Cliente.query.filter_by(ativo=True).count()
        total_compras = HistoricoCompra.query.count()
        valor_total_vendas = db.session.query(func.sum(HistoricoCompra.valor)).scalar() or 0
        agendamentos_pendentes = Agendamento.query.filter(
            Agendamento.status.in_([StatusAgendamento.AGENDADO, StatusAgendamento.CONFIRMADO])
        ).count()
        lembretes_pendentes = Lembrete.query.filter_by(concluido=False).count()
        lembretes_vencidos = Lembrete.query.filter(and_(
            Lembrete.data_lembrete <= datetime.utcnow(),
            Lembrete.concluido == False
        )).count()
        
        # Top 5 clientes por valor de compras
        top_clientes = db.session.query(
            Cliente.nome,
            func.sum(HistoricoCompra.valor).label('total_compras')
        ).join(HistoricoCompra).group_by(Cliente.id).order_by(func.sum(HistoricoCompra.valor).desc()).limit(5).all()
        
        # Agendamentos por status
        agendamentos_por_status = db.session.query(
            Agendamento.status,
            func.count(Agendamento.id).label('quantidade')
        ).group_by(Agendamento.status).all()
        
        # Lembretes por prioridade
        lembretes_por_prioridade = db.session.query(
            Lembrete.prioridade,
            func.count(Lembrete.id).label('quantidade')
        ).filter_by(concluido=False).group_by(Lembrete.prioridade).all()
        
        return jsonify({
            'total_clientes': total_clientes,
            'total_compras': total_compras,
            'valor_total_vendas': float(valor_total_vendas),
            'agendamentos_pendentes': agendamentos_pendentes,
            'lembretes_pendentes': lembretes_pendentes,
            'lembretes_vencidos': lembretes_vencidos,
            'top_clientes': [{'nome': nome, 'total_compras': float(total)} for nome, total in top_clientes],
            'agendamentos_por_status': [{'status': status.value if status else 'indefinido', 'quantidade': quantidade} for status, quantidade in agendamentos_por_status],
            'lembretes_por_prioridade': [{'prioridade': prioridade.value if prioridade else 'indefinido', 'quantidade': quantidade} for prioridade, quantidade in lembretes_por_prioridade]
        })
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/relatorios/vendas-periodo', methods=['GET'])
def relatorio_vendas_periodo():
    try:
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        if not data_inicio or not data_fim:
            return jsonify({'erro': 'Data de início e fim são obrigatórias'}), 400
        
        # Converter data_inicio para início do dia (00:00:00)
        data_inicio_dt = datetime.fromisoformat(data_inicio)
        
        # Converter data_fim para final do dia (23:59:59)
        data_fim_dt = datetime.fromisoformat(data_fim)
        data_fim_dt = data_fim_dt.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        vendas = db.session.query(
            func.date(HistoricoCompra.data_compra).label('data'),
            func.sum(HistoricoCompra.valor).label('total'),
            func.count(HistoricoCompra.id).label('quantidade')
        ).filter(
            HistoricoCompra.data_compra >= data_inicio_dt,
            HistoricoCompra.data_compra <= data_fim_dt
        ).group_by(func.date(HistoricoCompra.data_compra)).all()
        
        return jsonify([{
            'data': data.isoformat(),
            'total': float(total),
            'quantidade': quantidade
        } for data, total, quantidade in vendas])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@cliente_bp.route('/clientes/importar-excel', methods=['POST'])
def importar_clientes_excel():
    if 'file' not in request.files:
        return jsonify({'erro': 'Arquivo não enviado'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'erro': 'Nome de arquivo inválido'}), 400

    try:
        # Lê o Excel em um DataFrame
        df = pd.read_excel(file)
        # Normalizar nomes das colunas: remover espaços e deixar minúsculo
        df.columns = [str(col).strip().lower() for col in df.columns]
        # Mapear variações de nomes de colunas para os nomes esperados
        col_map = {
            'nome': ['nome'],
            'email': ['email'],
            'telefone': ['telefone', 'telemovel', 'celular'],
            'endereco': ['endereco', 'endereço', 'morada', 'address'],
            'notas': ['notas', 'observacoes', 'observações', 'obs'],
            'categoria': ['categoria', 'categoria_nome'],
            'quantidade_total_compras': [
                'quantidade_total_compras', 'qtd_compras', 'compras', 'total de compras', 'total_compras', 'quantidade', 'quantidade de compras'
            ],
            'valor_total_compras': [
                'valor_total_compras', 'valor_compras', 'valor', 'valor total de compras', 'valor total', 'total de valor', 'valor total compras'
            ],
            'data_ultima_compra': [
                'data_ultima_compra', 'data da última compra', 'data da ultima compra', 'data', 'data compra', 'data de compra', 'Data de Compra'
            ]
        }
        col_final = {}
        obrigatorias = ['nome']  # Apenas nome é obrigatório
        for key, aliases in col_map.items():
            for alias in aliases:
                if alias in df.columns:
                    col_final[key] = alias
                    break
            else:
                if key in obrigatorias:
                    return jsonify({'erro': f'Coluna obrigatória ausente: {key}'}), 400
                # Se não for obrigatória, apenas ignore

        for _, row in df.iterrows():
            # Validar se o nome não está vazio
            nome_cliente = str(row[col_final['nome']]).strip() if not pd.isna(row[col_final['nome']]) else ''
            if not nome_cliente:
                continue  # Pular linhas sem nome
            
            # Buscar categoria se existir
            categoria_id = None
            if 'categoria' in col_final:
                nome_categoria = str(row[col_final['categoria']]).strip() if not pd.isna(row[col_final['categoria']]) else None
                if nome_categoria:
                    categoria = Categoria.query.filter_by(nome=nome_categoria).first()
                    if not categoria:
                        categoria = Categoria(nome=nome_categoria)
                        db.session.add(categoria)
                        db.session.flush()  # Para pegar o id
                    categoria_id = categoria.id

            email_val = str(row[col_final['email']]).strip() if 'email' in col_final and not pd.isna(row[col_final['email']]) else None
            if email_val == '':
                email_val = None
            cliente = Cliente(
                nome=nome_cliente,
                email=email_val,
                telefone=formatar_telefone(str(row[col_final['telefone']]).strip() if 'telefone' in col_final and not pd.isna(row[col_final['telefone']]) else ''),
                endereco=str(row[col_final['endereco']]).strip() if 'endereco' in col_final and not pd.isna(row[col_final['endereco']]) else '',
                notas=str(row[col_final['notas']]).strip() if 'notas' in col_final and not pd.isna(row[col_final['notas']]) else '',
                categoria_id=categoria_id
            )
            db.session.add(cliente)
            db.session.flush()  # Para pegar o id do cliente

            # Adicionar histórico de compra inicial, se informado
            quantidade = int(row[col_final['quantidade_total_compras']]) if 'quantidade_total_compras' in col_final and not pd.isna(row[col_final['quantidade_total_compras']]) else 0
            valor = float(row[col_final['valor_total_compras']]) if 'valor_total_compras' in col_final and not pd.isna(row[col_final['valor_total_compras']]) else 0
            data_compra = datetime.utcnow()
            if 'data_ultima_compra' in col_final and not pd.isna(row[col_final['data_ultima_compra']]):
                try:
                    data_compra = pd.to_datetime(row[col_final['data_ultima_compra']])
                except Exception:
                    data_compra = datetime.utcnow()
            if quantidade > 0 and valor > 0:
                compra = HistoricoCompra(
                    cliente_id=cliente.id,
                    produto_servico='Compra inicial',
                    valor=valor,
                    quantidade=quantidade,
                    data_compra=data_compra
                )
                db.session.add(compra)
        db.session.commit()
        return jsonify({'mensagem': 'Importação realizada com sucesso!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

