#!/bin/sh
set -e

# Función para esperar a que un servicio esté disponible
wait_for_service() {
    local host="$1"
    local port="$2"
    local service="$3"
    
    echo "Waiting for $service to be available at $host:$port..."
    while ! nc -z "$host" "$port"; do
        sleep 1
    done
    echo "$service is available"
}

# Esperar a que los servicios necesarios estén disponibles
wait_for_service "postgres" "5432" "PostgreSQL"
wait_for_service "redis" "6379" "Redis"
wait_for_service "kafka" "29092" "Kafka"

# Generar el cliente Prisma
echo "Generating Prisma client..."
npx prisma generate

# Ejecutar migraciones según el entorno
if [ "$NODE_ENV" = "production" ]; then
    echo "Running production migrations..."
    npx prisma migrate deploy
else
    echo "Running development migrations..."
    npx prisma migrate dev --name init --skip-seed
fi

# Ejecutar seed solo en desarrollo
if [ "$NODE_ENV" != "production" ]; then
    echo "Running database seed..."
    npx prisma db seed || echo "Warning: Database seed failed or was skipped"
fi

# Iniciar la aplicación según el entorno
if [ "$NODE_ENV" = "production" ]; then
    echo "Starting application in production mode..."
    exec node dist/index.js
else
    echo "Starting application in development mode..."
    exec ts-node-dev --respawn --transpile-only -r tsconfig-paths/register src/index.ts
fi
