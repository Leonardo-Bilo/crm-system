"""
Adiciona a coluna tipo_cliente na tabela clientes
"""
from alembic import op
import sqlalchemy as sa

# Revisão gerada manualmente
revision = '20240628_01'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('clientes', sa.Column('tipo_cliente', sa.String(length=50), nullable=True))

def downgrade():
    op.drop_column('clientes', 'tipo_cliente') 