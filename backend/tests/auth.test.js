const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');

let mongoServer;

beforeAll(async () => {
    process.env.JWT_SECRET = 'testsecret';
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany({});
});

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(201);
        expect(res.headers['set-cookie']).toBeDefined();
        expect(res.body).toHaveProperty('name', 'Test User');
    });

    it('should login an existing user', async () => {
        // Create user first
        await User.create({
            name: 'Existing User',
            email: 'existing@example.com',
            password: 'password123',
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'existing@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(200);
        expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should fail login with wrong password', async () => {
        await User.create({
            name: 'Existing User',
            email: 'existing@example.com',
            password: 'password123',
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'existing@example.com',
                password: 'wrongpassword',
            });

        expect(res.statusCode).toBe(401);
    });
});
