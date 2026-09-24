const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Competition = require('../models/Competition');
const User = require('../models/User');
const Registration = require('../models/Registration');

let testCompId;
let testToken;
let testUserId;

beforeAll(async () => {
  // Ensure DB connected
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedants');
  }

  // Find or create a test competition
  let comp = await Competition.findOne({ title: 'Feedants Classical Dance' });
  if (!comp) {
    comp = await Competition.create({
      title: 'Feedants Classical Dance',
      category: 'Dance',
      tags: ['Dance', 'Multi-Win'],
      prizePool: 1500,
      entryFee: 99,
      totalSpots: 20,
      bookedSpots: 1,
      status: 'registration_open',
      registrationCloseDate: new Date(Date.now() + 24 * 3600 * 1000),
      submissionStartDate: new Date(Date.now() - 24 * 3600 * 1000),
      submissionEndDate: new Date(Date.now() + 20 * 24 * 3600 * 1000),
      resultDate: new Date(Date.now() + 25 * 24 * 3600 * 1000),
      judge: {
        name: 'Manju Dubey',
        title: 'Professional Kathak Dancer',
        experience: '12+ Years of Experience',
        photoUrl: 'https://example.com/photo.jpg',
        introVideoUrl: 'https://example.com/video.mp4',
      },
      rewards: [{ position: 1, label: '1st Winner', amount: 550, icon: 'gold' }],
    });
  }
  testCompId = comp._id.toString();

  // Create or login test user
  const email = `testuser_${Date.now()}@example.com`;
  const registerRes = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Automated Test User', email, password: 'password123' });

  testToken = registerRes.body.token;
  testUserId = registerRes.body.user._id;
});

afterAll(async () => {
  // Clean up test user & registrations
  if (testUserId) {
    await User.findByIdAndDelete(testUserId);
    await Registration.deleteMany({ userId: testUserId });
  }
  await mongoose.connection.close();
});

describe('Feedants Backend API & Business Logic Smoke Tests', () => {
  test('1. GET /health returns 200 ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('2. GET /api/competitions returns list of active competitions', async () => {
    const res = await request(app).get('/api/competitions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.competitions)).toBe(true);
    expect(res.body.competitions.length).toBeGreaterThan(0);
  });

  test('3. GET /api/competitions/:id returns competition details and lifecycle dates', async () => {
    const res = await request(app).get(`/api/competitions/${testCompId}`);
    expect(res.status).toBe(200);
    expect(res.body.competition).toBeDefined();
    expect(res.body.competition.title).toBe('Feedants Classical Dance');
    expect(res.body.competition.registrationCloseDate).toBeDefined();
  });

  test('4. GET /api/competitions/invalid-id returns 400 Bad Request', async () => {
    const res = await request(app).get('/api/competitions/not-a-valid-mongo-id');
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid competition ID/i);
  });

  test('5. POST /api/competitions/:id/register without token returns 401 Unauthorized', async () => {
    const res = await request(app).post(`/api/competitions/${testCompId}/register`);
    expect(res.status).toBe(401);
  });

  test('6. POST /api/competitions/:id/register with token successfully claims a spot atomically', async () => {
    const beforeComp = await Competition.findById(testCompId);
    const beforeSpots = beforeComp.bookedSpots;

    const res = await request(app)
      .post(`/api/competitions/${testCompId}/register`)
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.status).toBe(201);
    expect(res.body.registration).toBeDefined();
    expect(res.body.competition.bookedSpots).toBe(beforeSpots + 1);
  });

  test('7. Duplicate registration returns 409 Conflict and does not increment spots', async () => {
    const beforeComp = await Competition.findById(testCompId);
    const spotsBefore = beforeComp.bookedSpots;

    const res = await request(app)
      .post(`/api/competitions/${testCompId}/register`)
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already registered/i);

    const afterComp = await Competition.findById(testCompId);
    expect(afterComp.bookedSpots).toBe(spotsBefore);
  });

  test('8. Dev endpoints are protected in production mode', async () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    delete process.env.ALLOW_DEMO_ENDPOINTS;

    const res = await request(app).post(`/api/competitions/${testCompId}/simulate-booking`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/disabled in production/i);

    process.env.NODE_ENV = origEnv;
  });
});
