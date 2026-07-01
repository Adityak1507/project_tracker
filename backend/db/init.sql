CREATE DATABASE IF NOT EXISTS project_tracker;
USE project_tracker;

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    target_date DATE NOT NULL,
    stage ENUM('start', 'on hold', 'completed', 'cancelled') NOT NULL DEFAULT 'start',
    sub_stage ENUM(
        'Requirement Analysis', 
        'Planning', 
        'Software Design', 
        'Software Development', 
        'Testing', 
        'Deployment', 
        'Maintenance'
    ) DEFAULT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
