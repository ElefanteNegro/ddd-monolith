# Taxi24 - Sistema de Gestión de Conductores

Sistema de gestión de conductores y ubicaciones en tiempo real para una aplicación de taxis, implementado siguiendo los principios de Domain-Driven Design (DDD).

## 🚀 Características

- Gestión de conductores y usuarios
- Seguimiento de ubicación en tiempo real
- Búsqueda de conductores cercanos
- Gestión de estado y disponibilidad de conductores
- Eventos en tiempo real usando Kafka
- Almacenamiento de ubicaciones en Redis
- Persistencia de datos en PostgreSQL

## 🛠️ Stack Tecnológico

- Node.js + TypeScript
- Express
- PostgreSQL
- Redis
- Kafka
- Docker + Docker Compose
- Prisma ORM

## 📋 Prerrequisitos

- Docker y Docker Compose
- Node.js 18+
- npm 9+

## 🚀 Instalación y Configuración

1. Clonar el repositorio:
```bash
git clone https://github.com/ElefanteNegro/ddd-monolith.git
cd ddd-monolith
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. Dar permisos de ejecución:
```bash
chmod +x init.sh
```

4. Iniciar los servicios:
```bash
docker compose up -d
```

> **Nota:** Si ves una advertencia sobre el atributo `version` en el archivo `docker-compose.yml`, puedes ignorarla o eliminar la línea `version: '3.8'`.

5. Verificar que los servicios estén saludables:
```bash
docker compose ps
```
Todos los servicios deben aparecer como `healthy` o `running`. Si algún servicio aparece como `unhealthy`, revisa los logs:
```bash
docker compose logs <nombre-del-servicio>
```

6. Ejecutar migraciones y seed manualmente:
```bash
# Ejecutar migraciones
docker compose exec ms-taxi24 npx prisma migrate deploy

# Generar cliente Prisma
docker compose exec ms-taxi24 npx prisma generate

# Ejecutar seed (opcional)
docker compose exec ms-taxi24 npx ts-node prisma/seed.ts
```

7. Inicializar el proyecto (opcional, si se requiere):
```bash
./init.sh
```

## 📁 Estructura del Proyecto

```
ms-taxi24/
├── src/
│   ├── Modules/           # Módulos de la aplicación
│   │   ├── Cars/         # Gestión de vehículos
│   │   ├── Drivers/      # Gestión de conductores
│   │   ├── DriverLocation/# Ubicaciones en tiempo real
│   │   ├── Passengers/   # Gestión de pasajeros
│   │   ├── Trips/        # Gestión de viajes
│   │   ├── Users/        # Gestión de usuarios
│   │   └── Shared/       # Componentes compartidos
│   ├── Routes/           # Definición de rutas
│   └── index.ts          # Punto de entrada
├── prisma/               # Esquema y migraciones
└── docker/              # Configuración de Docker
```

## 🔍 Acceso a los Servicios

### API REST
- URL: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`

### Servicios Adicionales
- Kafka UI: `http://localhost:8080`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## 🛠️ Comandos Útiles

### Docker
```bash
# Ver logs de todos los servicios
docker compose logs -f

# Reiniciar un servicio específico
docker compose restart ms-taxi24

# Detener todos los servicios
docker compose down
```

### Prisma
```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio
```

### Desarrollo
```bash
# Construir y levantar los servicios
docker compose up -d --build

# Ver logs del servicio
docker compose logs -f ms-taxi24

# Ejecutar tests
docker compose exec ms-taxi24 npm test
```

## 📚 Documentación

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

