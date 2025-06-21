from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum

db = SQLAlchemy()

# Enum para status de agendamentos
class StatusAgendamento(Enum):
    AGENDADO = "agendado"
    CONFIRMADO = "confirmado"
    CONCLUIDO = "concluido"
    CANCELADO = "cancelado"
    REAGENDADO = "reagendado"

# Enum para prioridade de lembretes
class PrioridadeLembrete(Enum):
    BAIXA = "baixa"
    MEDIA = "media"
    ALTA = "alta"
    URGENTE = "urgente"

# Enum para tipo de notificação
class TipoNotificacao(Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    SISTEMA = "sistema"

class Tag(db.Model):
    __tablename__ = 'tags'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50), unique=True, nullable=False)
    cor = db.Column(db.String(7), default='#3B82F6')  # Cor em hexadecimal
    descricao = db.Column(db.Text, nullable=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Tag {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'cor': self.cor,
            'descricao': self.descricao,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }

class Categoria(db.Model):
    __tablename__ = 'categorias'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50), unique=True, nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Categoria {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }

# Tabela de associação para tags de clientes (many-to-many)
cliente_tags = db.Table('cliente_tags',
    db.Column('cliente_id', db.Integer, db.ForeignKey('clientes.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    telefone = db.Column(db.String(20), nullable=True)
    endereco = db.Column(db.Text, nullable=True)
    notas = db.Column(db.Text, nullable=True)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=True)
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    ativo = db.Column(db.Boolean, default=True)
    
    # Relacionamentos
    categoria = db.relationship('Categoria', backref='clientes')
    tags = db.relationship('Tag', secondary=cliente_tags, lazy='subquery',
                          backref=db.backref('clientes', lazy=True))
    historico_compras = db.relationship('HistoricoCompra', backref='cliente', lazy=True, cascade='all, delete-orphan')
    agendamentos = db.relationship('Agendamento', backref='cliente', lazy=True, cascade='all, delete-orphan')
    lembretes = db.relationship('Lembrete', backref='cliente', lazy=True, cascade='all, delete-orphan')
    interacoes = db.relationship('InteracaoCliente', backref='cliente', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Cliente {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'telefone': self.telefone,
            'endereco': self.endereco,
            'notas': self.notas,
            'categoria': self.categoria.to_dict() if self.categoria else None,
            'tags': [tag.to_dict() for tag in self.tags],
            'data_cadastro': self.data_cadastro.isoformat() if self.data_cadastro else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None,
            'ativo': self.ativo,
            'total_compras': len(self.historico_compras),
            'valor_total_compras': sum([compra.valor for compra in self.historico_compras])
        }

    def to_dict_detailed(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'telefone': self.telefone,
            'endereco': self.endereco,
            'notas': self.notas,
            'categoria': self.categoria.to_dict() if self.categoria else None,
            'tags': [tag.to_dict() for tag in self.tags],
            'data_cadastro': self.data_cadastro.isoformat() if self.data_cadastro else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None,
            'ativo': self.ativo,
            'historico_compras': [compra.to_dict() for compra in self.historico_compras],
            'agendamentos': [agendamento.to_dict() for agendamento in self.agendamentos],
            'lembretes': [lembrete.to_dict() for lembrete in self.lembretes],
            'interacoes': [interacao.to_dict() for interacao in self.interacoes]
        }

class HistoricoCompra(db.Model):
    __tablename__ = 'historico_compras'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    produto_servico = db.Column(db.String(200), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    quantidade = db.Column(db.Integer, default=1)
    data_compra = db.Column(db.DateTime, default=datetime.utcnow)
    observacoes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='concluida')  # concluida, cancelada, pendente

    def __repr__(self):
        return f'<HistoricoCompra {self.produto_servico} - R$ {self.valor}>'

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'produto_servico': self.produto_servico,
            'valor': self.valor,
            'quantidade': self.quantidade,
            'data_compra': self.data_compra.isoformat() if self.data_compra else None,
            'observacoes': self.observacoes,
            'status': self.status
        }

class Agendamento(db.Model):
    __tablename__ = 'agendamentos'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    data_agendamento = db.Column(db.DateTime, nullable=False)
    data_fim = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.Enum(StatusAgendamento), default=StatusAgendamento.AGENDADO)
    tipo = db.Column(db.String(50), nullable=True)  # reuniao, ligacao, visita, etc.
    local = db.Column(db.String(200), nullable=True)
    observacoes = db.Column(db.Text, nullable=True)
    lembrete_enviado = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Agendamento {self.titulo}>'

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'cliente_nome': self.cliente.nome if self.cliente else None,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'data_agendamento': self.data_agendamento.isoformat() if self.data_agendamento else None,
            'data_fim': self.data_fim.isoformat() if self.data_fim else None,
            'status': self.status.value if self.status else None,
            'tipo': self.tipo,
            'local': self.local,
            'observacoes': self.observacoes,
            'lembrete_enviado': self.lembrete_enviado,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None
        }

