import request from "supertest";
import app from "../app";

describe("Employers — /api/employers", () => {

  // ── Register ───────────────────────────────────────────────────────────────
  describe("POST /register", () => {
    it("returns 400 when all fields are missing", async () => {
      const res = await request(app).post("/api/employers/register").send({});
      expect(res.status).toBe(400);
    });

    it("returns 400 when email is already taken (seeded employer)", async () => {
      const res = await request(app).post("/api/employers/register").send({
        companyName: "Dup", email: "techcorp@test.com", password: "Test1234!", phone: "0799999999",
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("returns 201 and token for valid new employer", async () => {
      const res = await request(app).post("/api/employers/register").send({
        companyName: "NewCo", email: "newco@test.com", password: "Test1234!", phone: "0799999996",
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("token");
    });
  });

  // ── Login ──────────────────────────────────────────────────────────────────
  describe("POST /login", () => {
    it("returns 401 for non-existent email", async () => {
      const res = await request(app).post("/api/employers/login").send({ email: "nobody@test.com", password: "wrong" });
      expect(res.status).toBe(401);
    });

    it("returns 401 for wrong password on seeded employer", async () => {
      const res = await request(app).post("/api/employers/login").send({ email: "techcorp@test.com", password: "WrongPass!" });
      expect(res.status).toBe(401);
    });

    it("returns 401 for suspended seeded employer", async () => {
      const res = await request(app).post("/api/employers/login").send({ email: "suspended@test.com", password: "Employer5!" });
      expect(res.status).toBe(401);
    });

    it("returns 200 and token for valid seeded employer", async () => {
      const res = await request(app).post("/api/employers/login").send({ email: "techcorp@test.com", password: "Employer1!" });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("token");
    });
  });

  // ── Public reads ───────────────────────────────────────────────────────────
  describe("GET /all", () => {
    it("returns 200 with array of seeded employers", async () => {
      const res = await request(app).get("/api/employers/all");
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("GET /top-hiring", () => {
    it("returns 200", async () => {
      const res = await request(app).get("/api/employers/top-hiring");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /:id", () => {
    it("returns 200 for seeded employer", async () => {
      const res = await request(app).get(`/api/employers/${global.seededEmployers[0]._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.companyName).toBe("TechCorp");
    });

    it("returns 404 for unknown id", async () => {
      const res = await request(app).get("/api/employers/000000000000000000000099");
      expect(res.status).toBe(404);
    });
  });

  // ── Admin-protected ────────────────────────────────────────────────────────
  describe("PATCH /:id/verify", () => {
    it("returns 401 without token", async () => {
      const res = await request(app)
        .patch(`/api/employers/${global.seededEmployers[2]._id}/verify`)
        .send({ isVerified: true });
      expect(res.status).toBe(401);
    });

    it("returns 200 when admin verifies seeded employer", async () => {
      const res = await request(app)
        .patch(`/api/employers/${global.seededEmployers[2]._id}/verify`)
        .set("Authorization", `Bearer ${global.adminToken}`)
        .send({ isVerified: true });
      expect(res.status).toBe(200);
      expect(res.body.data.isVerified).toBe(true);
    });
  });
});
