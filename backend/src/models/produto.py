from src.models.cliente import db
from datetime import datetime
from enum import Enum

# Enum para tipo de produto/serviço
class TipoProduto(Enum):
    PRODUTO = "produto"
    SERVICO = "servico"

# Enum para status do produto/serviço
class StatusProduto(Enum):
    ATIVO = "ativo"
    INATIVO = "inativo"
    ESGOTADO = "esgotado"

class CategoriaProduto(db.Model):
    __tablename__ = 'categorias_produto'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), unique=True, nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    cor = db.Column(db.String(7), default='#3B82F6')  # Cor em hexadecimal
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<CategoriaProduto {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'cor': self.cor,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }

class Produto(db.Model):
    __tablename__ = 'produtos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    codigo = db.Column(db.String(50), unique=True, nullable=True)  # Código/SKU do produto
    tipo = db.Column(db.Enum(TipoProduto), default=TipoProduto.PRODUTO)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias_produto.id'), nullable=True)
    
    # Informações financeiras
    custo = db.Column(db.Float, nullable=False, default=0.0)
    valor_venda = db.Column(db.Float, nullable=False, default=0.0)
    margem_lucro = db.Column(db.Float, nullable=True)  # Calculado automaticamente
    
    # Informações de estoque (apenas para produtos)
    estoque_atual = db.Column(db.Integer, default=0)
    estoque_minimo = db.Column(db.Integer, default=0)
    unidade_medida = db.Column(db.String(20), default='un')  # un, kg, m, etc.
    
    # Informações adicionais
    fornecedor = db.Column(db.String(200), nullable=True)
    tempo_entrega = db.Column(db.Integer, nullable=True)  # em dias
    observacoes = db.Column(db.Text, nullable=True)
    
    # Status e controle
    status = db.Column(db.Enum(StatusProduto), default=StatusProduto.ATIVO)
    destaque = db.Column(db.Boolean, default=False)  # Produto em destaque
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    categoria = db.relationship('CategoriaProduto', backref='produtos')
    
    def __repr__(self):
        return f'<Produto {self.nome}>'

    def calcular_margem_lucro(self):
        """Calcula a margem de lucro em porcentagem"""
        if self.custo > 0 and self.valor_venda > 0:
            return ((self.valor_venda - self.custo) / self.custo) * 100
        return 0

    def calcular_lucro_unitario(self):
        """Calcula o lucro unitário"""
        return self.valor_venda - self.custo

    def verificar_estoque_baixo(self):
        """Verifica se o estoque está baixo"""
        if self.tipo == TipoProduto.PRODUTO:
            return self.estoque_atual <= self.estoque_minimo
        return False

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'codigo': self.codigo,
            'tipo': self.tipo.value if self.tipo else None,
            'categoria': self.categoria.to_dict() if self.categoria else None,
            'custo': self.custo,
            'valor_venda': self.valor_venda,
            'margem_lucro': self.calcular_margem_lucro(),
            'lucro_unitario': self.calcular_lucro_unitario(),
            'estoque_atual': self.estoque_atual,
            'estoque_minimo': self.estoque_minimo,
            'estoque_baixo': self.verificar_estoque_baixo(),
            'unidade_medida': self.unidade_medida,
            'fornecedor': self.fornecedor,
            'tempo_entrega': self.tempo_entrega,
            'observacoes': self.observacoes,
            'status': self.status.value if self.status else None,
            'destaque': self.destaque,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None
        }

    def to_dict_detailed(self):
        return {
            **self.to_dict(),
            'categoria_nome': self.categoria.nome if self.categoria else None,
            'tipo_display': 'Produto' if self.tipo == TipoProduto.PRODUTO else 'Serviço',
            'status_display': self.status.value.title() if self.status else None
        } 