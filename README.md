# Task Management API

This is a RESTful API for a task management application built with Node.js, Express, and PostgreSQL.

## Features

- User authentication (register, login)
- CRUD operations for tasks
- Category management
- Progress tracking (daily and weekly)

## Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose

## Getting Started

1. Clone the repository:
git clone https://github.com/saharsanaei/Todo-List-Back-End.git 
cd Todo-List-Back-End

2. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:
JWT_SECRET=your_jwt_secret
PGHOST=db
PGDATABASE=your_database_name
PGUSER=your_database_user
PGPASSWORD=your_database_password
PGPORT=5432
PORT=3000

3. Build and run the Docker containers:
docker-compose up --build

The API will be available at `http://localhost:3000`.

## API Endpoints

### Users
- POST /users/register - Register a new user
- POST /users/login - Login a user
- POST /users/verify-token - Verify a JWT token

### Tasks
- GET /tasks - Get all tasks for the authenticated user
- GET /tasks/:id - Get a specific task
- POST /tasks - Create a new task
- PUT /tasks/:id - Update a task
- DELETE /tasks/:id - Delete a task
- PUT /tasks/:id/complete - Mark a task as completed

### Categories
- POST /categories - Create a new category
- GET /categories - Get all categories for the authenticated user
- DELETE /categories/:id - Delete a category
- PUT /categories/:id - Update a category

### Progress
- GET /progress - Get daily and weekly progress for the authenticated user

## Authentication

All endpoints except `/users/register` and `/users/login` require authentication. Include the JWT token in the Authorization header:
Authorization: Bearer your_jwt_token

## SQL category
CREATE TABLE IF NOT EXISTS Category (
    category_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "User" (user_id)
);

## SQL progress
CREATE TABLE IF NOT EXISTS Progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    weekly_progress INTEGER,
    daily_progress INTEGER,
    date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    task_id INTEGER,
    FOREIGN KEY (task_id) REFERENCES Task (task_id),
    FOREIGN KEY (user_id) REFERENCES "User" (user_id)
);

## SQL task
CREATE TABLE Task (
    task_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    priority INTEGER,
    category_id INTEGER,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "User" (user_id),
    FOREIGN KEY (category_id) REFERENCES Category (category_id)
);

## SQL user
CREATE TABLE IF NOT EXISTS "User" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

## Error Handling

The API uses appropriate HTTP status codes and returns error messages in JSON format.

## Development

To run the application in development mode:

1. Install dependencies:
npm install

2. Start the development server:
npm run dev

## Testing

(Add information about running tests when you implement them)

## Deployment

The application is containerized using Docker, making it easy to deploy to various platforms. Adjust the `Dockerfile` and `docker-compose.yml` as needed for your deployment environment.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.