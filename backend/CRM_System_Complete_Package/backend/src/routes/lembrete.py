from flask import Blueprint, request, jsonify
from src.models.cliente import db, Lembrete, Cliente, PrioridadeLembrete
from datetime import datetime

lembrete_bp = Blueprint('lembrete', __name__)

@lembrete_bp.route('/lembretes', methods=['GET'])
def get_lembretes():
    """Listar lembretes com filtros opcionais"""
    try:
        query = Lembrete.query.join(Cliente)
        
        # Filtros opcionais
        pendentes = request.args.get('pendentes', 'false').lower() == 'true'
        vencidos = request.args.get('vencidos', 'false').lower() == 'true'
        
        if pendentes:
            query = query.filter(Lembrete.concluido == False)
        
        if vencidos:
            query = query.filter(
                Lembrete.data_lembrete < datetime.utcnow(),
                Lembrete.concluido == False
            )
        
        lembretes = query.all()
        return jsonify([lembrete.to_dict() for lembrete in lembretes])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@lembrete_bp.route('/lembretes', methods=['POST'])
def create_lembrete():
    """Criar novo lembrete"""
    try:
        data = request.json
        
        # Validar campos obrigatórios
        if not data.get('titulo'):
            return jsonify({'erro': 'Título é obrigatório'}), 400
        if not data.get('data_lembrete'):
            return jsonify({'erro': 'Data do lembrete é obrigatória'}), 400
        
        # Verificar se o cliente existe, se fornecido
        cliente = None
        if data.get('cliente_id'):
            cliente = Cliente.query.get(data['cliente_id'])
            if not cliente:
                return jsonify({'erro': 'Cliente não encontrado'}), 404
        
        # Converter data_lembrete para datetime
        try:
            data_lembrete = datetime.fromisoformat(data['data_lembrete'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'erro': 'Formato de data inválido'}), 400
        
        # Converter prioridade para enum
        prioridade = PrioridadeLembrete.MEDIA
        if data.get('prioridade'):
            try:
                prioridade = PrioridadeLembrete(data['prioridade'])
            except ValueError:
                return jsonify({'erro': 'Prioridade inválida'}), 400
        
        # Determinar se está concluído baseado no status
        concluido = False
        data_conclusao = None
        if data.get('status') == 'concluido':
            concluido = True
            data_conclusao = datetime.utcnow()
        
        lembrete = Lembrete(
            cliente_id=data.get('cliente_id'),
            titulo=data['titulo'],
            descricao=data.get('descricao'),
            data_lembrete=data_lembrete,
            prioridade=prioridade,
            concluido=concluido,
            data_conclusao=data_conclusao,
            recorrente=data.get('recorrente', False),
            intervalo_recorrencia=data.get('recorrencia') if data.get('recorrencia') != 'nenhuma' else None
        )
        
        db.session.add(lembrete)
        db.session.commit()
        
        return jsonify(lembrete.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@lembrete_bp.route('/lembretes/<int:lembrete_id>', methods=['GET'])
def get_lembrete(lembrete_id):
    """Obter lembrete específico"""
    try:
        lembrete = Lembrete.query.get_or_404(lembrete_id)
        return jsonify(lembrete.to_dict())
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@lembrete_bp.route('/lembretes/<int:lembrete_id>', methods=['PUT'])
def update_lembrete(lembrete_id):
    """Atualizar lembrete"""
    try:
        lembrete = Lembrete.query.get_or_404(lembrete_id)
        data = request.json
        
        # Validar cliente se fornecido
        if data.get('cliente_id'):
            cliente = Cliente.query.get(data['cliente_id'])
            if not cliente:
                return jsonify({'erro': 'Cliente não encontrado'}), 404
            lembrete.cliente_id = data['cliente_id']
        
        # Atualizar campos
        if data.get('titulo'):
            lembrete.titulo = data['titulo']
        
        if 'descricao' in data:
            lembrete.descricao = data['descricao']
        
        if data.get('data_lembrete'):
            try:
                lembrete.data_lembrete = datetime.fromisoformat(data['data_lembrete'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'erro': 'Formato de data inválido'}), 400
        
        if data.get('prioridade'):
            try:
                lembrete.prioridade = PrioridadeLembrete(data['prioridade'])
            except ValueError:
                return jsonify({'erro': 'Prioridade inválida'}), 400
        
        # Atualizar status (concluido baseado no status)
        if data.get('status'):
            if data['status'] == 'concluido':
                lembrete.concluido = True
                if not lembrete.data_conclusao:
                    lembrete.data_conclusao = datetime.utcnow()
            elif data['status'] == 'pendente':
                lembrete.concluido = False
                lembrete.data_conclusao = None
        
        if 'recorrente' in data:
            lembrete.recorrente = data['recorrente']
        
        if 'recorrencia' in data:
            lembrete.intervalo_recorrencia = data['recorrencia'] if data['recorrencia'] != 'nenhuma' else None
        
        lembrete.data_atualizacao = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(lembrete.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@lembrete_bp.route('/lembretes/<int:lembrete_id>', methods=['DELETE'])
def delete_lembrete(lembrete_id):
    """Excluir lembrete"""
    try:
        lembrete = Lembrete.query.get_or_404(lembrete_id)
        
        db.session.delete(lembrete)
        db.session.commit()
        
        return '', 204
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@lembrete_bp.route('/lembretes/<int:lembrete_id>/concluir', methods=['PUT'])
def concluir_lembrete(lembrete_id):
    """Marcar lembrete como concluído"""
    try:
        lembrete = Lembrete.query.get_or_404(lembrete_id)
        
        lembrete.concluido = True
        lembrete.data_conclusao = datetime.utcnow()
        lembrete.data_atualizacao = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(lembrete.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@lembrete_bp.route('/lembretes/<int:lembrete_id>/reabrir', methods=['PUT'])
def reabrir_lembrete(lembrete_id):
    """Reabrir lembrete (marcar como não concluído)"""
    try:
        lembrete = Lembrete.query.get_or_404(lembrete_id)
        
        lembrete.concluido = False
        lembrete.data_conclusao = None
        lembrete.data_atualizacao = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(lembrete.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@lembrete_bp.route('/lembretes/cliente/<int:cliente_id>', methods=['GET'])
def get_lembretes_cliente(cliente_id):
    """Listar lembretes de um cliente específico"""
    try:
        cliente = Cliente.query.get_or_404(cliente_id)
        lembretes = Lembrete.query.filter_by(cliente_id=cliente_id).all()
        return jsonify([lembrete.to_dict() for lembrete in lembretes])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@lembrete_bp.route('/lembretes/prioridade/<prioridade>', methods=['GET'])
def get_lembretes_por_prioridade(prioridade):
    """Listar lembretes por prioridade"""
    try:
        try:
            prioridade_enum = PrioridadeLembrete(prioridade)
        except ValueError:
            return jsonify({'erro': 'Prioridade inválida'}), 400
        
        lembretes = Lembrete.query.filter_by(prioridade=prioridade_enum).all()
        return jsonify([lembrete.to_dict() for lembrete in lembretes])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@lembrete_bp.route('/lembretes/vencidos', methods=['GET'])
def get_lembretes_vencidos():
    """Listar lembretes vencidos (não concluídos e com data passada)"""
    try:
        lembretes = Lembrete.query.filter(
            Lembrete.data_lembrete < datetime.utcnow(),
            Lembrete.concluido == False
        ).all()
        return jsonify([lembrete.to_dict() for lembrete in lembretes])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@lembrete_bp.route('/lembretes/hoje', methods=['GET'])
def get_lembretes_hoje():
    """Listar lembretes para hoje"""
    try:
        hoje = datetime.utcnow().date()
        lembretes = Lembrete.query.filter(
            db.func.date(Lembrete.data_lembrete) == hoje,
            Lembrete.concluido == False
        ).all()
        return jsonify([lembrete.to_dict() for lembrete in lembretes])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

