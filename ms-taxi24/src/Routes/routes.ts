import { Router } from 'express';
import driverRoutes from '@Modules/Drivers/infrastructure/routes/driver.routes';
import userRoutes from '@Modules/Users/infrastructure/routes/user.routes';
import passengerRoutes from '@Modules/Passengers/infrastructure/routes/passenger.routes';
import tripRoutes from '@Modules/Trips/infrastructure/routes/trip.routes';
import carRoutes from '@Modules/Cars/infrastructure/routes/car.routes';
import driverLocationRoutes from '@Modules/DriverLocation/infrastructure/routes/driverLocation.routes';
import healthRoutes from '@Modules/Shared/infrastructure/routes/health.routes';

const router = Router();
const apiVersion = 'v1';

// Health Check Route
router.use('/', healthRoutes);

// API Routes
router.use(`/${apiVersion}/users`, userRoutes);
router.use(`/${apiVersion}/passengers`, passengerRoutes);
router.use(`/${apiVersion}/drivers`, driverRoutes);
router.use(`/${apiVersion}/trips`, tripRoutes);
router.use(`/${apiVersion}/cars`, carRoutes);
router.use(`/${apiVersion}/driver-location`, driverLocationRoutes);

export default router;
