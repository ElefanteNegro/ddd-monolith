#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Iniciando proceso de seed..."

# Verificar que el contenedor está corriendo
echo "📦 Verificando contenedor..."
if ! docker ps | grep -q ms-taxi24; then
    echo -e "${RED}❌ El contenedor ms-taxi24 no está corriendo${NC}"
    exit 1
fi

# Ejecutar seed de Prisma
echo "🌱 Ejecutando seed de Prisma..."
docker exec ms-taxi24 npx prisma db seed

# Verificar si el seed de Prisma fue exitoso
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Seed de Prisma completado exitosamente${NC}"
else
    echo -e "${RED}❌ Error al ejecutar el seed de Prisma${NC}"
    exit 1
fi

# Ejecutar seed de Redis
echo "🌱 Ejecutando seed de Redis..."
docker exec ms-taxi24 node src/Modules/Shared/infrastructure/redis/seed.js

# Verificar si el seed de Redis fue exitoso
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Seed de Redis completado exitosamente${NC}"
else
    echo -e "${RED}❌ Error al ejecutar el seed de Redis${NC}"
    exit 1
fi

echo -e "${GREEN}✨ Proceso de seed completado exitosamente${NC}"
