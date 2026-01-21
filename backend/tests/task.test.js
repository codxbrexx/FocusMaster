const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const User = require("../src/models/User");
const Task = require("../src/models/Task");
const jwt = require("jsonwebtoken");

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  process.env.JWT_SECRET = "testsecret";
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Create a user and token
  const user = await User.create({
    name: "Task User",
    email: "task@example.com",
    password: "password123",
  });
  userId = user._id;
  token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
});

afterEach(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
});

describe("Task Endpoints", () => {
  it("should create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "New Task",
        priority: "high",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("New Task");
    expect(res.body.priority).toBe("high");
    expect(res.body.user).toBeDefined();
  });

  it("should get all tasks for user", async () => {
    await Task.create({
      user: userId,
      title: "Existing Task",
      priority: "medium",
    });

    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("Existing Task");
  });

  it("should update a task", async () => {
    const task = await Task.create({
      user: userId,
      title: "Task to Update",
    });

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Task",
        isCompleted: true,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Task");
    expect(res.body.isCompleted).toBe(true);
  });

  it("should delete a task", async () => {
    const task = await Task.create({
      user: userId,
      title: "Task to Delete",
    });

    const res = await request(app)
      .delete(`/api/tasks/${task._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const check = await Task.findById(task._id);
    expect(check).toBeNull();
  });
});
