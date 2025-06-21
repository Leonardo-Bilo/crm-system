# CRM System - Aplicativo Desktop

Este é um sistema CRM que pode ser executado como aplicativo desktop usando Tauri.

## Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm
- Rust (para compilar o Tauri)

## Instalação do Rust

Se você ainda não tem o Rust instalado, execute:

```bash
# Windows
winget install Rust.Rust
# ou
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Instalação das dependências

```bash
pnpm install
```

## Desenvolvimento

Para executar o aplicativo em modo de desenvolvimento:

```bash
pnpm tauri:dev
```

Este comando irá:
1. Iniciar o servidor de desenvolvimento do Vite
2. Compilar o código Rust
3. Abrir a janela do aplicativo desktop

## Build para produção

Para criar um executável do aplicativo:

```bash
pnpm tauri:build
```

O executável será gerado na pasta `src-tauri/target/release/`.

## Estrutura do projeto

- `src/` - Código React do frontend
- `src-tauri/` - Código Rust do Tauri
- `src-tauri/src/main.rs` - Ponto de entrada do aplicativo desktop
- `src-tauri/tauri.conf.json` - Configuração do Tauri

## Configuração do backend

Certifique-se de que o backend Flask está rodando na porta 5000:

```bash
cd ../crm-backend/crm-backend
python -m flask run
```

## Comandos úteis

- `pnpm dev` - Apenas o servidor de desenvolvimento
- `pnpm build` - Build do frontend
- `pnpm tauri:dev` - Aplicativo desktop em desenvolvimento
- `pnpm tauri:build` - Build do aplicativo desktop 