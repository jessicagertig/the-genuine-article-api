const server = require('../../app')

const db = require('../../database/db-config')

const request = require('supertest')

describe('app.js (server)', function () {
  describe('environment', function () {
    it('should set environment to testing', function () {
      expect(process.env.NODE_ENV).toBe('testing')
    })
  })
})

describe('auth-router.js', function () {
  describe('Post /register', function () {
    beforeEach(async () => {
      await db('users').truncate()
    }) //end of async clean up function

    it('Should return the username', async function () {
      const user = {
        username: 'Paris',
        email: 'paris@gmail.com',
        password: 'I am a fashion icon.'
      }
      const res = await request(server).post('/register').send(user)
      expect(res.body).toMatchObject({ username: 'Paris' })
    })

    it('Should return status 201 created', async function () {
      const user = {
        username: 'Paris',
        email: 'paris@gmail.com',
        password: 'I am a fashion icon.'
      }
      const res = await request(server).post('/register').send(user)
      expect(res.status).toBe(201)
    })
  })

  describe('Post /login', function () {
    beforeEach(async () => {
      await db('users').truncate()
    }) //end of async clean up function

    it('Should return the welcome message containing the username and return a token', async function () {
      const user = {
        username: 'Paris',
        email: 'paris@gmail.com',
        password: 'I am a fashion icon.'
      }
      const login_input = {
        email: 'paris@gmail.com',
        password: 'I am a fashion icon.'
      }
      await request(server).post('/register').send(user)
      const res = await request(server)
        .post('/login')
        .send(login_input)
      expect(res.body.message).toContain(user.username)
      expect(res.body.message).toContain('Welcome')
      expect(res.body.token).toContain('eyJhbG')
    })

    it('Should return status 200 ok', async function () {
      const user = {
        username: 'Paris',
        email: 'paris@gmail.com',
        password: 'I am a fashion icon.'
      }
      const login_input = {
        email: 'paris@gmail.com',
        password: 'I am a fashion icon.'
      }
      await request(server).post('/register').send(user)
      const res = await request(server)
        .post('/login')
        .send(login_input)
      expect(res.status).toBe(200)
    })
  })
})