class Lembrete(db.Model):
    __tablename__ = 'lembretes'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=True)
    titulo = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    data_lembrete = db.Column(db.DateTime, nullable=False)
    prioridade = db.Column(db.Enum(PrioridadeLembrete), default=PrioridadeLembrete.MEDIA)
    concluido = db.Column(db.Boolean, default=False)
    data_conclusao = db.Column(db.DateTime, nullable=True)
    recorrente = db.Column(db.Boolean, default=False)
    intervalo_recorrencia = db.Column(db.String(20), nullable=True)  # diario, semanal, mensal, anual
    notificacao_enviada = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Lembrete {self.titulo}>'

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'cliente_nome': self.cliente.nome if self.cliente else None,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'data_lembrete': self.data_lembrete.isoformat() if self.data_lembrete else None,
            'prioridade': self.prioridade.value if self.prioridade else None,
            'concluido': self.concluido,
            'data_conclusao': self.data_conclusao.isoformat() if self.data_conclusao else None,
            'recorrente': self.recorrente,
            'intervalo_recorrencia': self.intervalo_recorrencia,
            'notificacao_enviada': self.notificacao_enviada,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None
        }

class Notificacao(db.Model):
    __tablename__ = 'notificacoes'
    
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.Enum(TipoNotificacao), nullable=False)
    destinatario = db.Column(db.String(200), nullable=False)  # email ou telefone
    assunto = db.Column(db.String(200), nullable=False)
    mensagem = db.Column(db.Text, nullable=False)
    enviada = db.Column(db.Boolean, default=False)
    data_envio = db.Column(db.DateTime, nullable=True)
    erro = db.Column(db.Text, nullable=True)
    agendamento_id = db.Column(db.Integer, db.ForeignKey('agendamentos.id'), nullable=True)
    lembrete_id = db.Column(db.Integer, db.ForeignKey('lembretes.id'), nullable=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)

    # Relacionamentos
    agendamento = db.relationship('Agendamento', backref='notificacoes')
    lembrete = db.relationship('Lembrete', backref='notificacoes')

    def __repr__(self):
        return f'<Notificacao {self.assunto}>'

    def to_dict(self):
        return {
            'id': self.id,
            'tipo': self.tipo.value if self.tipo else None,
            'destinatario': self.destinatario,
            'assunto': self.assunto,
            'mensagem': self.mensagem,
            'enviada': self.enviada,
            'data_envio': self.data_envio.isoformat() if self.data_envio else None,
            'erro': self.erro,
            'agendamento_id': self.agendamento_id,
            'lembrete_id': self.lembrete_id,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }

class InteracaoCliente(db.Model):
    __tablename__ = 'interacoes_cliente'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)  # email, ligacao, reuniao, whatsapp, etc.
    assunto = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    data_interacao = db.Column(db.DateTime, default=datetime.utcnow)
    duracao = db.Column(db.Integer, nullable=True)  # em minutos
    resultado = db.Column(db.String(100), nullable=True)  # positivo, negativo, neutro
    observacoes = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f'<InteracaoCliente {self.tipo} - {self.assunto}>'

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'tipo': self.tipo,
            'assunto': self.assunto,
            'descricao': self.descricao,
            'data_interacao': self.data_interacao.isoformat() if self.data_interacao else None,
            'duracao': self.duracao,
            'resultado': self.resultado,
            'observacoes': self.observacoes
        }

