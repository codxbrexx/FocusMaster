const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const User = require("../src/models/User");
const AiInsight = require("../src/models/AiInsight");
const StudyPlan = require("../src/models/StudyPlan");
const Document = require("../src/models/Document");
const DocumentChunk = require("../src/models/DocumentChunk");
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
    name: "AI Test User",
    email: "aitest@example.com",
    password: "password123",
    studyProfile: {
      stream: "engineering",
      subjects: [{ name: "Computer Science", difficulty: "hard" }],
      weeklyGoalHours: 20,
      availableHoursPerDay: 4,
    },
  });
  userId = user._id;
  token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
});

afterEach(async () => {
  await User.deleteMany({});
  await AiInsight.deleteMany({});
  await StudyPlan.deleteMany({});
  await Document.deleteMany({});
  await DocumentChunk.deleteMany({});
});

describe("AI Subsystem Endpoints", () => {
  describe("GET /api/ai/summary", () => {
    it("should return aggregated user analytics and productivity score", async () => {
      const res = await request(app)
        .get("/api/ai/summary")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.stats).toBeDefined();
      expect(typeof res.body.productivityScore).toBe("number");
      expect(res.body.scoreBreakdown).toBeDefined();
    });
  });

  describe("GET /api/ai/insights", () => {
    it("should return structured insights with fallback defaults when LLM is offline", async () => {
      const res = await request(app)
        .get("/api/ai/insights")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.insights)).toBe(true);
      expect(res.body.insights.length).toBeGreaterThan(0);
      expect(Array.isArray(res.body.recommendations)).toBe(true);
      expect(res.body.recommendations.length).toBeGreaterThan(0);
      expect(typeof res.body.summary).toBe("string");
      expect(typeof res.body.productivityScore).toBe("number");
    });

    it("should return cached insights if unexpired cache exists", async () => {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await AiInsight.create({
        user: userId,
        insights: ["Cached Insight 1"],
        recommendations: ["Cached Recommendation 1"],
        summary: "Cached Summary",
        prepAdvice: "Cached Prep Advice",
        productivityScore: 85,
        scoreBreakdown: {
          consistency: { score: 90, weight: 0.3, streak: 5 },
          completion: { score: 80, weight: 0.3 },
          focusQuality: { score: 85, weight: 0.2, avgMin: 35, targetMin: 45 },
          timeManagement: { score: 85, weight: 0.2, peakHours: [9, 14] },
        },
        stats: {
          focus: { totalSessions: 10, totalMinutes: 350, avgDurationMin: 35, completionRate: 90, weeklyMinutes: 350 },
          patterns: { peakHours: [9, 14], breakFrequency: 1, currentStreak: 5, moodDistribution: {} },
          tasks: { total: 10, completed: 9, completionRate: 90 },
        },
        generatedAt: new Date(),
        expiresAt,
      });

      const res = await request(app)
        .get("/api/ai/insights")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.fromCache).toBe(true);
      expect(res.body.insights[0]).toBe("Cached Insight 1");
      expect(res.body.productivityScore).toBe(85);
    });
  });

  describe("GET /api/ai/study-plan", () => {
    it("should return cached plan if exists", async () => {
      await StudyPlan.create({
        user: userId,
        weeks: [
          {
            weekNumber: 1,
            theme: "Core Fundamentals",
            dailyPlans: [{ day: "Monday", subjects: [{ name: "Computer Science", hours: 2, activity: "Study" }] }],
          },
        ],
        totalWeeks: 1,
        stream: "engineering",
        subjects: ["Computer Science"],
      });

      const res = await request(app)
        .get("/api/ai/study-plan")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.fromCache).toBe(true);
      expect(res.body.plan).toBeDefined();
      expect(res.body.plan.weeks[0].theme).toBe("Core Fundamentals");
    });
  });

  describe("GET /api/ai/recommendations", () => {
    it("should return rule-based recommendations based on focus stats", async () => {
      const res = await request(app)
        .get("/api/ai/recommendations")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.recommendations)).toBe(true);
    });
  });

  describe("GET /api/ai/adaptive-timer", () => {
    it("should return adaptive timer suggestion structure", async () => {
      const res = await request(app)
        .get("/api/ai/adaptive-timer")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(typeof res.body.hasEnoughData).toBe("boolean");
    });
  });

  describe("POST /api/ai/chat", () => {
    it("should process study chat and return response without throwing 500", async () => {
      const res = await request(app)
        .post("/api/ai/chat")
        .set("Authorization", `Bearer ${token}`)
        .send({
          message: "How should I structure my revision?",
          history: [],
        });

      expect(res.statusCode).toBe(200);
      expect(typeof res.body.answer).toBe("string");
      expect(res.body.answer.length).toBeGreaterThan(0);
    });
  });
});
