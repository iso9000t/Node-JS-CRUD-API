# CRUD API for User Management

This project implements a simple CRUD (Create, Read, Update, Delete) API for user management using Node.js. 
It allows clients to create new user records, read existing user information, update user details, and delete users.

## Available Endpoints

- **POST `/api/users`**: Create a new user.
    - Response: `201 Created` for a successful creation.
    - Errors: `400 Bad Request` if required fields are missing in the request body, `500 Internal Server Error` for server-side exceptions.
- **GET `/api/users`**: Retrieve all users.
    - Response: `200 OK` with all users' records.
    - Errors: `500 Internal Server Error` for server-side exceptions.
- **GET `/api/users/{userId}`**: Retrieve a single user by their ID.
    - Response: `200 OK` with the user's record if it exists.
    - Errors: `400 Bad Request` if `userId` is invalid (not a UUID), `404 Not Found` if the user does not exist, `500 Internal Server Error` for server-side exceptions.
- **PUT `/api/users/{userId}`**: Update an existing user by their ID.
    - Response: `200 OK` with the updated record.
    - Errors: `400 Bad Request` if `userId` is invalid or required fields are missing, `404 Not Found` if the user does not exist, `500 Internal Server Error` for server-side exceptions.
- **DELETE `/api/users/{userId}`**: Delete an existing user by their ID.
    - Response: `204 No Content` if the user was successfully deleted.
    - Errors: `400 Bad Request` if `userId` is invalid, `404 Not Found` if the user does not exist, `500 Internal Server Error` for server-side exceptions.

## How to Test with Postman

### General Tips for All Requests
- For `PUT` and `POST`, set `Content-Type` to `application/json` and ensure the body contains valid JSON.
- Use Postman's environment variables for the base URL to switch easily between different environments (development, production).
- The `500 Internal Server Error` is harder to simulate without intentionally introducing a fault in the server code. It typically indicates an unhandled exception or error on the server side.

### Testing POST: Create a New User
- Method: `POST`, URL: `http://localhost:3000/api/users`, Body: JSON with user details, Headers: `Content-Type` application/json.
- Expected response: `201 Created` with user data. For missing fields, `400 Bad Request`. For server errors, `500 Internal Server Error`.

### Testing GET: Retrieve All Users and Single User by ID
- Method: `GET`, URL: `http://localhost:3000/api/users` for all users, or `/api/users/{userId}` for a single user.
- Expected response for all users: `200 OK` with list of users. For single user: `200 OK` with user data; `400 Bad Request` for invalid ID, `404 Not Found` if user does not exist. For server errors, `500 Internal Server Error`.

### Testing PUT: Update an Existing User by ID
- Method: `PUT`, URL: `http://localhost:3000/api/users/{userId}`, Body: JSON with updated user details.
- Expected response: `200 OK` with updated user data. `400 Bad Request` for invalid data or ID, `404 Not Found` if user does not exist. For server errors, `500 Internal Server Error`.

### Testing DELETE: Delete an Existing User by ID
- Method: `DELETE`, URL: `http://localhost:3000/api/users/{userId}`.
- Expected response: `204 No Content` for successful deletion. `400 Bad Request` for invalid ID, `404 Not Found` if user does not exist. For server errors, `500 Internal Server Error`.

## Handling `500 Internal Server Error`
- This error indicates an unexpected condition was encountered on the server which prevented it from fulfilling the request.
- Testing for `500 Internal Server Error` typically involves scenarios like server misconfigurations, unhandled exceptions in code, or database failures.
- While it's challenging to test without causing real errors in the server, understanding the importance of handling this error helps in developing more robust applications.

Remember to monitor server logs and debug information to diagnose the cause of any `500 Internal Server Error` responses during development and testing.
