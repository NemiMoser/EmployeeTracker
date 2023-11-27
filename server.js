import inquirer from 'inquirer';
import express from 'express';
import mysql from 'mysql2';

const app = express();
const PORT = process.env.PORT || 3001;

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Tommy@613',
        database: 'employees_db',
    },
);


//Inquirer
function viewDepartments() {
    connection.query('SELECT department_name, department_id FROM departments', (err, res) => {
        if (err) throw err;
        console.log('\nDepartments:');
        console.table(res, ['department_name', 'department_id']);
        displayMenu();
    });
}

function viewRoles() {
    connection.query('SELECT title, role_id, department_id, salary FROM roles', (err, res) => {
        if (err) throw err;
        console.log('\nRoles:');
        console.table(res);
        displayMenu();
    })
}

function viewEmployees() {
    connection.query('SELECT e.employee_id, e.first_name, e.last_name, r.title, d.department_name AS department, r.salary, e2.first_name AS manager FROM employees e LEFT JOIN employees e2 ON e.manager_id = e2.employee_id JOIN roles r ON e.role_id = r.role_id JOIN departments d ON r.department_id = d.department_id', (err, res) => {
        if (err) throw err;
        console.log('\nEmployees:');
        console.table(res);
        displayMenu();
    });
}

function viewEmployeesByDepartment() {
    connection.query('SELECT department_name FROM departments', (err, departments) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'selectedDepartment',
                    message: 'Select a department to view employees:',
                    choices: departments.map((department) => department.department_name),
                },
            ])
            .then((departmentAnswer) => {
                const selectedDepartment = departmentAnswer.selectedDepartment;

                connection.query('SELECT e.first_name, e.last_name, r.title AS role, d.department_name AS department FROM employees e JOIN roles r ON e.role_id = r.role_id JOIN departments d ON r.department_id = d.department_id WHERE d.department_name = ?', selectedDepartment, (err, res) => {
                    if (err) throw err;
                    console.log(`\nEmployees in the ${selectedDepartment} department:`);
                    console.table(res);
                    displayMenu();
                });
            });
    });
}



//Adding department, role, employees
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department_name',
                message: 'Enter the department name:',
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'Enter an ID for this department:',
            }
        ])
        .then((answers) => {
            const { department_name, department_id } = answers;
            const query = 'INSERT INTO departments (department_name, department_id) VALUES (?, ?)';

            connection.query(query, [department_name, department_id], (err, res) => {
                if (err) throw err;
                console.log('Department added successfully!');
                displayMenu();
            });
        });
}

function addRole() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title for this role:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for this role:',
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'Enter the department ID for this role:',
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Enter an ID for this role:',
        }
    ])
    .then((answers) => {
        const { title, salary, department_id, role_id } = answers;
        const query = 'INSERT INTO roles (title, salary, department_id, role_id) VALUES (?, ?, ?, ?)';

        connection.query(query, [title, salary, department_id, role_id], (err, res) => {
            if (err) throw err;
            console.log('Role added successfully!');
            displayMenu();
        });
    });
}

function addEmployee() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'employee_id',
            message: 'Enter the ID for this employee:',
        },
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the employee:',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the employee:',
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Enter the role ID for this employee:',
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Enter the manager ID for this employee:',
        },
    ])
    .then((answers) => {
        const { employee_id, first_name, last_name, role_id, manager_id } = answers;
        const query = 'INSERT INTO employees (employee_id, first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?, ?)';

        connection.query(query, [employee_id, first_name, last_name, role_id, manager_id], (err, res) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            displayMenu();
        });
    });
}


//Update an employee role
function getEmployeesWithRoles(callback) {
    connection.query('SELECT e.employee_id, e.first_name, e.last_name, r.role_id, r.title FROM employees e INNER JOIN roles r ON e.role_id = r.role_id', (err, res) => {
        if (err) throw err;
        callback(res);
    });
}

function updateEmployeeRole() {
    getEmployeesWithRoles((employees) => {
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select the employee to update:',
                choices: employees.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee,
                })),
            },
        ])
        .then((employeeAnswer) => {
            const selectedEmployee = employeeAnswer.employee;

            connection.query('SELECT role_id, title FROM roles', (err, roleResults) => {
                if (err) throw err;

            inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'newRole',
                    message: 'Select the new role for the employee:',
                    choices: roleResults.map((role) => ({
                        name: role.title,
                        value: role.role_id,
                    })),
                },
            ])
            .then((roleAnswer) => {
                const { newRole } = roleAnswer;
                const query = 'UPDATE employees SET role_id = ? WHERE employee_id = ?';

                connection.query(query, [newRole, selectedEmployee.employee_id], (err, res) => {
                    if (err) throw err;
                    console.log('Epmloyee role updated successfully!');
                    displayMenu();
                });
            });
        });
    });
});
}

//update employee manager
function updateEmployeeManager() {
    getEmployeesWithRoles((employees) => {
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select the employee to update:',
                choices: employees.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee,
                })),
            },
            {
                type: 'list',
                name: 'newManager',
                message: 'Select the new manager for the employee',
                choices: employees.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.employee_id,
                })),
            },
        ])
        .then((managerAnswer) => {
            const { newManager} = managerAnswer;
            const selectedEmployee = managerAnswer.employee;

            const query = 'UPDATE employees SET manager_id = ? WHERE employee_id = ?';
            
            connection.query(query, [newManager, selectedEmployee.employee_id], (err, res) => {
                if (err) throw err;
                console.log('Employee manager updated successfully!');
                displayMenu();
            });
        });
    });
}


//Display Menu
function displayMenu() {
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'menuChoice',
            message: 'Choose an option',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'View employees by department',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update employee manager',
                'Exit',
            ],
        },
    ])
    .then((answers) => {
        switch (answers.menuChoice) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'View employees by department':
                viewEmployeesByDepartment();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Update employee manager':
                updateEmployeeManager();
                break;
            case 'Exit':
                connection.end();
                break;
            default:
                console.log('Invalid choide. Please try again.');
                displayMenu();
                break;
        }
    });
}

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
    displayMenu();
});


//fetch departments
app.get('/api/departments', (req, res) => {
    db.query('SELECT * FROM departments', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error'});
        } else {
            res.json(results);
        }
    });
});

//fetch roles
app.get('/api/roles', (req, res) => {
    db.query('SELECT * FROM roles', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error'});
        } else {
            res.json(results);
        }
    });
});

//fetch employees
app.get('/api/employees', (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error'});
        } else {
            res.json(results);
        }
    });
});


//listen
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});