#!/usr/bin/env python3
"""
Script para listar todas as rotas registradas no Flask
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask
from flask_cors import CORS
from src.models.cliente import db
from src.routes.user import user_bp
from src.routes.cliente import cliente_bp
from src.routes.relatorios import relatorios_bp
from src.routes.agendamento import agendamento_bp
from src.routes.historico_compra import historico_compra_bp
from src.routes.lembrete import lembrete_bp
from src.routes.produto import produto_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'
CORS(app)

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(cliente_bp, url_prefix='/api')
app.register_blueprint(relatorios_bp, url_prefix='/api')
app.register_blueprint(agendamento_bp, url_prefix='/api')
app.register_blueprint(historico_compra_bp, url_prefix='/api')
app.register_blueprint(lembrete_bp, url_prefix='/api')
app.register_blueprint(produto_bp, url_prefix='/api')

print("🔍 ROTAS REGISTRADAS NO FLASK:")
print("=" * 60)

with app.app_context():
    for rule in app.url_map.iter_rules():
        methods = ','.join(rule.methods - {'HEAD', 'OPTIONS'})
        print(f"{rule.rule:<40} {methods}")

print("\n🔍 ROTAS ESPECÍFICAS DE PRODUTOS:")
print("=" * 60)

# Listar rotas específicas do blueprint de produtos
for rule in app.url_map.iter_rules():
    if 'produtos' in rule.rule:
        methods = ','.join(rule.methods - {'HEAD', 'OPTIONS'})
        print(f"{rule.rule:<40} {methods}")

print("\n✅ Listagem concluída!") 