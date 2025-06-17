# Taxi24 - Sistema de Gestión de Conductores

Sistema de gestión de conductores y ubicaciones en tiempo real para una aplicación de taxis.

## Características

- Gestión de conductores y usuarios
- Seguimiento de ubicación en tiempo real
- Búsqueda de conductores cercanos
- Gestión de estado y disponibilidad de conductores
- Eventos en tiempo real usando Kafka
- Almacenamiento de ubicaciones en Redis
- Persistencia de datos en PostgreSQL

## Requisitos

- Docker y Docker Compose
- Node.js 18 o superior
- PostgreSQL 15
- Redis 7
- Kafka

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/ddd-monolith.git
cd ddd-monolith
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. Iniciar los servicios:
```bash
docker-compose up -d
```

4. Ejecutar migraciones y seed:
```bash
./init.sh
```

## Estructura del Proyecto

```
ms-taxi24/
├── src/
│   ├── Modules/           # Módulos de la aplicación
│   │   ├── Drivers/       # Gestión de conductores
│   │   ├── DriverLocation/# Ubicaciones en tiempo real
│   │   └── Shared/        # Componentes compartidos
│   ├── Routes/            # Definición de rutas
│   └── index.ts           # Punto de entrada
├── prisma/                # Esquema y migraciones
└── docker/                # Configuración de Docker
```

## API Documentation

La documentación de la API está disponible en:
```
http://localhost:3000/api-docs
```

## Desarrollo

1. Instalar dependencias:
```bash
cd ms-taxi24
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm run dev
```

## Testing

```bash
npm test
```

## Licencia

MIT

## 🚀 Stack Tecnológico

- Node.js + TypeScript
- Express
- PostgreSQL
- Redis
- Kafka
- Docker + Docker Compose

## 📋 Prerrequisitos

- Docker y Docker Compose
- Node.js 18+
- npm 9+

## 🚀 Pasos para Levantar el Proyecto

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd challenge
```

### 2. Configurar Variables de Entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar las variables según sea necesario
nano .env
```

El archivo `.env` debe contener las siguientes variables:
```env
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/taxi24?schema=public"

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Kafka Configuration
KAFKA_BROKERS=kafka:29092
KAFKA_CLIENT_ID=taxi24-service
KAFKA_GROUP_ID=taxi24-group

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
```

### 3. Dar Permisos de Ejecución
```bash
sudo chmod +x init.sh
```

### 4. Construir el Proyecto
```bash
docker-compose up
```
Este comando:
- Construye las imágenes de Docker
- Instala las dependencias
- Prepara el entorno

### 5. Inicializar el Proyecto
```bash
./init.sh
```
Este comando:
- Ejecuta las migraciones de la base de datos
- Crea la cola de Kafka
- Inicia todos los servicios

### 6. Verificar que Todo Funcione
1. Verificar que los contenedores estén corriendo:
```bash
docker compose ps
```

2. Verificar los logs del servicio principal:
```bash
docker compose logs -f ms-taxi24
```

3. Acceder a la API:
- URL: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`

## 🐳 Gestión de Docker y Base de Datos

### Contenedores Docker
El proyecto utiliza los siguientes contenedores:
- `ms-taxi24`: El microservicio principal
- `postgres`: Base de datos PostgreSQL
- `redis`: Sistema de geolocalización en tiempo real
- `kafka`: Sistema de mensajería
- `kafka-ui`: Interfaz web para Kafka

### Comandos Docker Útiles
```bash
# Ver todos los contenedores en ejecución
docker compose ps

# Ver logs de todos los servicios
docker compose logs -f

# Reiniciar un servicio específico
docker compose restart ms-taxi24

# Detener todos los servicios
docker compose down

# Eliminar todos los contenedores y volúmenes
docker compose down -v
```

### Base de Datos PostgreSQL

#### Acceso a la Base de Datos
```bash
# Conectarse a la base de datos usando psql
docker compose exec postgres psql -U postgres -d taxi24

# Listar todas las tablas
\dt

# Ver estructura de una tabla
\d nombre_tabla
```

#### Gestión de Migraciones
```bash
# Ejecutar migraciones pendientes
docker compose exec ms-taxi24 npm run prisma:migrate

# Revertir última migración
docker compose exec ms-taxi24 npm run prisma:migrate:reset

# Ver estado de las migraciones
docker compose exec ms-taxi24 npm run prisma:migrate:status
```

#### Prisma Studio
Para gestionar la base de datos visualmente:
```bash
# Iniciar Prisma Studio
docker compose exec ms-taxi24 npm run prisma:studio
```
Acceder a: `http://localhost:5555`

### Respaldo y Restauración

#### Respaldo de la Base de Datos
```bash
# Crear backup
docker compose exec postgres pg_dump -U postgres taxi24 > backup.sql

# Restaurar desde backup
cat backup.sql | docker compose exec -T postgres psql -U postgres -d taxi24
```

### Solución de Problemas Comunes

#### Si la base de datos no inicia
```bash
# Verificar logs de PostgreSQL
docker compose logs postgres

# Reiniciar el contenedor de la base de datos
docker compose restart postgres
```

#### Si las migraciones fallan
```bash
# Resetear la base de datos
docker compose exec ms-taxi24 npm run prisma:migrate:reset

# Regenerar el cliente Prisma
docker compose exec ms-taxi24 npm run prisma:generate
```

