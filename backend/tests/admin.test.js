const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret";
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Admin API", () => {
  let adminToken;
  let userToken;
  let userId;

  beforeEach(async () => {
    // Clear DB
    await User.deleteMany({});

    // Create Admin
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });
    adminToken = jwt.sign({ userId: adminUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Create Regular User
    const regularUser = await User.create({
      name: "Regular User",
      email: "user@example.com",
      password: "password123",
      role: "user",
    });
    userId = regularUser._id;
    userToken = jwt.sign({ userId: regularUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  });

  describe("GET /api/admin/stats", () => {
    it("should allow admin to access stats", async () => {
      const res = await request(app)
        .get("/api/admin/stats")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("kpis");
      expect(res.body.kpis.totalUsers).toBe(2);
    });

    it("should block non-admin", async () => {
      const res = await request(app)
        .get("/api/admin/stats")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe("GET /api/admin/users", () => {
    it("should list users", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.users).toHaveLength(2);
    });
  });

  describe("PUT /api/admin/users/:id/status", () => {
    it("should ban a user", async () => {
      const res = await request(app)
        .put(`/api/admin/users/${userId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "banned", banReason: "Violation" });

      expect(res.statusCode).toBe(200);

      const updatedUser = await User.findById(userId).select("+banReason");
      expect(updatedUser.status).toBe("banned");
      expect(updatedUser.banReason).toBe("Violation");
    });
  });
});
