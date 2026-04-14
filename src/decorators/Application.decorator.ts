/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       required: [jobId, resume, name, email]
 *       properties:
 *         id: { type: string }
 *         jobId: { type: string }
 *         userId: { type: string }
 *         employerId: { type: string }
 *         name: { type: string }
 *         email: { type: string }
 *         resume: { type: string }
 *         coverLetter: { type: string }
 *         status: { type: string, enum: [PENDING, REVIEWED, SHORTLISTED, REJECTED, HIRED], default: PENDING }
 *         notes: { type: string }
 *         submissionDate: { type: string, format: date }
 */

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all applications (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of all applications }
 */

/**
 * @swagger
 * /api/applications/{jobId}:
 *   post:
 *     summary: Submit a job application (Candidate only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, email, resume]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               coverLetter: { type: string }
 *               resume: { type: string, format: binary }
 *     responses:
 *       201: { description: Application submitted }
 *       400: { description: Already applied or missing fields }
 *       404: { description: Job not found }
 */

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get application by ID (owner, employer, or admin)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Application details }
 *       403: { description: Forbidden }
 *   delete:
 *     summary: Delete an application (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Application deleted }
 */

/**
 * @swagger
 * /api/applications/{id}/status:
 *   put:
 *     summary: Update application status (Employer or Admin)
 *     tags: [Applications]
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
 *               status: { type: string, enum: [PENDING, REVIEWED, SHORTLISTED, REJECTED, HIRED] }
 *               notes: { type: string }
 *     responses:
 *       200: { description: Status updated }
 *       403: { description: Forbidden }
 */

/**
 * @swagger
 * /api/applications/job/{jobId}:
 *   get:
 *     summary: Get applications for a job (Employer or Admin)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Applications list }
 *       403: { description: Forbidden }
 */

/**
 * @swagger
 * /api/applications/user/{userId}:
 *   get:
 *     summary: Get applications by user (own only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User applications }
 *       403: { description: Forbidden }
 */

/**
 * @swagger
 * /api/applications/employer/{employerId}:
 *   get:
 *     summary: Get applications by employer (own only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employerId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Employer applications }
 *       403: { description: Forbidden }
 */
export {};
