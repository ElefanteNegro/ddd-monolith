/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "98f57728-3180-4e98-ab0e-0335e8140733"
 *         name:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         active:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-03-20T12:00:00Z"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "98f57728-3180-4e98-ab0e-0335e8140733"
 *             name:
 *               type: string
 *               example: "John"
 *             lastName:
 *               type: string
 *               example: "Doe"
 *             email:
 *               type: string
 *               example: "john.doe@example.com"
 *             phone:
 *               type: string
 *               example: "+1234567890"
 *             active:
 *               type: boolean
 *               example: true
 *         car:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "98f57728-3180-4e98-ab0e-0335e8140733"
 *             plate:
 *               type: string
 *               example: "ABC123"
 *             brand:
 *               type: string
 *               example: "Toyota"
 *             model:
 *               type: string
 *               example: "Corolla"
 *             year:
 *               type: number
 *               example: 2020
 *             color:
 *               type: string
 *               example: "Red"
 *             position:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                   example: 40.7128
 *                 longitude:
 *                   type: number
 *                   example: -74.0060
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 isFree:
 *                   type: boolean
 *                   example: true
 *     DriverUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         active:
 *           type: boolean
 *           example: true
 *     DriverResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Driver'
 *     DriversResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Driver'
 *     CarAssignment:
 *       type: object
 *       properties:
 *         carId:
 *           type: string
 *           example: "98f57728-3180-4e98-ab0e-0335e8140733"
 */

/**
 * @swagger
 * /v1/drivers:
 *   get:
 *     tags:
 *       - Drivers
 *     summary: Get all drivers
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of drivers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DriversResponse'
 *   post:
 *     tags:
 *       - Drivers
 *     summary: Create a new driver
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Driver'
 *     responses:
 *       201:
 *         description: Driver created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DriverResponse'
 * 
 * /v1/drivers/active:
 *   get:
 *     tags:
 *       - Drivers
 *     summary: Get all active drivers with available cars
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of active drivers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DriversResponse'
 * 
 * /v1/drivers/{id}:
 *   get:
 *     tags:
 *       - Drivers
 *     summary: Get a driver by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: Driver details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DriverResponse'
 *   put:
 *     tags:
 *       - Drivers
 *     summary: Update a driver
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DriverUpdate'
 *     responses:
 *       200:
 *         description: Driver updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DriverResponse'
 *   delete:
 *     tags:
 *       - Drivers
 *     summary: Delete a driver
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: Driver deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 * 
 * /v1/drivers/{id}/car:
 *   post:
 *     tags:
 *       - Drivers
 *     summary: Assign a car to a driver
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarAssignment'
 *     responses:
 *       200:
 *         description: Car assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DriverResponse'
 */ 