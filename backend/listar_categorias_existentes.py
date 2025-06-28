from src.main import app
from src.models.produto import CategoriaProduto

with app.app_context():
    categorias = CategoriaProduto.query.all()
    print(f'Categorias encontradas: {len(categorias)}')
    for cat in categorias:
        print(f'ID: {cat.id}, Nome: {cat.nome}') 