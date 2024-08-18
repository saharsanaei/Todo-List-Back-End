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
