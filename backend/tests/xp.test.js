const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  process.env.JWT_SECRET = "testsecret-longkey-for-jwt-1234";
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const user = await User.create({
    name: "XP Test User",
    email: "xptest@example.com",
    password: "password123",
  });
  userId = user._id;
  token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("XP & Gamification Endpoints", () => {
  it("should return initial XP summary for a new user", async () => {
    const res = await request(app)
      .get("/api/xp/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalXP).toBe(0);
    expect(res.body.level).toBe(1);
    expect(res.body.currentStreak).toBe(0);
    expect(res.body.totalBadgesCount).toBe(12);
  });

  it("should return the badge shelf with 12 badges", async () => {
    const res = await request(app)
      .get("/api/xp/badges")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(12);
    expect(res.body[0].unlocked).toBe(false);
  });

  it("should award XP and first_focus badge when a session is completed", async () => {
    const res = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "focus",
        startTime: new Date(),
        duration: 1500,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.xpEarned).toBe(10);
    expect(res.body.totalXP).toBe(10);
    expect(res.body.newlyEarnedBadges.length).toBeGreaterThanOrEqual(1);
    const hasFirstFocus = res.body.newlyEarnedBadges.some((b) => b.id === "first_focus");
    expect(hasFirstFocus).toBe(true);
  });

  it("should activate streak shield successfully", async () => {
    const res = await request(app)
      .post("/api/xp/streak-shield")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.streakShield.active).toBe(true);
    expect(res.body.streakShield.expiresAt).toBeDefined();
  });
});
