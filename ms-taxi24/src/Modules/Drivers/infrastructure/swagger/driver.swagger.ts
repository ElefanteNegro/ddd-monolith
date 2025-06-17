/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - active
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         active:
 *           type: boolean
 *         userId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         licenseNumber:
 *           type: string
 *         carId:
 *           type: string
 *           format: uuid
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
 * tags:
 *   name: Drivers
 *   description: Driver management endpoints
 */

/**
 * @swagger
 * /v1/drivers:
 *   post:
 *     summary: Create a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Driver'
 *     responses:
 *       200:
 *         description: Driver created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /v1/drivers/{id}:
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /v1/drivers/{id}:
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

/**
 * @swagger
 * /v1/drivers:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Driver'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /v1/drivers/active:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Driver'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /v1/drivers/{id}/car:
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

/**
 * @swagger
 * /v1/drivers/{id}:
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