DROP DATABASE IF EXISTS departments_db;
CREATE DATABASE departments_db;

DROP DATABASE IF EXISTS roles_db;
CREATE DATABASE roles_db;

DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    role_id INT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    title INT NOT NULL,
    department_id INT NOT NULL DEFAULT 1,
    FOREIGN KEY (title) REFERENCES roles(role_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    salary DECIMAL(10, 2) NOT NULL DEFAULT 1,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);