import { IncomingMessage, ServerResponse } from 'http';
import { usersRouter } from './users.js';

export function handleRequest(req: IncomingMessage, res: ServerResponse): void {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  switch (url.pathname) {
    case '/api/users':
      usersRouter(req, res);
      break;
    default:
      res.statusCode = 404;
      res.end('Not Found');
  }
}
