#!/bin/bash

set -e

echo "🟡 Esperando a que los servicios estén listos..."

# Función para esperar a que un servicio esté listo
wait_for_service() {
  local service=$1
  local max_attempts=30
  local attempt=1

  echo "⏳ Esperando a que $service esté listo..."
  while [ $attempt -le $max_attempts ]; do
    if docker compose ps $service | grep -q "Up"; then
      echo "✅ $service está listo"
      return 0
    fi
    echo "⏳ Intento $attempt de $max_attempts..."
    sleep 2
    attempt=$((attempt + 1))
  done
  echo "❌ $service no está disponible después de $max_attempts intentos"
  return 1
}

# Esperar a que los servicios críticos estén listos
wait_for_service postgres
wait_for_service redis
wait_for_service kafka
wait_for_service ms-taxi24

echo "🔄 Ejecutando migraciones..."
if ! docker compose exec ms-taxi24 npx prisma migrate deploy; then
  echo "❌ Error al ejecutar migraciones"
  exit 1
fi
echo "✅ Migraciones ejecutadas correctamente"

echo "🔁 Generando cliente Prisma..."
if ! docker compose exec ms-taxi24 npx prisma generate; then
  echo "❌ Error al generar cliente Prisma"
  exit 1
fi
echo "✅ Cliente Prisma generado correctamente"

echo "🌱 Ejecutando seed..."
if ! docker compose exec ms-taxi24 npx ts-node prisma/seed.ts; then
  echo "⚠️ Advertencia: El seed falló, puede que los datos ya existan"
fi

echo "✅ Inicialización completada"
echo "🚀 El sistema está listo para usar"