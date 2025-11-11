/**
 * Functional API Tests for Simple Express App
 * Tests all endpoints to verify functionality after dependency upgrades
 */

const request = require('supertest');
const app = require('../index');

describe('Simple Express App - API Tests', () => {

  // ==========================================
  // Root & Health Endpoints
  // ==========================================

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('Welcome');
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('framework');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
    });

    it('should have valid timestamp format', async () => {
      const res = await request(app).get('/health');

      const timestamp = new Date(res.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    it('should have positive uptime', async () => {
      const res = await request(app).get('/health');

      expect(res.body.uptime).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // User Management - GET
  // ==========================================

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const res = await request(app).get('/api/users');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('count');
      expect(res.body).toHaveProperty('users');
      expect(Array.isArray(res.body.users)).toBe(true);
    });

    it('should have default users', async () => {
      const res = await request(app).get('/api/users');

      expect(res.body.count).toBeGreaterThanOrEqual(2);
      expect(res.body.users.length).toBeGreaterThanOrEqual(2);
    });

    it('should return users with correct structure', async () => {
      const res = await request(app).get('/api/users');

      const user = res.body.users[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by ID', async () => {
      const res = await request(app).get('/api/users/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.id).toBe(1);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app).get('/api/users/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should handle invalid ID gracefully', async () => {
      const res = await request(app).get('/api/users/abc');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  // ==========================================
  // User Management - POST
  // ==========================================

  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com'
      };

      const res = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.name).toBe('Test User');
      expect(res.body.user.email).toBe('test@example.com');
      expect(res.body.user).toHaveProperty('id');
    });

    it('should return 400 without name', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('required');
    });

    it('should return 400 without email', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'Test User' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('required');
    });

    it('should return 400 with empty body', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  // ==========================================
  // User Management - PUT
  // ==========================================

  describe('PUT /api/users/:id', () => {
    it('should update existing user', async () => {
      const updates = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const res = await request(app)
        .put('/api/users/1')
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.name).toBe('Updated Name');
      expect(res.body.user.email).toBe('updated@example.com');
    });

    it('should update only name', async () => {
      const res = await request(app)
        .put('/api/users/1')
        .send({ name: 'Only Name Updated' });

      expect(res.statusCode).toBe(200);
      expect(res.body.user.name).toBe('Only Name Updated');
      expect(res.body.user).toHaveProperty('email'); // Email should still exist
    });

    it('should update only email', async () => {
      const res = await request(app)
        .put('/api/users/1')
        .send({ email: 'onlyemail@example.com' });

      expect(res.statusCode).toBe(200);
      expect(res.body.user.email).toBe('onlyemail@example.com');
      expect(res.body.user).toHaveProperty('name'); // Name should still exist
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .put('/api/users/999')
        .send({ name: 'Test' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error', 'User not found');
    });
  });

  // ==========================================
  // User Management - DELETE
  // ==========================================

  describe('DELETE /api/users/:id', () => {
    it('should delete existing user', async () => {
      // First, create a user to delete
      const createRes = await request(app)
        .post('/api/users')
        .send({ name: 'To Delete', email: 'delete@example.com' });

      const userId = createRes.body.user.id;

      // Now delete it
      const res = await request(app).delete(`/api/users/${userId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'User deleted');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.id).toBe(userId);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app).delete('/api/users/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should actually remove user from list', async () => {
      // Create a user
      const createRes = await request(app)
        .post('/api/users')
        .send({ name: 'To Remove', email: 'remove@example.com' });

      const userId = createRes.body.user.id;

      // Delete it
      await request(app).delete(`/api/users/${userId}`);

      // Verify it's gone
      const getRes = await request(app).get(`/api/users/${userId}`);
      expect(getRes.statusCode).toBe(404);
    });
  });

  // ==========================================
  // Error Handling
  // ==========================================

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/unknown/route');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error', 'Route not found');
    });

    it('should handle POST to wrong route', async () => {
      const res = await request(app).post('/api/wrong');

      expect(res.statusCode).toBe(404);
    });

    it('should handle PUT to wrong route', async () => {
      const res = await request(app).put('/api/wrong/1');

      expect(res.statusCode).toBe(404);
    });

    it('should handle DELETE to wrong route', async () => {
      const res = await request(app).delete('/api/wrong/1');

      expect(res.statusCode).toBe(404);
    });
  });

  // ==========================================
  // CORS Middleware
  // ==========================================

  describe('CORS Middleware', () => {
    it('should have CORS headers', async () => {
      const res = await request(app).get('/health');

      expect(res.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  // ==========================================
  // Body Parser Middleware
  // ==========================================

  describe('Body Parser Middleware', () => {
    it('should parse JSON body', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'JSON Test', email: 'json@test.com' })
        .set('Content-Type', 'application/json');

      expect(res.statusCode).toBe(201);
      expect(res.body.user.name).toBe('JSON Test');
    });

    it('should parse URL-encoded body', async () => {
      const res = await request(app)
        .post('/api/users')
        .send('name=URLEncoded&email=url@test.com')
        .set('Content-Type', 'application/x-www-form-urlencoded');

      expect(res.statusCode).toBe(201);
      expect(res.body.user.name).toBe('URLEncoded');
    });
  });

  // ==========================================
  // Integration Tests
  // ==========================================

  describe('Integration - Full CRUD Workflow', () => {
    it('should complete full user lifecycle', async () => {
      // 1. Create user
      const createRes = await request(app)
        .post('/api/users')
        .send({ name: 'Lifecycle User', email: 'lifecycle@test.com' });

      expect(createRes.statusCode).toBe(201);
      const userId = createRes.body.user.id;

      // 2. Read user
      const getRes = await request(app).get(`/api/users/${userId}`);
      expect(getRes.statusCode).toBe(200);
      expect(getRes.body.user.name).toBe('Lifecycle User');

      // 3. Update user
      const updateRes = await request(app)
        .put(`/api/users/${userId}`)
        .send({ name: 'Updated Lifecycle' });

      expect(updateRes.statusCode).toBe(200);
      expect(updateRes.body.user.name).toBe('Updated Lifecycle');

      // 4. Verify update
      const verifyRes = await request(app).get(`/api/users/${userId}`);
      expect(verifyRes.body.user.name).toBe('Updated Lifecycle');

      // 5. Delete user
      const deleteRes = await request(app).delete(`/api/users/${userId}`);
      expect(deleteRes.statusCode).toBe(200);

      // 6. Verify deletion
      const checkRes = await request(app).get(`/api/users/${userId}`);
      expect(checkRes.statusCode).toBe(404);
    });

    it('should handle multiple users', async () => {
      // Get initial count
      const initialRes = await request(app).get('/api/users');
      const initialCount = initialRes.body.count;

      // Create 3 users
      await request(app).post('/api/users').send({ name: 'User 1', email: 'user1@test.com' });
      await request(app).post('/api/users').send({ name: 'User 2', email: 'user2@test.com' });
      await request(app).post('/api/users').send({ name: 'User 3', email: 'user3@test.com' });

      // Verify count increased
      const finalRes = await request(app).get('/api/users');
      expect(finalRes.body.count).toBe(initialCount + 3);
    });
  });

  // ==========================================
  // Performance Tests
  // ==========================================

  describe('Performance', () => {
    it('should respond to health check quickly', async () => {
      const start = Date.now();
      await request(app).get('/health');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100); // Should respond in <100ms
    });

    it('should handle concurrent requests', async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(request(app).get('/health'));
      }

      const results = await Promise.all(promises);

      results.forEach(res => {
        expect(res.statusCode).toBe(200);
      });
    });
  });
});
