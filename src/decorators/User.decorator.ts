/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required: [name, email, contactPhone, password, role]
 *       properties:
 *         id: { type: string }
 *         name: { type: string }
 *         email: { type: string }
 *         contactPhone: { type: string }
 *         role: { type: string, enum: [CANDIDATE, ADMIN, GUEST] }
 *         avatar: { type: string }
 *         isActive: { type: boolean }
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, contactPhone, password, role]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               contactPhone: { type: string }
 *               password: { type: string, minLength: 6 }
 *               role: { type: string, enum: [CANDIDATE, ADMIN] }
 *     responses:
 *       201: { description: User created successfully }
 *       400: { description: Validation error or email exists }
 *       500: { description: Server error }
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials or account suspended }
 *       500: { description: Server error }
 */

/**
 * @swagger
 * /api/auth/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User details }
 *       404: { description: User not found }
 *   put:
 *     summary: Update own user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User updated }
 *       403: { description: Forbidden }
 *       404: { description: User not found }
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User deleted }
 *       404: { description: User not found }
 */

/**
 * @swagger
 * /api/auth/{id}/status:
 *   patch:
 *     summary: Toggle user account status (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Status toggled }
 *       404: { description: User not found }
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200: { description: Password changed }
 *       400: { description: Incorrect current password }
 */
export {};
