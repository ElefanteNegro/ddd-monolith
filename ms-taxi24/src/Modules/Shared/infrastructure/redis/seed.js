const Redis = require('ioredis');
const { PrismaClient } = require('@prisma/client');

async function seedRedis() {
  try {
    const prisma = new PrismaClient();
    const redis = new Redis({
      host: 'redis',
      port: 6379,
    });

    // Obtener drivers de la base de datos
    const drivers = await prisma.driver.findMany({
      where: {
        active: true
      },
      include: {
        user: true
      }
    });

    if (drivers.length === 0) {
      console.log('⚠️ No se encontraron drivers activos en la base de datos');
      await prisma.$disconnect();
      await redis.quit();
      return;
    }

    // Crear ubicaciones de ejemplo para cada driver
    const driverLocations = drivers.map(driver => ({
      id: driver.id,
      driverId: driver.id,
      latitude: 40.416775,
      longitude: -3.703790,
      updatedAt: new Date().toISOString(),
      isActive: true,
      isFree: true,
      driver: {
        id: driver.id,
        userId: driver.userId,
        licenseNumber: driver.licenseNumber,
        active: driver.active,
        user: {
          id: driver.user.id,
          name: driver.user.name,
          email: driver.user.email,
          phone: driver.user.phone,
          active: driver.user.active
        }
      }
    }));

    // Limpiar datos existentes
    await redis.del('drivers');

    // Insertar datos de ejemplo
    for (const location of driverLocations) {
      // Guardar datos completos del conductor
      await redis.set(`driver:${location.driverId}:location`, JSON.stringify(location));
      // Añadir coordenadas al conjunto GEO para búsquedas por proximidad
      await redis.geoadd('drivers', location.longitude, location.latitude, location.driverId);
    }

    console.log(`✅ Seed de Redis completado exitosamente. Se insertaron ${driverLocations.length} ubicaciones de drivers.`);
    
    await prisma.$disconnect();
    await redis.quit();
  } catch (error) {
    console.error('❌ Error al ejecutar el seed de Redis:', error);
    process.exit(1);
  }
}

seedRedis(); 