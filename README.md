# DRAFT DRAFT DRAFT

# Jokes API

This is a REST API built with Node.js, Express, and Prisma. It provides endpoints for accessing a database collection of dad jokes. Authenticated users can add jokes to a personal list of favorites. Authenticated admins can also add or remove jokes from the database, and remove users.

[TOC]

---

## 🛠️ Technology Used

| Technology                                | Use                       |
| ----------------------------------------- | ------------------------- |
| [Jest](https://jestjs.io/)                | Unit & End-to-End testing |
| [JWT](https://jwt.io/)                    | Authentication            |
| [PostgreSQL](https://www.postgresql.org/) | Relational Data Store     |
| [MORE TK](LINK TK)                        | MORE TK                   |

---

## 💻 Running Locally

#### Assumptions

1. Postgres is running locally
2. Node is installed locally (v18^)

### Setup

1. Clone the repository.
2. Create a .env file in the project root directory, modeled on the included `.env.sample`
3. Run `npm install` to install the dependencies.
4. Run `npm run db:model` to generate the prisma models.
5. Run `npm run db:build` to apply the database migrations.
6. Run `npm run db:seed` to seed the database with sample data.
7. Run `npm run build` to compile the Typescript code after passing all Jest tests.
8. Run `npm run start` to start the API server.

### Testing

Run `npm test` to run automated local tests and generate a coverage report. After running tests, run `npm run report` to view the coverage report in a browser.

Jest test suites are also run prior to build, and will cause the build to fail if any tests fail or code coverage falls below the minimum threshold configured in `jest.config.js`.

A suite of Postman API tests has been created to send a full suite of live http requests to the local server. Run `npm run postman:test` to start this test suite. An API key is required -- ask Justin if you would like it shared with you for testing.

##

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

## Key Files

- `src/index.ts`: The entry point of the API.
- `prisma/schema.prisma`: The Prisma schema file, which defines the structure of the database.
- `db/seedTestData.ts`: A script for seeding the database with test data.

## API Endpoints

- `GET /api/v1/users`
- `GET /api/v1/jokes/:id`: Fetches a joke.
- `GET /api/v1/users/:id`: Fetches the details of a user.
- `GET /api/v1/users/:id/jokes`: Fetches all jokes associated with a user.
- `POST /api/v1/jokes`: Adds a new joke.
- MORE TK
