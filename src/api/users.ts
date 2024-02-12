import { IncomingMessage, ServerResponse } from 'http';
import { createUser } from '../services/userService.js';
import { HttpResponseStatusCode, UserErrorMessage } from '../models/enums.js';
import { parseRequestBody } from '../utils/parseRequestBody.js';
import { validateUser } from '../validation/userValidation.js';

export const usersRouter = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (req.url === '/api/users' && req.method === 'POST') {
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
    res.end(JSON.stringify({ error: UserErrorMessage.RouteError }));
  }
};
