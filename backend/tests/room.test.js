const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const User = require("../src/models/User");
const FocusRoom = require("../src/models/FocusRoom");
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
    name: "Room Host",
    email: "roomhost@example.com",
    password: "password123",
  });
  userId = user._id;
  token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
});

afterEach(async () => {
  await User.deleteMany({});
  await FocusRoom.deleteMany({});
});

describe("Focus Room Endpoints", () => {
  it("should create a new focus room", async () => {
    const res = await request(app)
      .post("/api/rooms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Engineering Study Group",
        description: "Focus sessions for coders",
        stream: "engineering",
        maxParticipants: 25,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Engineering Study Group");
    expect(res.body.stream).toBe("engineering");
    expect(res.body.host).toBeDefined();
  });

  it("should get active focus rooms", async () => {
    await request(app)
      .post("/api/rooms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Medical Study Room",
        stream: "medical",
      });

    const res = await request(app)
      .get("/api/rooms")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Medical Study Room");
  });

  it("should close a focus room", async () => {
    const roomRes = await request(app)
      .post("/api/rooms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Room To Close",
      });

    const roomId = roomRes.body._id;

    const res = await request(app)
      .delete(`/api/rooms/${roomId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Room closed successfully");
  });
});
