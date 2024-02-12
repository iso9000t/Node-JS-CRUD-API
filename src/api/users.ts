import { IncomingMessage, ServerResponse } from 'http';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
} from '../services/userService';
import { HttpResponseStatusCode, UserErrorMessage } from '../models/enums';
import { parseRequestBody } from '../utils/parseRequestBody';
import { validateUser } from '../validation/userValidation';
import { validate as uuidValidate } from 'uuid';
import { User } from '../models/models';

export const usersRouter = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const id = url.pathname.split('/')[3];

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
  } else if (req.method === 'PUT' && id) {
    if (!uuidValidate(id)) {
      res.writeHead(HttpResponseStatusCode.BadRequest, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: UserErrorMessage.InvalidId }));
      return;
    }
    try {
      const userUpdate = await parseRequestBody(req);
      const user = getUserById(id);
      if (!user) {
        res.writeHead(HttpResponseStatusCode.NotFound, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: UserErrorMessage.NotFound }));
        return;
      }

      const [isValid, errorMessage] = validateUser(
        userUpdate.username,
        userUpdate.age,
        userUpdate.hobbies
      );
      if (!isValid) {
        res.writeHead(HttpResponseStatusCode.BadRequest, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: errorMessage }));
        return;
      }

      const updatedUser = updateUser(
        id,
        userUpdate.username,
        userUpdate.age,
        userUpdate.hobbies
      );
      res.writeHead(HttpResponseStatusCode.OK, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(updatedUser));
    } catch (e) {
      res.writeHead(HttpResponseStatusCode.BadRequest, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: UserErrorMessage.MalformedJSON }));
    }
  } else if (req.method === 'DELETE' && id) {
    if (!uuidValidate(id)) {
      res.writeHead(HttpResponseStatusCode.BadRequest, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: UserErrorMessage.InvalidId }));
      return;
    }

    const deleted = deleteUserById(id);
    if (deleted) {
      res.writeHead(HttpResponseStatusCode.NoContent);
      res.end();
    } else {
      res.writeHead(HttpResponseStatusCode.NotFound, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: UserErrorMessage.NotFound }));
    }
  } else {
    res.writeHead(HttpResponseStatusCode.NotFound, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({ error: UserErrorMessage.UnsupportedMethod }));
  }
};
