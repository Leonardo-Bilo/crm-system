# 🚀 Sistema CRM Completo

Um sistema de gestão de relacionamento com clientes (CRM) completo desenvolvido com **Backend Python (Flask)** e **Frontend React**.

## 📁 Estrutura do Projeto

```
crm-system/
├── backend/          # Backend Python (Flask)
│   ├── src/         # Código fonte Python
│   ├── migrations/  # Migrações do banco de dados
│   ├── requirements.txt
│   └── ...
├── frontend/        # Frontend React + Tauri
│   ├── src/         # Código fonte React
│   ├── src-tauri/   # Configuração Tauri
│   ├── package.json
│   └── ...
└── README.md
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.11+**
- **Flask** - Framework web
- **SQLAlchemy** - ORM
- **Alembic** - Migrações de banco
- **MySQL/PostgreSQL** - Banco de dados

### Frontend
- **React 18** - Framework JavaScript
- **Vite** - Build tool
- **Tauri** - Desktop app framework
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI

## 🚀 Instalação e Configuração

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- pnpm ou npm
- MySQL ou PostgreSQL

### Backend

1. **Navegue para a pasta backend:**
```bash
cd backend
```

2. **Crie um ambiente virtual:**
```bash
python -m venv venv
```

3. **Ative o ambiente virtual:**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **Instale as dependências:**
```bash
pip install -r requirements.txt
```

5. **Configure o banco de dados:**
```bash
# Execute o script de configuração
python setup_database.sql
```

6. **Execute as migrações:**
```bash
alembic upgrade head
```

7. **Inicie o servidor:**
```bash
python src/main.py
```

O backend estará disponível em: `http://localhost:5000`

### Frontend

1. **Navegue para a pasta frontend:**
```bash
cd frontend
```

2. **Instale as dependências:**
```bash
pnpm install
# ou
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
pnpm dev
# ou
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 📋 Funcionalidades

### Dashboard
- Visão geral do negócio
- Estatísticas de clientes, vendas e agendamentos
- Gráficos interativos

### Gestão de Clientes
- Cadastro e edição de clientes
- Histórico de compras
- Categorização de clientes
- Importação/Exportação de dados

### Agendamentos
- Agendamento de compromissos
- Status de agendamentos
- Lembretes automáticos

### Relatórios
- Relatórios de vendas
- Análise de dados
- Exportação em Excel/PDF

### Lembretes
- Sistema de lembretes
- Notificações
- Status de conclusão

## 🔧 Configuração do Banco de Dados

1. Crie um banco de dados MySQL/PostgreSQL
2. Configure as variáveis de ambiente no arquivo `.env`
3. Execute as migrações com Alembic

## 📦 Build para Produção

### Backend
```bash
cd backend
python -m build
```

### Frontend
```bash
cd frontend
pnpm build
pnpm tauri build
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Leonardo Bilo**
- GitHub: [@Leonardo-Bilo](https://github.com/Leonardo-Bilo)

## 🙏 Agradecimentos

- Comunidade Flask
- Comunidade React
- Comunidade Tauri
- Todos os contribuidores 