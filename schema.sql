-- schema.sql
-- Drop tables if they exist (clean slate)
DROP TABLE IF EXISTS tasks CASCADE;

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Insert sample data
INSERT INTO tasks (text, completed) VALUES 
    ('Set up PostgreSQL', false),
    ('Learn SQL basics', false),
    ('Design database schema', true);