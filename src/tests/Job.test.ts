import request from "supertest";
import app from "../app";

describe("Jobs — /api/jobs", () => {

  // ── Public reads ───────────────────────────────────────────────────────────
  describe("GET /all", () => {
    it("returns 200 with active seeded jobs", async () => {
      const res = await request(app).get("/api/jobs/all");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      // only active jobs returned
      res.body.data.forEach((j: any) => expect(j.isActive).toBe(true));
    });

    it("returns at least 4 active seeded jobs", async () => {
      const res = await request(app).get("/api/jobs/all");
      expect(res.body.data.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("GET /search", () => {
    it("returns 200 for keyword search matching seeded job", async () => {
      const res = await request(app).get("/api/jobs/search?keyword=Frontend");
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].title).toMatch(/Frontend/i);
    });

    it("returns 200 with empty array for no match", async () => {
      const res = await request(app).get("/api/jobs/search?keyword=xyznonexistent");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });

    it("returns 200 filtering by category", async () => {
      const res = await request(app).get("/api/jobs/search?category=Technology");
      expect(res.status).toBe(200);
      res.body.data.forEach((j: any) => expect(j.category).toBe("Technology"));
    });
  });

  describe("GET /employer/:employerId", () => {
    it("returns 200 with jobs for seeded employer", async () => {
      const res = await request(app).get(`/api/jobs/employer/${global.seededEmployers[0]._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);
    });

    it("returns 400 for invalid employer id format", async () => {
      const res = await request(app).get("/api/jobs/employer/not-an-id");
      expect(res.status).toBe(400);
    });
  });

  describe("GET /:id", () => {
    it("returns 200 for seeded job", async () => {
      const res = await request(app).get(`/api/jobs/${global.seededJobs[0]._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Frontend Developer");
    });

    it("returns 404 for unknown job id", async () => {
      const res = await request(app).get("/api/jobs/000000000000000000000099");
      expect(res.status).toBe(404);
    });
  });

  // ── Protected writes ───────────────────────────────────────────────────────
  describe("POST /", () => {
    it("returns 401 without token", async () => {
      const res = await request(app).post("/api/jobs").send({});
      expect(res.status).toBe(401);
    });

    it("returns 403 when a candidate tries to create a job", async () => {
      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${global.userToken}`)
        .send({ title: "Test Job" });
      expect(res.status).toBe(403);
    });

    it("returns 400 when employer sends incomplete job data", async () => {
      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${global.employerToken}`)
        .send({ title: "Incomplete" });
      expect(res.status).toBe(400);
    });

    it("returns 201 when employer creates a valid job", async () => {
      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${global.employerToken}`)
        .send({
          title: "DevOps Engineer",    description: "Manage infra",
          company: "TechCorp",         requirements: ["Docker"],
          responsibilities: ["Deploy"], category: "Technology",
          jobType: "Full-time",         location: "Remote",
          deadline: new Date(Date.now() + 30 * 86400000),
        });
      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe("DevOps Engineer");
    });
  });

  describe("DELETE /:id", () => {
    it("returns 401 without token", async () => {
      const res = await request(app).delete(`/api/jobs/${global.seededJobs[0]._id}`);
      expect(res.status).toBe(401);
    });

    it("returns 403 when candidate tries to delete a job", async () => {
      const res = await request(app)
        .delete(`/api/jobs/${global.seededJobs[0]._id}`)
        .set("Authorization", `Bearer ${global.userToken}`);
      expect(res.status).toBe(403);
    });
  });
});
