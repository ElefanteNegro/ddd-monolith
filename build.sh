#!/bin/bash

echo "🚀 Starting build process..."

# Verificar que el directorio ms-taxi24 existe
if [ ! -d "./ms-taxi24" ]; then
  echo "❌ Error: Directory ms-taxi24 not found"
  exit 1
fi

# Entrar al directorio ms-taxi24
cd ./ms-taxi24 || exit 1

# Verificar que package.json existe
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found in ms-taxi24"
  exit 1
fi

# Generar cliente Prisma si no existe
if [ ! -d "node_modules/.prisma/client" ]; then
  echo "⚠ Prisma client not found. Running prisma generate..."
  npx prisma generate
  if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
  fi
  echo "✅ Prisma client generated successfully"
else
  echo "✅ Prisma client already exists"
fi

# Volver al directorio raíz
cd ..

# Construir y levantar contenedores
echo "🐳 Building and starting containers..."
docker compose up --build

# Verificar si docker compose falló
if [ $? -ne 0 ]; then
  echo "❌ Failed to start containers"
  exit 1
fi
