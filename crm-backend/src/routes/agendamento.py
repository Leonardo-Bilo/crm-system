from flask import Blueprint, request, jsonify
from src.models.cliente import db, Agendamento, Cliente, StatusAgendamento
from datetime import datetime

agendamento_bp = Blueprint('agendamento', __name__)

@agendamento_bp.route('/agendamentos', methods=['GET'])
def get_agendamentos():
    """Listar todos os agendamentos"""
    try:
        agendamentos = Agendamento.query.join(Cliente).all()
        return jsonify([agendamento.to_dict() for agendamento in agendamentos])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@agendamento_bp.route('/agendamentos', methods=['POST'])
def create_agendamento():
    """Criar novo agendamento"""
    try:
        data = request.json
        
        # Validar campos obrigatórios
        if not data.get('cliente_id'):
            return jsonify({'erro': 'Cliente é obrigatório'}), 400
        if not data.get('titulo'):
            return jsonify({'erro': 'Título é obrigatório'}), 400
        if not data.get('data_agendamento'):
            return jsonify({'erro': 'Data do agendamento é obrigatória'}), 400
        
        # Verificar se o cliente existe
        cliente = Cliente.query.get(data['cliente_id'])
        if not cliente:
            return jsonify({'erro': 'Cliente não encontrado'}), 404
        
        # Converter data_agendamento para datetime
        try:
            data_agendamento = datetime.fromisoformat(data['data_agendamento'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'erro': 'Formato de data inválido'}), 400
        
        # Converter data_fim se fornecida
        data_fim = None
        if data.get('data_fim'):
            try:
                data_fim = datetime.fromisoformat(data['data_fim'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'erro': 'Formato de data fim inválido'}), 400
        
        # Converter status para enum
        status = StatusAgendamento.AGENDADO
        if data.get('status'):
            try:
                status = StatusAgendamento(data['status'])
            except ValueError:
                return jsonify({'erro': 'Status inválido'}), 400
        
        agendamento = Agendamento(
            cliente_id=data['cliente_id'],
            titulo=data['titulo'],
            descricao=data.get('descricao'),
            data_agendamento=data_agendamento,
            data_fim=data_fim,
            status=status,
            tipo=data.get('tipo'),
            local=data.get('local'),
            observacoes=data.get('observacoes')
        )
        
        db.session.add(agendamento)
        db.session.commit()
        
        return jsonify(agendamento.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@agendamento_bp.route('/agendamentos/<int:agendamento_id>', methods=['GET'])
def get_agendamento(agendamento_id):
    """Obter agendamento específico"""
    try:
        agendamento = Agendamento.query.get_or_404(agendamento_id)
        return jsonify(agendamento.to_dict())
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@agendamento_bp.route('/agendamentos/<int:agendamento_id>', methods=['PUT'])
def update_agendamento(agendamento_id):
    """Atualizar agendamento"""
    try:
        agendamento = Agendamento.query.get_or_404(agendamento_id)
        data = request.json
        
        # Validar cliente se fornecido
        if data.get('cliente_id'):
            cliente = Cliente.query.get(data['cliente_id'])
            if not cliente:
                return jsonify({'erro': 'Cliente não encontrado'}), 404
            agendamento.cliente_id = data['cliente_id']
        
        # Atualizar campos
        if data.get('titulo'):
            agendamento.titulo = data['titulo']
        
        if 'descricao' in data:
            agendamento.descricao = data['descricao']
        
        if data.get('data_agendamento'):
            try:
                agendamento.data_agendamento = datetime.fromisoformat(data['data_agendamento'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'erro': 'Formato de data inválido'}), 400
        
        if 'data_fim' in data:
            if data['data_fim']:
                try:
                    agendamento.data_fim = datetime.fromisoformat(data['data_fim'].replace('Z', '+00:00'))
                except ValueError:
                    return jsonify({'erro': 'Formato de data fim inválido'}), 400
            else:
                agendamento.data_fim = None
        
        if data.get('status'):
            try:
                agendamento.status = StatusAgendamento(data['status'])
            except ValueError:
                return jsonify({'erro': 'Status inválido'}), 400
        
        if 'tipo' in data:
            agendamento.tipo = data['tipo']
        
        if 'local' in data:
            agendamento.local = data['local']
        
        if 'observacoes' in data:
            agendamento.observacoes = data['observacoes']
        
        agendamento.data_atualizacao = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(agendamento.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@agendamento_bp.route('/agendamentos/<int:agendamento_id>', methods=['DELETE'])
def delete_agendamento(agendamento_id):
    """Excluir agendamento"""
    try:
        agendamento = Agendamento.query.get_or_404(agendamento_id)
        
        db.session.delete(agendamento)
        db.session.commit()
        
        return '', 204
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@agendamento_bp.route('/agendamentos/<int:agendamento_id>/status', methods=['PUT'])
def update_status_agendamento(agendamento_id):
    """Atualizar apenas o status do agendamento"""
    try:
        agendamento = Agendamento.query.get_or_404(agendamento_id)
        data = request.json
        
        if not data.get('status'):
            return jsonify({'erro': 'Status é obrigatório'}), 400
        
        try:
            agendamento.status = StatusAgendamento(data['status'])
        except ValueError:
            return jsonify({'erro': 'Status inválido'}), 400
        
        agendamento.data_atualizacao = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(agendamento.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@agendamento_bp.route('/agendamentos/cliente/<int:cliente_id>', methods=['GET'])
def get_agendamentos_cliente(cliente_id):
    """Listar agendamentos de um cliente específico"""
    try:
        cliente = Cliente.query.get_or_404(cliente_id)
        agendamentos = Agendamento.query.filter_by(cliente_id=cliente_id).all()
        return jsonify([agendamento.to_dict() for agendamento in agendamentos])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@agendamento_bp.route('/agendamentos/status/<status>', methods=['GET'])
def get_agendamentos_por_status(status):
    """Listar agendamentos por status"""
    try:
        try:
            status_enum = StatusAgendamento(status)
        except ValueError:
            return jsonify({'erro': 'Status inválido'}), 400
        
        agendamentos = Agendamento.query.filter_by(status=status_enum).all()
        return jsonify([agendamento.to_dict() for agendamento in agendamentos])
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

