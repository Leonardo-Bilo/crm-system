from flask import Blueprint, request, jsonify
from src.models.cliente import db, HistoricoCompra, Cliente
from datetime import datetime

historico_compra_bp = Blueprint("historico_compra", __name__)

@historico_compra_bp.route("/historico-compras", methods=["GET"])
def get_historico_compras():
    """Listar histórico de compras com filtros opcionais"""
    try:
        cliente_id = request.args.get("cliente_id")
        data_inicio = request.args.get("data_inicio")
        data_fim = request.args.get("data_fim")
        status = request.args.get("status")
        
        query = HistoricoCompra.query.join(Cliente)
        
        if cliente_id:
            query = query.filter(HistoricoCompra.cliente_id == cliente_id)
        
        if data_inicio:
            try:
                data_inicio_dt = datetime.fromisoformat(data_inicio.replace("Z", "+00:00"))
                query = query.filter(HistoricoCompra.data_compra >= data_inicio_dt)
            except ValueError:
                return jsonify({"erro": "Formato de data início inválido"}), 400
        
        if data_fim:
            try:
                data_fim_dt = datetime.fromisoformat(data_fim.replace("Z", "+00:00"))
                query = query.filter(HistoricoCompra.data_compra <= data_fim_dt)
            except ValueError:
                return jsonify({"erro": "Formato de data fim inválido"}), 400
        
        if status:
            query = query.filter(HistoricoCompra.status == status)
        
        compras = query.order_by(HistoricoCompra.data_compra.desc()).all()
        return jsonify([compra.to_dict() for compra in compras])
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@historico_compra_bp.route("/historico-compras", methods=["POST"])
def create_historico_compra():
    """Criar nova compra no histórico"""
    try:
        data = request.json
        
        # Validar campos obrigatórios
        if not data.get("cliente_id"):
            return jsonify({"erro": "Cliente é obrigatório"}), 400
        if not data.get("produto_servico"):
            return jsonify({"erro": "Produto/Serviço é obrigatório"}), 400
        if not data.get("valor"):
            return jsonify({"erro": "Valor é obrigatório"}), 400
        
        # Verificar se o cliente existe
        cliente = Cliente.query.get(data["cliente_id"])
        if not cliente:
            return jsonify({"erro": "Cliente não encontrado"}), 404
        
        # Converter data_compra para datetime
        data_compra = datetime.utcnow()
        if data.get("data_compra"):
            try:
                data_compra = datetime.fromisoformat(data["data_compra"].replace("Z", "+00:00"))
            except ValueError:
                return jsonify({"erro": "Formato de data inválido"}), 400
        
        # Validar valor
        try:
            valor = float(data["valor"])
            if valor <= 0:
                return jsonify({"erro": "Valor deve ser maior que zero"}), 400
        except (ValueError, TypeError):
            return jsonify({"erro": "Valor inválido"}), 400
        
        # Validar quantidade
        quantidade = 1
        if data.get("quantidade"):
            try:
                quantidade = int(data["quantidade"])
                if quantidade <= 0:
                    return jsonify({"erro": "Quantidade deve ser maior que zero"}), 400
            except (ValueError, TypeError):
                return jsonify({"erro": "Quantidade inválida"}), 400
        
        compra = HistoricoCompra(
            cliente_id=data["cliente_id"],
            produto_servico=data["produto_servico"],
            valor=valor,
            quantidade=quantidade,
            data_compra=data_compra,
            observacoes=data.get("observacoes"),
            status=data.get("status", "concluida")
        )
        
        db.session.add(compra)
        db.session.commit()
        
        return jsonify(compra.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": str(e)}), 500

@historico_compra_bp.route("/historico-compras/<int:compra_id>", methods=["GET"])
def get_historico_compra(compra_id):
    """Obter compra específica"""
    try:
        compra = HistoricoCompra.query.get_or_404(compra_id)
        return jsonify(compra.to_dict())
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@historico_compra_bp.route("/historico-compras/<int:compra_id>", methods=["PUT"])
def update_historico_compra(compra_id):
    """Atualizar compra"""
    try:
        compra = HistoricoCompra.query.get_or_404(compra_id)
        data = request.json
        
        # Salvar valores antigos para atualização do cliente
        old_valor = compra.valor
        old_quantidade = compra.quantidade

        # Validar cliente se fornecido
        if data.get("cliente_id"):
            cliente = Cliente.query.get(data["cliente_id"])
            if not cliente:
                return jsonify({"erro": "Cliente não encontrado"}), 404
            compra.cliente_id = data["cliente_id"]
        
        # Atualizar campos
        if data.get("produto_servico"):
            compra.produto_servico = data["produto_servico"]
        
        if data.get("valor"):
            try:
                valor = float(data["valor"])
                if valor <= 0:
                    return jsonify({"erro": "Valor deve ser maior que zero"}), 400
                compra.valor = valor
            except (ValueError, TypeError):
                return jsonify({"erro": "Valor inválido"}), 400
        
        if data.get("quantidade"):
            try:
                quantidade = int(data["quantidade"])
                if quantidade <= 0:
                    return jsonify({"erro": "Quantidade deve ser maior que zero"}), 400
                compra.quantidade = quantidade
            except (ValueError, TypeError):
                return jsonify({"erro": "Quantidade inválida"}), 400
        
        if data.get("data_compra"):
            try:
                compra.data_compra = datetime.fromisoformat(data["data_compra"].replace("Z", "+00:00"))
            except ValueError:
                return jsonify({"erro": "Formato de data inválido"}), 400
        
        if "observacoes" in data:
            compra.observacoes = data["observacoes"]
        
        if data.get("status"):
            compra.status = data["status"]
        
        db.session.commit()
        
        return jsonify(compra.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": str(e)}), 500

@historico_compra_bp.route("/historico-compras/<int:compra_id>", methods=["DELETE"])
def delete_historico_compra(compra_id):
    """Excluir compra"""
    try:
        compra = HistoricoCompra.query.get_or_404(compra_id)
        
        db.session.delete(compra)
        db.session.commit()
        
        return "", 204
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": str(e)}), 500

@historico_compra_bp.route("/historico-compras/cliente/<int:cliente_id>/resumo", methods=["GET"])
def get_resumo_compras_cliente(cliente_id):
    """Obter resumo das compras de um cliente"""
    try:
        cliente = Cliente.query.get_or_404(cliente_id)
        
        compras = HistoricoCompra.query.filter_by(cliente_id=cliente_id).all()
        
        total_compras = len(compras)
        valor_total = sum(compra.valor for compra in compras)
        quantidade_total = sum(compra.quantidade for compra in compras)
        
        # Compras por status
        compras_por_status = {}
        for compra in compras:
            status = compra.status
            if status not in compras_por_status:
                compras_por_status[status] = {"quantidade": 0, "valor": 0}
            compras_por_status[status]["quantidade"] += 1
            compras_por_status[status]["valor"] += compra.valor
        
        # Última compra
        ultima_compra = None
        if compras:
            ultima_compra = max(compras, key=lambda c: c.data_compra).to_dict()
        
        return jsonify({
            "cliente_id": cliente_id,
            "cliente_nome": cliente.nome,
            "total_compras": total_compras,
            "valor_total": valor_total,
            "quantidade_total": quantidade_total,
            "compras_por_status": compras_por_status,
            "ultima_compra": ultima_compra
        })
        
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@historico_compra_bp.route("/historico-compras/estatisticas", methods=["GET"])
def get_estatisticas_compras():
    """Obter estatísticas gerais das compras"""
    try:
        data_inicio = request.args.get("data_inicio")
        data_fim = request.args.get("data_fim")
        
        query = HistoricoCompra.query
        
        if data_inicio:
            try:
                data_inicio_dt = datetime.fromisoformat(data_inicio.replace("Z", "+00:00"))
                query = query.filter(HistoricoCompra.data_compra >= data_inicio_dt)
            except ValueError:
                return jsonify({"erro": "Formato de data início inválido"}), 400
        
        if data_fim:
            try:
                data_fim_dt = datetime.fromisoformat(data_fim.replace("Z", "+00:00"))
                query = query.filter(HistoricoCompra.data_compra <= data_fim_dt)
            except ValueError:
                return jsonify({"erro": "Formato de data fim inválido"}), 400
        
        compras = query.all()
        
        total_compras = len(compras)
        valor_total = sum(compra.valor for compra in compras)
        quantidade_total = sum(compra.quantidade for compra in compras)
        
        # Valor médio por compra
        valor_medio = valor_total / total_compras if total_compras > 0 else 0
        
        # Produtos/serviços mais vendidos
        produtos_vendidos = {}
        for compra in compras:
            produto = compra.produto_servico
            if produto not in produtos_vendidos:
                produtos_vendidos[produto] = {"quantidade": 0, "valor": 0}
            produtos_vendidos[produto]["quantidade"] += compra.quantidade
            produtos_vendidos[produto]["valor"] += compra.valor
        
        # Top 5 produtos por valor
        top_produtos = sorted(
            produtos_vendidos.items(),
            key=lambda x: x[1]["valor"],
            reverse=True
        )[:5]
        
        return jsonify({
            "total_compras": total_compras,
            "valor_total": valor_total,
            "quantidade_total": quantidade_total,
            "valor_medio": valor_medio,
            "top_produtos": [
                {
                    "produto": produto,
                    "quantidade": dados["quantidade"],
                    "valor": dados["valor"]
                }
                for produto, dados in top_produtos
            ]
        })
        
    except Exception as e:
        return jsonify({"erro": str(e)}), 500


