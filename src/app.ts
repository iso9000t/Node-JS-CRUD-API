// Import necessary modules
import 'dotenv/config';
import http from 'http';
import { handleRequest } from './api/index'; // Make sure this path correctly points to your request handler
import { HttpResponseStatusCode, UserErrorMessage } from './models/enums';

// Define the server creation logic
export const createServer = () =>
  http.createServer((req, res) => {
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

// Conditionally start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the createServer function for use in tests
export default createServer;
