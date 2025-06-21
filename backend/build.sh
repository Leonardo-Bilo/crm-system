#!/bin/bash
# Script de build para Render

echo "Instalando dependências Python..."
pip install -r requirements.txt

echo "Instalando dependências Node.js..."
cd ../frontend
npm install --legacy-peer-deps

echo "Gerando build do frontend..."
npm run build

echo "Copiando build para pasta estática do backend..."
cd ../backend
cp -r ../frontend/dist/* src/static/

echo "Build concluído!" 