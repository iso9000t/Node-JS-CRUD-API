import { User } from '../models/models.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory "database"
let users: User[] = [];

// Function to create a new user
export const createUser = (
  username: string,
  age: number,
  hobbies: string[]
): User => {
  const newUser: User = {
    id: uuidv4(),
    username,
    age,
    hobbies,
  };

  users.push(newUser);
  return newUser;
};

// Export other services as needed
