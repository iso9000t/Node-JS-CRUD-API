import supertest from 'supertest';
import { createServer } from '../../src/app'; // Make sure this path is correct for your project structure

const request = supertest(createServer());

describe('Enhanced API Testing', () => {
  let userId: any;
  const validButNonexistentUUID = 'a19a42c4-7f7d-47c2-a15a-d166bd8e302a';

  beforeAll(async () => {
    const createUserResponse = await request.post('/api/users').send({
      username: 'Initial User',
      age: 28,
      hobbies: ['Initial Hobby'],
    });
    userId = createUserResponse.body.id;
  });

  afterAll(async () => {
    await request.delete(`/api/users/${userId}`);
  });

  // Scenario 1: Comprehensive CRUD Operations
  describe('Comprehensive CRUD Operations', () => {
    it('should create a user with only required fields and return the created user data', async () => {
      const response = await request.post('/api/users').send({
        username: 'Required Fields User',
        age: 22,
        hobbies: [],
      });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should read the list of users and confirm the created users are listed', async () => {
      const response = await request.get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should update a user's information and verify the update", async () => {
      const updatedUserInfo = {
        username: 'Updated User',
        age: 29,
        hobbies: ['Updated Hobby'],
      };
      await request
        .put(`/api/users/${userId}`)
        .send(updatedUserInfo)
        .expect(200);

      const getUserResponse = await request.get(`/api/users/${userId}`);
      expect(getUserResponse.body.username).toEqual(updatedUserInfo.username);
    });

    it('should delete a user and confirm the user no longer exists', async () => {
      const deleteResponse = await request.delete(`/api/users/${userId}`);
      expect(deleteResponse.status).toBe(204);

      await request.get(`/api/users/${userId}`).expect(404);
    });
  });

  // Scenario 2: Advanced Error Handling and Edge Cases
  describe('Advanced Error Handling and Edge Cases', () => {
    it('should return 400 for invalid UUID format in user-specific operations', async () => {
      const invalidUUID = 'this-is-not-a-valid-uuid';
      await request.get(`/api/users/${invalidUUID}`).expect(400);
      await request
        .put(`/api/users/${invalidUUID}`)
        .send({ username: 'Attempt' })
        .expect(400);
      await request.delete(`/api/users/${invalidUUID}`).expect(400);
    });

    it('should return 404 for operations on a non-existent user', async () => {
      await request.get(`/api/users/${validButNonexistentUUID}`).expect(404);
      await request
        .put(`/api/users/${validButNonexistentUUID}`)
        .send({ username: 'Ghost' })
        .expect(404);
      await request.delete(`/api/users/${validButNonexistentUUID}`).expect(404);
    });
  });

  // Scenario 3: Input Validation and Error Messages
  describe('Input Validation and Error Messages', () => {
    it('should return 400 when creating a user with incomplete data', async () => {
      await request
        .post('/api/users')
        .send({ username: 'Incomplete' })
        .expect(400);
    });

    it('should return 400 when creating a user with missing required fields', async () => {
      const response = await request
        .post('/api/users')
        .send({ age: 25, hobbies: ['Reading'] });

      expect(response.status).toBe(400);
    });
  });

  // Scenario 4: Handling Requests to Non-existing Endpoints
  describe('Handling Requests to Non-existing Endpoints', () => {
    it('should return 404 for requests to non-existing endpoints', async () => {
      await request.get('/nothing-here').expect(404);
      await request.post('/nothing-here').send({ data: 'none' }).expect(404);
    });
  });
});
