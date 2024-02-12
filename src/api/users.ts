import { IncomingMessage, ServerResponse } from 'http';
import {
  createUser,
  getAllUsers,
  getUserById,
} from '../services/userService.js';
import { HttpResponseStatusCode, UserErrorMessage } from '../models/enums.js';
import { parseRequestBody } from '../utils/parseRequestBody.js';
import { validateUser } from '../validation/userValidation.js';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { User } from 'models/models.js';

export const usersRouter = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const id = url.pathname.split('/')[3]; // Assuming URL pattern is /api/users/{id}

  if (url.pathname === '/api/users' && req.method === 'GET') {
    // Handle GET all users
    const users: User[] = getAllUsers();
    res.writeHead(HttpResponseStatusCode.OK, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify(users));
  } else if (id && req.method === 'GET') {
    // Handle GET single user by ID
    if (!uuidValidate(id)) {
      res.writeHead(HttpResponseStatusCode.BadRequest, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: UserErrorMessage.InvalidId }));
      return;
    }
    const user: User | undefined = getUserById(id);
    if (!user) {
      res.writeHead(HttpResponseStatusCode.NotFound, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: UserErrorMessage.NotFound }));
      return;
    }
    res.writeHead(HttpResponseStatusCode.OK, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify(user));
  } else if (req.method === 'POST') {
    try {
      const { username, age, hobbies } = await parseRequestBody(req);
      const [isValid, errorMessage] = validateUser(username, age, hobbies);

      if (!isValid) {
        res.writeHead(HttpResponseStatusCode.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: errorMessage }));
        return;
      }

      const newUser = createUser(username, age, hobbies);
      res.writeHead(HttpResponseStatusCode.Created, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(newUser));
    } catch (e) {
      res.writeHead(HttpResponseStatusCode.BadRequest, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: UserErrorMessage.MalformedJSON }));
    }
  } else {
    res.writeHead(HttpResponseStatusCode.NotFound, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({ error: UserErrorMessage.UnsupportedMethod }));
  }
};
