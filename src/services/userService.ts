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

// Function to get all users
export const getAllUsers = (): User[] => {
  return users; // Return the whole array of users
};

// Find a user by ID
export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id); 
};

// Update an existing user
export const updateUser = (
  id: string,
  username: string,
  age: number,
  hobbies: string[]
): User | undefined => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    users[userIndex] = { id, username, age, hobbies };
    return users[userIndex];
  }
  return undefined;
};

// Delete an existing user
export const deleteUserById = (id: string): boolean => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    return true;
  }
  return false;
};

