INSERT INTO departments (department_id, department_name)
VALUES
    (1, "HR"),
    (2, "Finance"),
    (3, "Engineering");

INSERT INTO roles (role_id, title, salary, department_id)
VALUES
    (1, "HR Manager", 60000.00, 1),
    (2, "Financial Analyst", 55000.00, 2),
    (3, "Software Manager", 90000.00, 3),
    (4, "Software Engineer", 80000.00, 3),
    (5, "Accounting Manager", 80000.00, 2),
    (6, "HR Assistant", 50000, 1);

INSERT INTO employees (employee_id, first_name, last_name, title, manager_id)
VALUES 
    (2, "Cody", "Moser", 3, NULL),
    (3, "Victor", "Buelna", 5, NULL),
    (4, "Mimi", "Rojas", 1, NULL),
    (1, "Nohemi", "Moser", 4, 2),
    (5, "Hugo", "Buelna", 6, 4),
    (6, "Woody", "Moser", 2, 3);