/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required: [title, description, company, requirements, responsibilities, category, jobType, location, deadline]
 *       properties:
 *         id: { type: string }
 *         title: { type: string }
 *         description: { type: string }
 *         company: { type: string }
 *         category: { type: string, enum: [Technology, Healthcare, Finance, Education, Marketing, Sales, Engineering, Other] }
 *         jobType: { type: string, enum: [Full-time, Part-time, Contract, Internship, Remote] }
 *         location: { type: string }
 *         salary: { type: string }
 *         experience: { type: string }
 *         education: { type: string }
 *         deadline: { type: string, format: date }
 *         employerId: { type: string }
 *         views: { type: number }
 *         applicationCount: { type: number }
 *         isActive: { type: boolean }
 */

/**
 * @swagger
 * /api/jobs/all:
 *   get:
 *     summary: Get all active jobs
 *     tags: [Jobs]
 *     responses:
 *       200: { description: List of active jobs }
 */

/**
 * @swagger
 * /api/jobs/search:
 *   get:
 *     summary: Search jobs with filters
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: location
 *         schema: { type: string }
 *       - in: query
 *         name: jobType
 *         schema: { type: string }
 *     responses:
 *       200: { description: Search results }
 */

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job posting (Employer only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201: { description: Job created }
 *       400: { description: Missing required fields }
 */

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Job details }
 *       404: { description: Job not found }
 *   put:
 *     summary: Update a job (owner only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Job updated }
 *       403: { description: Forbidden }
 *   delete:
 *     summary: Delete a job (owner or admin)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Job deleted }
 *       403: { description: Forbidden }
 */

/**
 * @swagger
 * /api/jobs/employer/{employerId}:
 *   get:
 *     summary: Get jobs by employer ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: employerId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of employer jobs }
 */
export {};
