import request from "supertest";
import app from "../app";

describe("User Auth — /api/auth", () => {

  // ── Register ───────────────────────────────────────────────────────────────
  describe("POST /register", () => {
    it("returns 400 when all fields are missing", async () => {
      const res = await request(app).post("/api/auth/register").send({});
      expect(res.status).toBe(400);
    });

    it("returns 400 when email is already taken (seeded user)", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Duplicate", email: "alice@test.com",
        contactPhone: "0799999999", password: "Test1234!", role: "CANDIDATE",
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("returns 400 when role is EMPLOYER", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Emp", email: "newemp@test.com",
        contactPhone: "0799999998", password: "Test1234!", role: "EMPLOYER",
      });
      expect(res.status).toBe(400);
    });

    it("returns 201 and token for valid new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "New User", email: "newuser@test.com",
        contactPhone: "0799999997", password: "Test1234!", role: "CANDIDATE",
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe("newuser@test.com");
    });
  });

  // ── Login ──────────────────────────────────────────────────────────────────
  describe("POST /login", () => {
    it("returns 401 for non-existent email", async () => {
      const res = await request(app).post("/api/auth/login").send({ email: "nobody@test.com", password: "wrong" });
      expect(res.status).toBe(401);
    });

    it("returns 401 for wrong password on seeded user", async () => {
      const res = await request(app).post("/api/auth/login").send({ email: "alice@test.com", password: "WrongPass!" });
      expect(res.status).toBe(401);
    });

    it("returns 200 and token for valid seeded candidate", async () => {
      const res = await request(app).post("/api/auth/login").send({ email: "alice@test.com", password: "Password1!" });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("token");
    });

    it("returns 200 for seeded admin login", async () => {
      const res = await request(app).post("/api/auth/login").send({ email: "admin@test.com", password: "AdminPass1!" });
      expect(res.status).toBe(200);
      expect(res.body.user.role).toBe("ADMIN");
    });
  });

  // ── Protected routes ───────────────────────────────────────────────────────
  describe("GET /:id", () => {
    it("returns 401 without token", async () => {
      const res = await request(app).get(`/api/auth/${global.seededUsers[0]._id}`);
      expect(res.status).toBe(401);
    });

    it("returns 200 with valid token and seeded user id", async () => {
      const res = await request(app)
        .get(`/api/auth/${global.seededUsers[0]._id}`)
        .set("Authorization", `Bearer ${global.userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe("alice@test.com");
    });

    it("returns 404 for unknown id", async () => {
      const res = await request(app)
        .get("/api/auth/000000000000000000000099")
        .set("Authorization", `Bearer ${global.userToken}`);
      expect(res.status).toBe(404);
    });
  });

  // ── Logout ─────────────────────────────────────────────────────────────────
  describe("POST /logout", () => {
    it("returns 401 without token", async () => {
      const res = await request(app).post("/api/auth/logout");
      expect(res.status).toBe(401);
    });

    it("returns 200 with valid token", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${global.userToken}`);
      expect(res.status).toBe(200);
    });
  });
});
