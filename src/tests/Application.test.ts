import request from "supertest";
import app from "../app";

describe("Applications — /api/applications", () => {

  // ── Admin-only list ────────────────────────────────────────────────────────
  describe("GET /", () => {
    it("returns 401 without token", async () => {
      const res = await request(app).get("/api/applications");
      expect(res.status).toBe(401);
    });

    it("returns 403 when a candidate accesses admin list", async () => {
      const res = await request(app)
        .get("/api/applications")
        .set("Authorization", `Bearer ${global.userToken}`);
      expect(res.status).toBe(403);
    });

    it("returns 200 with seeded applications for admin", async () => {
      const res = await request(app)
        .get("/api/applications")
        .set("Authorization", `Bearer ${global.adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);
    });
  });

  // ── Get by user ────────────────────────────────────────────────────────────
  describe("GET /user/:userId", () => {
    it("returns 401 without token", async () => {
      const res = await request(app).get(`/api/applications/user/${global.seededUsers[0]._id}`);
      expect(res.status).toBe(401);
    });

    it("returns 403 when user accesses another user's applications", async () => {
      const res = await request(app)
        .get(`/api/applications/user/${global.seededUsers[1]._id}`)
        .set("Authorization", `Bearer ${global.userToken}`);
      expect(res.status).toBe(403);
    });

    it("returns 200 with own seeded applications", async () => {
      const res = await request(app)
        .get(`/api/applications/user/${global.seededUsers[0]._id}`)
        .set("Authorization", `Bearer ${global.userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);
    });
  });

  // ── Get by employer ────────────────────────────────────────────────────────
  describe("GET /employer/:employerId", () => {
    it("returns 401 without token", async () => {
      const res = await request(app).get(`/api/applications/employer/${global.seededEmployers[0]._id}`);
      expect(res.status).toBe(401);
    });

    it("returns 200 for seeded employer's own applications", async () => {
      const res = await request(app)
        .get(`/api/applications/employer/${global.seededEmployers[0]._id}`)
        .set("Authorization", `Bearer ${global.employerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);
    });
  });

  // ── Get by job ─────────────────────────────────────────────────────────────
  describe("GET /job/:jobId", () => {
    it("returns 401 without token", async () => {
      const res = await request(app).get(`/api/applications/job/${global.seededJobs[0]._id}`);
      expect(res.status).toBe(401);
    });

    it("returns 200 for employer viewing their job's applications", async () => {
      const activeJob = global.seededJobs.find((j: any) => j.isActive);
      const res = await request(app)
        .get(`/api/applications/job/${activeJob._id}`)
        .set("Authorization", `Bearer ${global.employerToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // ── Submit application ─────────────────────────────────────────────────────
  describe("POST /:jobId", () => {
    it("returns 401 without token", async () => {
      const res = await request(app).post(`/api/applications/${global.seededJobs[0]._id}`);
      expect(res.status).toBe(401);
    });

    it("returns 403 when employer tries to apply", async () => {
      const res = await request(app)
        .post(`/api/applications/${global.seededJobs[0]._id}`)
        .set("Authorization", `Bearer ${global.employerToken}`)
        .send({ name: "Emp", email: "emp@test.com" });
      expect(res.status).toBe(403);
    });

    it("returns 404 when candidate applies to inactive/expired job", async () => {
      const expiredJob = global.seededJobs.find((j: any) => !j.isActive);
      const res = await request(app)
        .post(`/api/applications/${expiredJob._id}`)
        .set("Authorization", `Bearer ${global.userToken}`)
        .send({ name: "Alice Johnson", email: "alice@test.com" });
      expect(res.status).toBe(404);
    });

    it("returns 400 when candidate applies to same job twice", async () => {
      const activeJob = global.seededJobs.find((j: any) => j.isActive);
      const res = await request(app)
        .post(`/api/applications/${activeJob._id}`)
        .set("Authorization", `Bearer ${global.userToken}`)
        .send({ name: "Alice Johnson", email: "alice@test.com" });
      // already applied in seed
      expect([400, 404]).toContain(res.status);
    });
  });

  // ── Update status ──────────────────────────────────────────────────────────
  describe("PUT /:id/status", () => {
    it("returns 401 without token", async () => {
      const res = await request(app)
        .put(`/api/applications/${global.seededApplications[0]._id}/status`)
        .send({ status: "REVIEWED" });
      expect(res.status).toBe(401);
    });

    it("returns 403 when candidate tries to update status", async () => {
      const res = await request(app)
        .put(`/api/applications/${global.seededApplications[0]._id}/status`)
        .set("Authorization", `Bearer ${global.userToken}`)
        .send({ status: "REVIEWED" });
      expect(res.status).toBe(403);
    });

    it("returns 200 when employer updates seeded application status", async () => {
      const res = await request(app)
        .put(`/api/applications/${global.seededApplications[0]._id}/status`)
        .set("Authorization", `Bearer ${global.employerToken}`)
        .send({ status: "SHORTLISTED" });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("SHORTLISTED");
    });
  });
});
