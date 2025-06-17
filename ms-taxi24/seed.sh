#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Iniciando proceso de seed..."

# Verificar conexión a PostgreSQL
echo "📦 Verificando conexión a PostgreSQL..."
if nc -z localhost 5433; then
    echo -e "${GREEN}✅ PostgreSQL está disponible${NC}"
else
    echo -e "${RED}❌ No se pudo conectar a PostgreSQL en el puerto 5433${NC}"
    exit 1
fi

# Verificar conexión a Redis
echo "📦 Verificando conexión a Redis..."
if nc -z localhost 6379; then
    echo -e "${GREEN}✅ Redis está disponible${NC}"
else
    echo -e "${RED}❌ No se pudo conectar a Redis en el puerto 6379${NC}"
    exit 1
fi

# Ejecutar seed de Prisma
echo "🌱 Ejecutando seed de Prisma..."
npx prisma db seed

# Verificar si el seed de Prisma fue exitoso
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Seed de Prisma completado exitosamente${NC}"
else
    echo -e "${RED}❌ Error al ejecutar el seed de Prisma${NC}"
    exit 1
fi

# Ejecutar seed de Redis
echo "🌱 Ejecutando seed de Redis..."
node src/Modules/Shared/infrastructure/redis/seed.ts

# Verificar si el seed de Redis fue exitoso
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Seed de Redis completado exitosamente${NC}"
else
    echo -e "${RED}❌ Error al ejecutar el seed de Redis${NC}"
    exit 1
fi

echo -e "${GREEN}✨ Proceso de seed completado exitosamente${NC}" 