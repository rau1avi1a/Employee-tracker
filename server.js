const inquirer = require('inquirer');
const mysql = require('mysql2');

async function displayDepartments() {
    //connect to mysql
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
    ]

    const results = await inquirer.prompt([{
        message: 'What would you liike to do?',
        name: 'choice',
        type: 'list',
        choices: options,
    }])
    if (results == 'View All Departments') {
        displayDepartments();
        handleOptions();
    } 
}

handleOptions();