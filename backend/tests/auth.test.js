const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");

let mongoServer;

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

afterEach(async () => {
  await User.deleteMany({});
});

// ─── Helper ────────────────────────────────────────────────────────────────
async function createUser(overrides = {}) {
  return User.create({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    ...overrides,
  });
}

function makeToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// ─── Registration ──────────────────────────────────────────────────────────
describe("POST /api/auth/register", () => {
  it("should register a new user and return 201 with a JWT cookie", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.body).toHaveProperty("name", "Test User");
    expect(res.body).not.toHaveProperty("password");
  });

  it("should return 400 when email is already taken", async () => {
    await createUser();

    const res = await request(app).post("/api/auth/register").send({
      name: "Duplicate",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it("should return 400 for missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should return 400 for a password without a number", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "onlyletters",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toMatch(/at least one number/i);
  });

  it("should return 400 for a password without a letter", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "12345678",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].message).toMatch(/at least one letter/i);
  });
});

// ─── Login ─────────────────────────────────────────────────────────────────
describe("POST /api/auth/login", () => {
  it("should login an existing active user and return 200 with a JWT cookie", async () => {
    await createUser();

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  it("should return 401 for wrong password", async () => {
    await createUser();

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it("should return 401 for a non-existent email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(401);
  });

  // ── NEW: Banned / Suspended account checks ──────────────────────────────
  it("should return 403 when a banned user tries to login", async () => {
    await createUser({ status: "banned" });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/banned/i);
  });

  it("should return 403 when a suspended user tries to login", async () => {
    await createUser({ status: "suspended" });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/suspended/i);
  });

  it("should return 400 for validation error when password is missing", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/validation failed/i);
  });
});

// ─── Guest Login ───────────────────────────────────────────────────────────
describe("POST /api/auth/guest", () => {
  it("should create a guest user and return 200 with a JWT cookie", async () => {
    const res = await request(app).post("/api/auth/guest").send({});

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.body.isGuest).toBe(true);
    expect(res.body._id).toBeDefined();
  });

  it("should reuse an existing guest user when guestId is provided", async () => {
    // First request — creates guest
    const first = await request(app).post("/api/auth/guest").send({});
    const guestId = first.body._id;

    // Second request — resumes same guest
    const second = await request(app)
      .post("/api/auth/guest")
      .send({ guestId });

    expect(second.statusCode).toBe(200);
    expect(second.body._id).toBe(guestId);
  });
});

// ─── Auth Middleware (deleted-user null check) ─────────────────────────────
describe("Auth Middleware — deleted user with valid token", () => {
  it("should return 401 when a user is deleted but their JWT is still valid", async () => {
    // Create user, grab their ID, then delete them
    const user = await createUser();
    const token = makeToken(user._id);
    await User.deleteOne({ _id: user._id });

    // Try to access a protected route with the stale token
    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/user no longer exists/i);
  });
});

// ─── Logout ────────────────────────────────────────────────────────────────
describe("POST /api/auth/logout", () => {
  it("should return 200 and clear the JWT cookie", async () => {
    const res = await request(app).post("/api/auth/logout");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/logged out/i);

    // The Set-Cookie header should clear the jwt cookie (expires in the past)
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    const jwtCookie = cookies.find((c) => c.startsWith("jwt="));
    expect(jwtCookie).toBeDefined();
    expect(jwtCookie).toMatch(/expires=Thu, 01 Jan 1970/i);
  });
});

// ─── Profile (protected) ───────────────────────────────────────────────────
describe("GET /api/auth/profile", () => {
  it("should return 401 without a token", async () => {
    const res = await request(app).get("/api/auth/profile");
    expect(res.statusCode).toBe(401);
  });

  it("should return the user profile with a valid token", async () => {
    const user = await createUser();
    const token = makeToken(user._id);

    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("test@example.com");
    expect(res.body).not.toHaveProperty("password");
  });

  it("should return 401 for an invalid / tampered token", async () => {
    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", "Bearer tampered.invalid.token");

    expect(res.statusCode).toBe(401);
  });
});
