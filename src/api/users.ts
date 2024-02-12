import { IncomingMessage, ServerResponse } from 'http';
import { createUser } from '../services/userService.js';
import { HttpResponseStatusCode, UserErrorMessage } from '../models/enums.js';

export const usersRouter = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (req.url === '/api/users' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { username, age, hobbies } = JSON.parse(body);

        // Simple validation
        if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
          res.writeHead(HttpResponseStatusCode.BadRequest, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ error: UserErrorMessage.InvalidData }));
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
    });
  } else {
    // For now, just send a 404 for any non-POST request to /api/users
    res.writeHead(HttpResponseStatusCode.NotFound, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({ error: UserErrorMessage.RouteError }));
  }
};
