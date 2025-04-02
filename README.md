![Static Badge](https://img.shields.io/badge/npm-10.9.0-blue)
![Static Badge](https://img.shields.io/badge/License-MIT-green)
![Static Badge](https://img.shields.io/badge/Version-1.0.0-green)

# Simple Library API

## Description

This repository contains a **RESTful** API, written using Nest.js. It is a simple Library Management Program, which allows users to perform CRUD operations on books and authors. This API also has authentication and admin functionalities written as well. For a database solution, SQLite 3 was chosen along with TypeORM for tight integration with the rest part. The project aims to demonstrate best practices in REST API development, authentication, and database modeling.

## Features

- Full CRUD Management for the Book resources
  - Only POST, PATCH and DELETE endpoints require user authentication
- Full CRUD Management for the Author resources
  - Only POST, PATCH and DELETE endpoints require user authentication
- Authentication and Authorization
- Full Admin Functionality
- ENV Configuration Support
- Full Request Body Validation
- API Documentation Using Swagger UI

## Used Packages And Tools

- **Nest.js**
- **TypeScript**
- **TypeORM**
- **SQLite**
- **JWT**
- **class-transformer**
- **class-validator**
- **Bcrypt**
- **Swagger UI**

## Environment Variables

These environment variables must be set up in `.env`, which is crucial for the server functionality.

_Note: This file must be present in project's root directory._

- `DATABASE_NAME_PATH` - Specifies a name and path of the sqlite database.
- `JWT_MODULE_SECRET` - Secret, which is used to generated encrypted JWT Tokens. **DO NOT SHOW THIS KEY TO ANYONE!**
- `ADMIN_NAME` - Name of the generated admin account
- `ADMIN_EMAIL` - Email of the generated admin account
- `ADMIN_PASSWORD` - Password of the generated admin account
- `JWT_TOKEN_EXPIRATION_SECONDS` - Expiration time of the JWT Token. **Must be written in this syntax: "600s"**
- `MAX_ITEMS_ON_PAGE` - Maximum amount of items on one page in paginated result.

## Project setup

Install required packages:

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Endpoints:

### Books

- `GET /books` - Get All Books
- `POST /books` - Add New Book (JWT Auth)
- `GET /books/:id` - Get Specific Book
- `PATCH /books/:id` - Update Specific Book Details (JWT Auth)
- `DELETE /Book/:id` - Delete Specific Book (JWT Auth)

### Authors

- `GET /authors` - Get All Authors
- `POST /authors` - Add New Author (JWT Auth)
- `GET /authors/:id` - Get Specific Author
- `PATCH /authors/:id` - Update Specific Author Details (JWT Auth)
- `DELETE /authors/:id` - Delete Specific Author (Admin Only) (JWT Auth)

### Authentication

- `POST /auth/register` - User Registration
- `POST /auth/login` - User Login (JWT Auth)

### Admin

- `GET /admin/users` - List Registered Users (Admin Only) (JWT Auth)
- `GET /admin/users/:id` - List Registered Specific User (Admin Only) (JWT Auth)
- `PATCH /admin/users/:id` - Change Specific User Details (Admin Only) (JWT Auth)
- `PATCH /admin` - Change admin account details (Admin Only) (JWT Auth)
- `DELETE /admin/users/:id` - Delete Specific User (Admin Only) (JWT Auth)

### Swagger Documentation

- `/docs` - Show SwaggerUI Documentation

## License

This project is licensed under **MIT License.**

## Credits

Thank you for showing your interest and checking out this project. Be sure to check out my other projects on [my Github account](https://github.com/Chantuu).
