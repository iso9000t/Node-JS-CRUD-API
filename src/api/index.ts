import { IncomingMessage, ServerResponse } from 'http';
import { usersRouter } from './users';
import { HttpResponseStatusCode, UserErrorMessage } from '../models/enums';

export async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    if (req.url?.startsWith('/api/users')) {
      await usersRouter(req, res);
    } else {
      res.writeHead(HttpResponseStatusCode.NotFound, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: UserErrorMessage.RouteError }));
    }
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    if (!res.headersSent) {
      res.writeHead(HttpResponseStatusCode.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: UserErrorMessage.ServerError }));
    }
  }
}