### Redis y Geolocalización

#### Propósito
Redis se utiliza para almacenar y gestionar la ubicación en tiempo real de los conductores, permitiendo:
- Tracking en tiempo real de vehículos
- Búsqueda de conductores cercanos
- Cálculo de distancias
- Gestión de zonas de servicio

#### Comandos Redis Útiles
```bash
# Conectarse a Redis CLI
docker compose exec redis redis-cli

# Ver todas las claves de geolocalización
KEYS *location*

# Ver información de un conductor específico
GET driver:location:{driverId}

# Ver conductores en un radio específico
GEORADIUS drivers:locations {longitude} {latitude} {radius} km
```

#### Estructura de Datos en Redis
```
# Ubicación de conductores
driver:location:{driverId} -> {latitude,longitude,timestamp}

# Zonas activas
zone:active:{zoneId} -> {center,radius,drivers}

# Historial de ubicaciones
driver:history:{driverId} -> [{lat,lon,timestamp},...]
```

#### Monitoreo de Geolocalización
```bash
# Ver logs de Redis
docker compose logs -f redis

# Monitorear comandos en tiempo real
docker compose exec redis redis-cli MONITOR

# Ver estadísticas de Redis
docker compose exec redis redis-cli INFO
```

#### Solución de Problemas de Geolocalización
```bash
# Limpiar datos de geolocalización
docker compose exec redis redis-cli FLUSHDB

# Verificar conexión de Redis
docker compose exec redis redis-cli PING

# Reiniciar Redis si hay problemas
docker compose restart redis
```

## 🔍 Acceso a los Servicios

### API REST (ms-taxi24)
- URL: `http://localhost:3000`
- Endpoints disponibles:
  - `GET /v1/users` - Listar usuarios
  - `POST /v1/users` - Crear usuario
  - `GET /v1/passengers` - Listar pasajeros
  - `GET /v1/drivers` - Listar conductores
  - `GET /v1/trips` - Listar viajes
  - `GET /v1/cars` - Listar autos

### Kafka UI
- URL: `http://localhost:8080`
- Funcionalidades:
  - Ver tópicos de Kafka
  - Monitorear mensajes
  - Crear nuevos tópicos
  - Ver consumidores y productores

### PostgreSQL
- Host: `localhost`
- Puerto: `5432`
- Usuario: `postgres`
- Contraseña: `postgres`
- Base de datos: `taxi24`

### Redis
- Host: `localhost`
- Puerto: `6379`
- Sin autenticación por defecto

## 🛠️ Comandos Útiles

### Docker Compose
```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f ms-taxi24

# Detener todos los servicios
docker compose down

# Reiniciar un servicio específico
docker compose restart ms-taxi24

# Ver estado de los contenedores
docker compose ps
```

### Prisma
```bash
# Generar cliente Prisma
docker compose exec ms-taxi24 npm run prisma:generate

# Ejecutar migraciones
docker compose exec ms-taxi24 npm run prisma:migrate

# Abrir Prisma Studio
docker compose exec ms-taxi24 npm run prisma:studio
```

## 📝 Ejemplos de Uso

### 1. Crear un Usuario
```bash
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userName": "johndoe",
    "password": "password123"
  }'
```

### 2. Crear un Pasajero
```bash
curl -X POST http://localhost:3000/v1/passengers \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id-from-previous-step"
  }'
```

### 3. Listar Conductores Activos
```bash
curl -X GET http://localhost:3000/v1/drivers/active
```

## 🔍 Debugging

### Logs por Servicio
```bash
# Microservicio
docker compose logs -f ms-taxi24

# Kafka
docker compose logs -f kafka

# Base de datos
docker compose logs -f postgres
```

### Monitoreo de Eventos
1. Abrir Kafka UI (`http://localhost:8080`)
2. Ir a la sección "Topics"
3. Buscar el tópico `ms-taxi24-events`
4. Ver eventos de creación de usuarios y pasajeros

## 📚 Documentación Adicional

- [Documentación de la API](http://localhost:3000/api-docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Kafka Documentation](https://kafka.apache.org/documentation/)

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## Estructura del Proyecto

```
src/
├── Modules/
│   ├── Cars/           # Gestión de vehículos
│   ├── CarLocation/    # Geolocalización en tiempo real
│   ├── Drivers/        # Gestión de conductores
│   ├── Passengers/     # Gestión de pasajeros
│   ├── Trips/          # Gestión de viajes
│   ├── Users/          # Gestión de usuarios
│   └── Shared/         # Componentes compartidos
├── Routes/             # Definición de rutas
└── server.ts           # Punto de entrada
```

## API Endpoints

La documentación completa de la API está disponible en Swagger UI:
```
http://localhost:3000/api-docs
```

### Principales Endpoints

- Users: `/v1/users`
- Drivers: `/v1/drivers`
- Passengers: `/v1/passengers`
- Cars: `/v1/cars`
- Trips: `/v1/trips`

## Desarrollo

### Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm run build`: Compila el proyecto
- `npm start`: Inicia el servidor en modo producción
- `npm test`: Ejecuta los tests
- `npm run lint`: Ejecuta el linter
- `npm run format`: Formatea el código

### Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

