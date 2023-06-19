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

async function displayDepartments() {

}

async function displayRoles() {

}

async function displayEmployees() {

}

async function addDepartment() {

}

async function addRole() {

}

async function addEmployee() {

}

async function updateEmployee() {

}

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
    }])
    if (results == 'View All Departments') {
        displayDepartments();
        handleOptions();
    } else if (results == 'View All Roles') {
        displayRoles();
        handleOptions();
    } else if (results == 'View All Employees') {
        displayEmployees();
        handleOptions();
    } else if (results == 'Add Department') {
        addDepartment();
        handleOptions();
    } else if (results == 'Add Role') {
        addRole();
        handleOptions();
    } else if (results == 'Add Employee') {
        addEmployee();
        handleOptions();
    } else if (results == 'Update Employee Role') {
        updateEmployee();
        handleOptions();
    }
};

handleOptions();