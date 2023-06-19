const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'luna',
        database: 'employees_db'
    },
    console.log('Connected to the employee database...')
);


//done.. this function displays departments
function displayDepartments() {
    console.log('Viewing all departments...');

    const sql = 'SELECT name AS department FROM department'

    db.query(sql, function (err, results) {
        console.table(results);
      });
};

//done.. this function displays roles
function displayRoles() {
    console.log('Viewing all roles...')

    const sql = 'SELECT title, salary FROM role JOIN department ON role.department_id = department.id'

    db.query(sql, function (err, results) {
        console.table(results);
      });
};

//this function displays employees
function displayEmployees() {
    console.log('Viewing all employees...')

    const sql = 'SELECT first_name, last_name, manager_id FROM employee JOIN role ON employee.role_id = role.id'

    db.query(sql, function (err, results) {
        console.table(results);
      });
};

//this function adds a department
async function addDepartment() {
    const params = await inquirer.prompt([{
        message: 'What department would you like to add?',
        name: 'department',
        type: 'input'
    }]);

    const sql = 'INSERT INTO department (name) VALUES (?)'

    db.query(sql, params, (err, results) => {
        console.table(results);
    });

};

//this function adds a role
function addRole() {

};

//this function adds an employee
function addEmployee() {

};

//this function updates employee information
function updateEmployee() {

};

//init function
async function handleOptions() {

    const options = [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role'
    ];

    const results = await inquirer.prompt([{
        message: 'What would you like to do?',
        name: 'choice',
        type: 'list',
        choices: options,
    }]);

    if (results.choice == 'View All Departments') {
        displayDepartments();
        handleOptions();
    } else if (results.choice == 'View All Roles') {
        displayRoles();
        handleOptions();
    } else if (results.choice == 'View All Employees') {
        displayEmployees();
        handleOptions();
    } else if (results.choice == 'Add Department') {
        addDepartment();
        handleOptions();
    } else if (results.choice == 'Add Role') {
        addRole();
        handleOptions();
    } else if (results.choice == 'Add Employee') {
        addEmployee();
        handleOptions();
    } else if (results.choice == 'Update Employee Role') {
        updateEmployee();
        handleOptions();
    }
};

handleOptions();