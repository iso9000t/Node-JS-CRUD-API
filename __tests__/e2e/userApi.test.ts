import supertest from 'supertest';
import { createServer } from '../../src/app'; // Adjust the path as necessary

// Initialize the supertest request with the server instance
const request = supertest(createServer());

describe('API Tests', () => {
  let userId: any; // Use let to reassign userId later

  it('should get all users (empty array expected)', async () => {
    const response = await request.get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]); // Assuming no users initially
  });

  it('should create a new user', async () => {
    const newUser = {
      username: 'Test User',
      age: 25,
      hobbies: ['Reading', 'Coding'],
    };
    const response = await request.post('/api/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    userId = response.body.id;
  });

  it('should get the created user by id', async () => {
    const response = await request.get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('Test User');
  });

  it('should update the created user', async () => {
    const updatedUser = {
      username: 'Updated User',
      age: 26,
      hobbies: ['Reading', 'Gaming'],
    };
    const response = await request
      .put(`/api/users/${userId}`)
      .send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('Updated User');
  });

  it('should delete the created user', async () => {
    const response = await request.delete(`/api/users/${userId}`);
    expect(response.status).toBe(204);
  });

  it('should return 404 when trying to get the deleted user', async () => {
    const response = await request.get(`/api/users/${userId}`);
    expect(response.status).toBe(404);
  });
});
