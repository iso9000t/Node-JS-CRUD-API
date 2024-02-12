export enum HttpRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum HttpResponseStatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
}

export enum UserErrorMessage {
  NotFound = 'User not found',
  BadRequest = 'Invalid request',
  ServerError = 'Unexpected server error',
  UnsupportedMethod = 'HTTP method not supported',
  RouteError = 'Incorrect route',
  InvalidId = 'Invalid user ID',
  MalformedJSON = 'Malformed JSON payload',
  InvalidData = 'Invalid request data',
}
