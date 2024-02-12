import { HttpResponseStatusCode, UserErrorMessage } from '../models/enums.js';

export const validateUser = (
  username: string,
  age: number,
  hobbies: string[]
): [boolean, string?] => {
  if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
    return [false, UserErrorMessage.InvalidData];
  }
  return [true];
};
