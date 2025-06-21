-- Script de configuração do banco de dados CRM System
-- Este script cria o banco de dados e o usuário

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS crm_sistema CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário (se não existir)
CREATE USER IF NOT EXISTS 'crm_user'@'localhost' IDENTIFIED BY 'Apollo47';

-- Conceder privilégios
GRANT ALL PRIVILEGES ON crm_sistema.* TO 'crm_user'@'localhost';

-- Aplicar mudanças
FLUSH PRIVILEGES;

-- Selecionar o banco de dados
USE crm_sistema;

-- Verificar se foi criado
SELECT 'Banco de dados crm_sistema criado com sucesso!' as status;
