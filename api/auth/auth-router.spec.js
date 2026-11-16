const server = require('../../app');

const db = require('../../database/db-config');

const request = require('supertest');

describe('app.js (server)', function () {
  describe('environment', function () {
    it('should set environment to testing', function () {
      expect(process.env.NODE_ENV).toBe('testing');
    });
  });
});

describe('auth-router.js', function () {
  describe('Post /auth/login', function () {
    beforeEach(async () => {
      await db.seed.run();
    });

    it('Should return the user and return a token', async function () {
      const admin = {
        email: 'admin@example.com',
        password: 'test-admin-password'
      };
      const res = await request(server).post('/auth/login').send(admin);
      expect(res.body.user).toMatchObject({
        username: 'Test Admin',
        email: 'admin@example.com',
        role: 'admin'
      });
      expect(res.body.token).toContain('eyJhbG');
    });

    it('Should return status 200 ok', async function () {
      const admin = {
        email: 'admin@example.com',
        password: 'test-admin-password'
      };
      const res = await request(server).post('/auth/login').send(admin);
      expect(res.status).toBe(200);
    });

    it('Should return status 401 unauthorized for an incorrect password', async function () {
      const admin = {
        email: 'admin@example.com',
        password: 'not the password'
      };
      const res = await request(server).post('/auth/login').send(admin);
      expect(res.status).toBe(401);
    });

    it('Should return status 401 unauthorized for an unregistered email', async function () {
      const user = {
        email: 'paris@gmail.com',
        password: 'I am a fashion icon.'
      };
      const res = await request(server).post('/auth/login').send(user);
      expect(res.status).toBe(401);
    });
  });

  describe('Get /auth', function () {
    beforeEach(async () => {
      await db.seed.run();
    });

    it('Should return the username, email and role of the current user', async function () {
      const guest = {
        email: 'guest@example.com',
        password: 'test-guest-password'
      };
      const login = await request(server).post('/auth/login').send(guest);
      const res = await request(server)
        .get('/auth')
        .set('Authorization', `Bearer ${login.body.token}`);
      expect(res.body).toMatchObject({
        username: 'Test Guest',
        email: 'guest@example.com',
        role: 'guest'
      });
    });

    it('Should return status 200 ok', async function () {
      const guest = {
        email: 'guest@example.com',
        password: 'test-guest-password'
      };
      const login = await request(server).post('/auth/login').send(guest);
      const res = await request(server)
        .get('/auth')
        .set('Authorization', `Bearer ${login.body.token}`);
      expect(res.status).toBe(200);
    });

    it('Should return status 401 unauthorized without a token', async function () {
      const res = await request(server).get('/auth');
      expect(res.status).toBe(401);
    });
  });

  describe('Post /auth/register', function () {
    beforeEach(async () => {
      await db.seed.run();
    });

    it('Should return the username', async function () {
      const admin = {
        email: 'admin@example.com',
        password: 'test-admin-password'
      };
      const user = {
        username: 'Paris',
        email: 'paris@gmail.com',
        password: 'I am a fashion icon.'
      };
      const login = await request(server).post('/auth/login').send(admin);
      const res = await request(server)
        .post('/auth/register')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(user);
      expect(res.body).toMatchObject({ username: 'Paris' });
    });

    it('Should return status 201 created', async function () {
      const admin = {
        email: 'admin@example.com',
        password: 'test-admin-password'
      };
      const user = {
        username: 'Paris',
        email: 'paris@gmail.com',
        password: 'I am a fashion icon.'
      };
      const login = await request(server).post('/auth/login').send(admin);
      const res = await request(server)
        .post('/auth/register')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(user);
      expect(res.status).toBe(201);
    });

    it('Should return the guest role when the request body asks for the admin role', async function () {
      const admin = {
        email: 'admin@example.com',
        password: 'test-admin-password'
      };
      const user = {
        username: 'Paris',
        email: 'paris@gmail.com',
        password: 'I am a fashion icon.',
        role: 'admin'
      };
      const login = await request(server).post('/auth/login').send(admin);
      const res = await request(server)
        .post('/auth/register')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(user);
      expect(res.body).toMatchObject({ username: 'Paris', role: 'guest' });
    });

    it('Should return status 401 unauthorized without a token', async function () {
      const user = {
        username: 'Paris',
        email: 'paris@gmail.com',
        password: 'I am a fashion icon.'
      };
      const res = await request(server).post('/auth/register').send(user);
      expect(res.status).toBe(401);
    });

    it('Should return status 403 forbidden for a user who is not an admin', async function () {
      const guest = {
        email: 'guest@example.com',
        password: 'test-guest-password'
      };
      const user = {
        username: 'Paris',
        email: 'paris@gmail.com',
        password: 'I am a fashion icon.'
      };
      const login = await request(server).post('/auth/login').send(guest);
      const res = await request(server)
        .post('/auth/register')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(user);
      expect(res.status).toBe(403);
    });
  });
});
