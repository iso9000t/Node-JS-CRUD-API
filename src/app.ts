import 'dotenv/config';
import http from 'http';
import { handleRequest } from './api/index';
import { HttpResponseStatusCode, UserErrorMessage } from './models/enums';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    console.error(error); // Log the error for debugging purposes
    if (!res.headersSent) {
      res.writeHead(HttpResponseStatusCode.InternalServerError, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: UserErrorMessage.ServerError }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
