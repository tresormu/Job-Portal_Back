/**
 * @swagger
 * components:
 *   schemas:
 *     Employer:
 *       type: object
 *       required: [companyName, email, password, phone]
 *       properties:
 *         id: { type: string }
 *         companyName: { type: string }
 *         email: { type: string }
 *         phone: { type: string }
 *         industry: { type: string }
 *         companySize: { type: string }
 *         website: { type: string }
 *         description: { type: string }
 *         location: { type: string }
 *         logo: { type: string }
 *         isVerified: { type: boolean }
 *         isActive: { type: boolean }
 */

/**
 * @swagger
 * /api/employers/register:
 *   post:
 *     summary: Register a new employer
 *     tags: [Employers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, phone, companyName]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *               companyName: { type: string }
 *     responses:
 *       201: { description: Employer registered }
 *       400: { description: Validation error or email exists }
 */

/**
 * @swagger
 * /api/employers/login:
 *   post:
 *     summary: Login employer
 *     tags: [Employers]
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
 *       401: { description: Invalid credentials or suspended }
 */

/**
 * @swagger
 * /api/employers/all:
 *   get:
 *     summary: Get all employers
 *     tags: [Employers]
 *     responses:
 *       200: { description: List of employers }
 */

/**
 * @swagger
 * /api/employers/top-hiring:
 *   get:
 *     summary: Get top hiring companies
 *     tags: [Employers]
 *     responses:
 *       200: { description: Top 10 hiring employers }
 */

/**
 * @swagger
 * /api/employers/{id}:
 *   get:
 *     summary: Get employer by ID
 *     tags: [Employers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Employer details }
 *       404: { description: Employer not found }
 *   put:
 *     summary: Update employer profile (owner or admin)
 *     tags: [Employers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Employer updated }
 *       403: { description: Forbidden }
 *   delete:
 *     summary: Delete employer (Admin only)
 *     tags: [Employers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Employer deleted }
 */

/**
 * @swagger
 * /api/employers/{id}/verify:
 *   patch:
 *     summary: Verify or unverify an employer (Admin only)
 *     tags: [Employers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isVerified: { type: boolean }
 *     responses:
 *       200: { description: Verification status updated }
 *       404: { description: Employer not found }
 */
export {};
