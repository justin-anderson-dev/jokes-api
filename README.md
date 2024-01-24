# DRAFT DRAFT DRAFT

# Jokes API

This is a REST API built with Node.js, Express, and Prisma. It provides endpoints for accessing a database collection of dad jokes. Authenticated users can add jokes to a personal list of favorites.

## Project Structure

- `src/`: Contains the source code of the API.
  - `controllers/`: Contains the controller functions for handling requests to various endpoints.
  - `middleware/`: Contains middleware functions for handling tasks such as authentication and authorization.
  - `routes/`: Contains the route definitions for the API.
  - `util/`: Contains utility functions used throughout the project.
  - `__tests__/`: Contains the test files for the API.
- `prisma/`: Contains the Prisma schema and migration files.
- `db/`: Contains scripts for seeding the database with test data.

## Key Files

- `src/index.ts`: The entry point of the API.
- `prisma/schema.prisma`: The Prisma schema file, which defines the structure of the database.
- `db/seedTestData.ts`: A script for seeding the database with test data.

## Key Endpoints

- `GET /users/:id`: Fetches the details of a user.
- `GET /jokes/:id`: Fetches the details of a joke.
- `GET /users/:id/jokes`: Fetches all jokes associated with a user.
- `POST /jokes`: Adds a new joke.

## Setup

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Run `npx prisma migrate dev` to apply the database migrations.
4. Run `npm run dev` to start the development server.

## Testing

Run `npm test` to run the tests. Jest test suites are also run prior to build, and will cause the build to fail if any tests fail or code coverage falls below the minimum threshold configured in `jest.config.js`.

##
