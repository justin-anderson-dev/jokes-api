# Jokes API

This is a REST API built with Node.js, Express, and Prisma. It provides endpoints for accessing a database collection of dad jokes. Authenticated users can add jokes to a personal list of favorites. Authenticated admins can also add or remove jokes from the database, and remove users.

---

## 🛠️ Technology Used

| Technology                                    | Use                                    |
| --------------------------------------------- | -------------------------------------- |
| [Express](https://expressjs.com/)             | Server framework                       |
| [TypeScript](https://www.typescriptlang.org/) | Tooling for static types in JavaScript |
| [PostgreSQL](https://www.postgresql.org/)     | Relational Data Store                  |
| [Prisma](https://www.prisma.io/)              | TypeScript-friendly ORM for Node       |
| [JWT](https://jwt.io/)                        | Authentication                         |
| [Jest](https://jestjs.io/)                    | Unit testing                           |
| [Postman](https://www.postman.com/)           | End to end testing                     |

---

## 💻 Running Locally

#### Assumptions

1. Postgres is running locally
2. Node is installed locally (^18)

### Setup

1. Clone the repository.
2. Create a `.env` file in the project root directory, modeled on the included `.env.sample`, with your own variable values for API and DB settings.
3. Run `npm install` to install the dependencies.
4. Run `npm run db:model` to generate the prisma models.
5. Run `npm run db:build` to apply the database migrations.
6. Run `npm run db:seed` to seed the database with sample data.
7. Run `npm run build` to compile the TypeScript code after passing all Jest tests.
8. Run `npm run start` to start the API server, or `npm run dev` to start in dev mode with nodemon.
9. The API will now be available locally at port 3000 (or your configured port).

### Sample data

Once the db is seeded, you will be able to log in as any of the following users:

| Username          | Password | Role  |
| ----------------- | -------- | ----- |
| john@noemail.com  | 'abc123' | User  |
| jane@noemail.com  | 'abc123' | User  |
| rick@noemail.com  | 'abc123' | User  |
| admin@noemail.com | 'abc123' | Admin |

To login, send a `POST` request to `/api/v1/auth/login` with a JSON body containing `username` and `password` properties. A valid login will send a response with a JSON body containing a `token` property. The value of `token` is the encoded JWT containing id, username, and role for the authenticated user.

To access protected routes (see endpoints list below), send the http request with bearer token auth headers containing the token.

### API Endpoints

- `POST /api/v1/auth/register`
  Description: Allows users to create a new account.
  Request body: { "username": "john@noemail.com", "password": "password123" }
  Response: { "user": {user properties} }

- `POST /api/v1/auth/login`
  Description: Allows users to log in to their account and receive a JWT token for authentication.
  Request body: { "username": { username }, "password": { password } }
  Response: { "token": "..." }

- `GET /api/v1/jokes`
  Description: Retrieves a list of all publicly available jokes.
  Response: { "jokes": [...] }

- `GET /api/v1/jokes/{id}`
  Description: Retrieves a particular joke.
  Response: { "joke": {"id": { id }, "content": { content } }

- `POST /api/v1/jokes`
  Description: Adds a new joke to the jokes database.
  Authorization: Bearer Token (Admin only)
  Request body: { "content": { content } }
  Response: { "message": "Joke created successfully", "joke": { joke properties } }

- `DELETE /api/v1/jokes/{id}`
  Description: Deletes a particular joke.
  Authorization: Bearer Token (Admin only)
  Response: { "message": "Joke deleted successfully" }

- `GET /api/v1/users`
  Description: Retrieves a list of all user records.
  Authorization: Bearer Token (Admin only)
  Response: { "users": [...] }

- `GET /api/v1/users/{id}`
  Description: Retrieves information about a specific user.
  Authorization: Bearer Token (Admin or Authenticated User)
  Response: { "user": { user properties } }

- `GET /api/v1/users/{id}/jokes`
  Description: Retrieves a list of jokes saved to the authenticated user.
  Authorization: Bearer Token (Admin or Authenticated User)
  Response: { "jokes": [...] }

- `POST /api/v1/users/{id}/jokes`
  Description: Saves a joke to the authenticated user's list of jokes.
  Authorization: Bearer Token (Admin or Authenticated User)
  Request body: { "jokeId": id, "userId": id }
  Response: { "message": "UserJoke connected successfully", "joke": { joke properties } }

- `DELETE /api/v1/users/{id}/jokes`
  Description: Removes a joke from the authenticated user's list of jokes.
  Authorization: Bearer Token (Admin or Authenticated User)
  Request body: { "jokeId": id, "userId": id }
  Response: { "message": "UserJoke deleted successfully", "result": { userjoke properties } }

### Testing

Run `npm test` to run automated local tests and generate a coverage report. After running tests, run `npm run report` to view the coverage report in a browser.

Jest test suites are also run prior to build, and will cause the build to fail if any tests fail or code coverage falls below the minimum threshold configured in `jest.config.js`.

A suite of Postman API tests has been created to send a set of live http requests to the local server. Run `npm run postman:test` to start this test suite. An API key is required -- ask Justin if you would like it shared with you for testing.

---

## Project Structure

- `src/`: Contains the source code of the API.
  - `controllers/`: Contains the controller functions for handling requests to various endpoints.
  - `middleware/`: Contains middleware functions for handling tasks such as authentication and authorization.
  - `routes/`: Contains the route definitions for the API.
  - `util/`: Contains utility functions used throughout the project.
  - `__tests__/`: Contains the test files for the API.
- `prisma/`: Contains the Prisma schema and migration files.
- `db/`: Contains scripts for seeding the database with test data.

### Key Files

- `src/index.ts`: The entry point of the API.
- `prisma/schema.prisma`: The Prisma schema file, which defines the structure of the database.
- `db/seedTestData.ts`: A script for seeding the database with test data.
