#!/bin/sh

echo "⏳ Esperando a que la base de datos esté lista..."
while ! nc -z postgres 5432; do
  sleep 1
done

echo "✅ Base de datos lista. Ejecutando migraciones (dev)..."
npx prisma migrate dev --name init --skip-seed

echo "🌱 Ejecutando seed de la base de datos..."
npx prisma db seed || echo "⚠️ Seed falló o fue omitido"

echo "🚀 Iniciando la aplicación en modo desarrollo..."
exec npm run start:dev
