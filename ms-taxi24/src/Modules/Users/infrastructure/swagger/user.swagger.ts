/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - lastName
 *         - email
 *         - userName
 *         - password
 *         - phone
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del usuario
 *           example: "98f57728-3180-4e98-ab0e-0335e8140733"
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *           example: John
 *         lastName:
 *           type: string
 *           description: Apellido del usuario
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *           example: john.doe@example.com
 *         userName:
 *           type: string
 *           description: Nombre de usuario
 *           example: johndoe
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario (mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial)
 *           example: Password123!
 *         phone:
 *           type: string
 *           description: Número de teléfono
 *           example: "1234567890"
 *         active:
 *           type: boolean
 *           description: Estado del usuario
 *           example: true
 *         role:
 *           type: string
 *           enum: [PASSENGER, DRIVER]
 *           description: Rol del usuario (PASSENGER o DRIVER)
 *           example: PASSENGER
 *       example:
 *         id: "98f57728-3180-4e98-ab0e-0335e8140733"
 *         name: John
 *         lastName: Doe
 *         email: john.doe@example.com
 *         userName: johndoe
 *         password: Password123!
 *         phone: "1234567890"
 *         active: true
 *         role: PASSENGER
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: User created successfully
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "98f57728-3180-4e98-ab0e-0335e8140733"
 *             name:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *             email:
 *               type: string
 *               example: john.doe@example.com
 *             user:
 *               type: string
 *               example: johndoe
 *             active:
 *               type: boolean
 *               example: true
 *             role:
 *               type: string
 *               enum: [PASSENGER, DRIVER]
 *               example: PASSENGER
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2025-05-29T14:19:30.714Z"
 *       example:
 *         success: true
 *         message: User created successfully
 *         data:
 *           id: "98f57728-3180-4e98-ab0e-0335e8140733"
 *           name: John
 *           lastName: Doe
 *           email: john.doe@example.com
 *           user: johndoe
 *           active: true
 *           role: PASSENGER
 *           createdAt: "2025-05-29T14:19:30.714Z"
 */

/**
 * @swagger
 * /v1/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: John
 *             lastName: Doe
 *             email: john.doe@example.com
 *             userName: johndoe
 *             password: Password123!
 *             phone: "1234567890"
 *             active: true
 *             role: PASSENGER
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               success: true
 *               message: User created successfully
 *               data:
 *                 id: "98f57728-3180-4e98-ab0e-0335e8140733"
 *                 name: John
 *                 lastName: Doe
 *                 email: john.doe@example.com
 *                 user: johndoe
 *                 active: true
 *                 role: PASSENGER
 *                 createdAt: "2025-05-29T14:19:30.714Z"
 *       400:
 *         description: Error en la validación o datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Password must contain at least one special character
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: An unexpected error occurred
 */

/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para paginación
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "98f57728-3180-4e98-ab0e-0335e8140733"
 *                       name:
 *                         type: string
 *                         example: John
 *                       lastName:
 *                         type: string
 *                         example: Doe
 *                       email:
 *                         type: string
 *                         example: john.doe@example.com
 *                       userName:
 *                         type: string
 *                         example: johndoe
 *                       active:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-29T14:19:30.714Z"
 *             example:
 *               status: "OK"
 *               users:
 *                 - id: "98f57728-3180-4e98-ab0e-0335e8140733"
 *                   name: John
 *                   lastName: Doe
 *                   email: john.doe@example.com
 *                   userName: johndoe
 *                   active: true
 *                   createdAt: "2025-05-29T14:19:30.714Z"
 *                 - id: "98f57728-3180-4e98-ab0e-0335e8140734"
 *                   name: Jane
 *                   lastName: Smith
 *                   email: jane.smith@example.com
 *                   userName: janesmith
 *                   active: true
 *                   createdAt: "2025-05-29T14:20:30.714Z"
 *       400:
 *         description: Error en la petición
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /v1/users/{userId}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /v1/users/{userId}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *         example: "98f57728-3180-4e98-ab0e-0335e8140733"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               password:
 *                 type: string
 *                 example: NewPassword123!
 *               active:
 *                 type: boolean
 *                 example: true
 *           example:
 *             name: John
 *             lastName: Doe
 *             password: NewPassword123!
 *             active: true
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               success: true
 *               message: User updated successfully
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User not found
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Error updating user
 */

/**
 * @swagger
 * /v1/users/{userId}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /v1/users/authenticate:
 *   post:
 *     summary: Autenticar un usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *           example:
 *             email: john.doe@example.com
 *             password: Password123!
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               success: true
 *               message: Authentication successful
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid password
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Authentication failed
 */ 