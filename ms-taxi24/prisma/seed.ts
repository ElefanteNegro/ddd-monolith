import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create or update passenger user
  const passengerUser = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      user: 'johndoe',
      password: await hash('password123', 10),
      phone: '1234567890',
      role: 'PASSENGER'
    }
  });

  // Create or update passenger
  const passenger = await prisma.passenger.upsert({
    where: { userId: passengerUser.id },
    update: {},
    create: { userId: passengerUser.id }
  });

  // Create or update driver user
  const driverUser = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      name: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      user: 'janesmith',
      password: await hash('password123', 10),
      phone: '0987654321',
      role: 'DRIVER'
    }
  });

  // Create or update driver
  const driver = await prisma.driver.upsert({
    where: { userId: driverUser.id },
    update: {},
    create: { active: true, userId: driverUser.id }
  });

  // Create or update car for driver
  await prisma.car.upsert({
    where: { plate: 'ABC123' },
    update: {},
    create: {
      plate: 'ABC123',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      color: 'Red',
      driverId: driver.id
    }
  });

  // Create or update another driver user
  const driverUser2 = await prisma.user.upsert({
    where: { email: 'mike.johnson@example.com' },
    update: {},
    create: {
      name: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      user: 'mikejohnson',
      password: await hash('password123', 10),
      phone: '5555555555',
      role: 'DRIVER'
    }
  });

  const driver2 = await prisma.driver.upsert({
    where: { userId: driverUser2.id },
    update: {},
    create: { active: true, userId: driverUser2.id }
  });

  await prisma.car.upsert({
    where: { plate: 'XYZ789' },
    update: {},
    create: {
      plate: 'XYZ789',
      brand: 'Honda',
      model: 'Civic',
      year: 2021,
      color: 'Blue',
      driverId: driver2.id
    }
  });

  // Create a trip (no upsert, just create for demo)
  const trip = await prisma.trip.create({
    data: {
      origin: 'Av. Reforma 123',
      destination: 'Av. Insurgentes 456',
      status: 'COMPLETED',
      fare: 150.50,
      driverId: driver.id,
      passengerId: passenger.id,
      completedAt: new Date()
    }
  });

  // Create invoice for the trip
  await prisma.invoice.create({
    data: {
      tripId: trip.id,
      amount: 150.50,
      issuedAt: new Date()
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
