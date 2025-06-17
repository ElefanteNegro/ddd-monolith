import { Router } from 'express';
import { DriverController } from '../controllers/DriverController';
import { container } from '@Shared/infrastructure/container';
import { asyncHandler } from '@Shared/infrastructure/middleware/asyncHandler';

const router = Router();
const driverController = container.driverController;

/**
 * @swagger
 * /api/drivers:
 *   post:
 *     summary: Create a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - email
 *               - active
 *               - userId
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               email:
 *                 type: string
 *                 format: email
 *               active:
 *                 type: boolean
 *               userId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Driver created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post('/', asyncHandler((req, res) => driverController.createDriver(req, res)));

/**
 * @swagger
 * /api/drivers/{id}:
 *   get:
 *     summary: Get a driver by ID
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Driver found
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Server error
 */
router.get('/:driverId', asyncHandler((req, res) => driverController.getDriverById(req, res)));

/**
 * @swagger
 * /api/drivers/{id}:
 *   put:
 *     summary: Update a driver
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Driver updated successfully
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Server error
 */
router.put('/:driverId', asyncHandler((req, res) => driverController.updateDriver(req, res)));

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: Get all drivers
 *     tags: [Drivers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of drivers
 *       500:
 *         description: Server error
 */
router.get('/', asyncHandler((req, res) => driverController.getAllDrivers(req, res)));

/**
 * @swagger
 * /api/drivers/active:
 *   get:
 *     summary: Get all active drivers
 *     tags: [Drivers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of active drivers
 *       500:
 *         description: Server error
 */
router.get('/active', asyncHandler((req, res) => driverController.getAllDriversActive(req, res)));

/**
 * @swagger
 * /api/drivers/{id}/car:
 *   post:
 *     summary: Assign a car to a driver
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - carId
 *             properties:
 *               carId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Car assigned successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Driver or car not found
 *       500:
 *         description: Server error
 */
router.post('/:driverId/car', asyncHandler((req, res) => driverController.assignCar(req, res)));

/**
 * @swagger
 * /api/drivers/{id}:
 *   delete:
 *     summary: Delete a driver
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Driver deleted successfully
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Server error
 */
router.delete('/:driverId', asyncHandler((req, res) => driverController.deleteDriver(req, res)));

export default router;
