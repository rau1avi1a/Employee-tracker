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
        handleOptions();
    });

};

//done.. this function displays roles
function displayRoles() {
    console.log('Viewing all roles...')

    const sql = 'SELECT role.title AS title, role.salary AS salary, department.name AS department FROM role JOIN department ON role.department_id = department.id;'

    db.query(sql, function (err, results) {
        console.table(results);
        handleOptions();
      });
};

//done.. this function displays employees
function displayEmployees() {
    console.log('Viewing all employees...')

    const sql = 'SELECT e.first_name AS first_name, e.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, concat(m.first_name, " ", m.last_name) as manager FROM employee AS e INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee AS m ON e.manager_id = m.id;'

    
    db.query(sql, function (err, results) {
        console.table(results);
        handleOptions();
      });
};

//done.. this function adds a department
async function addDepartment() {
    const params = await inquirer.prompt([{
        message: 'What department would you like to add?',
        name: 'department',
        type: 'input'
    }]);

    const sql = 'INSERT INTO department (name) VALUES (?)'

    db.query(sql, params.department, (err, results) => {
        console.table("Department added to database");
        handleOptions();
    });
};

//done.. this function adds a role
async function addRole() {

    let departmentArr = [];
    const sqlDB = 'SELECT id, name FROM department';

    db.query(sqlDB, function (err, departments) {
        for (i=0; i < departments.length; i++) {
            departmentArr.push(departments[i].name)
        }
    });

    const params = await inquirer.prompt([{
        message: 'What role would you like to add?',
        name: 'title',
        type: 'input'
    },
    {
        message: 'What is the salary of this role?',
        name: 'salary',
        type: 'input'
    },
    {
        message: 'Which department does the role belong to?',
        name: 'dep',
        type: 'list',
        choices: departmentArr
    }
    ]);

    let depId;

    for (i=0; i < departmentArr.length; i++) {
        if (params.dep == departmentArr[i]) {
            depId = i+1;
            params.dep = depId;
        };
    };

    const dbParams = [
        [params.title, params.salary, params.dep]
    ];

    const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?)';

    db.query(sql, dbParams, (err, results) => {
        console.table("Role added to database");
        handleOptions();
    });

};

//done.. this function adds an employee
async function addEmployee() {

    let rolesArr = [];
    const sqlDB = 'SELECT id, title FROM role';

    db.query(sqlDB, function (err, roles) {
        for (i=0; i < roles.length; i++) {
            rolesArr.push(roles[i].title)
        }
    });

    let managerArr = [];
    const sqlM = 'SELECT concat(employee.first_name, " ", employee.last_name) AS name FROM employee;'

    db.query(sqlM, function (err, managers) {
        for (i=0; i < managers.length; i++) {
            managerArr.push(managers[i].name)
        }
        managerArr.push('None');
    });


    const params = await inquirer.prompt([{
        message: 'What is the first name of the employee?',
        name: 'first_name',
        type: 'input'
    },
    {
        message: 'What is the last name of the employee?',
        name: 'last_name',
        type: 'input'
    },
    {
        message: 'What is the role of this employee?',
        name: 'role',
        type: 'list',
        choices: rolesArr
    },

    {
        message: 'Who is the manager of this employee?',
        name: 'manager',
        type: 'list',
        choices: managerArr,
    }
    ]);

    let roleId;

    for (i=0; i < rolesArr.length; i++) {
        if (params.role == rolesArr[i]) {
            roleId = i+1;
            params.role = roleId;
        };
    };

    if (params.manager == 'None') {
        params.manager = null;
        
    } else {
        let managerId;

            for (i=0; i < managerArr.length; i++) {
                if (params.manager == managerArr[i]) {
                    managerId = i+1;
                    params.manager = managerId;
                };
            };
    }


    const dbParams = [
        [params.first_name, params.last_name, params.role, params.manager]
    ];

    const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)';

    db.query(sql, dbParams, (err, results) => {
        console.table("Employee added to database");
        handleOptions();
    });
};

//done.. this function updates employee information
async function updateEmployee() {

    let rolesArray = [];
    const sqlDB = 'SELECT id, title FROM role';

    db.query(sqlDB, function (err, roles) {
        for (i=0; i < roles.length; i++) {
            rolesArray.push(roles[i].title)
        }
    });

    let employeesArray = [];
    const sqlDB2 = 'SELECT concat(first_name, " ", last_name) AS name FROM employee;';

    db.query(sqlDB2, function (err, employees) {
        for (i=0; i < employees.length; i++) {
            employeesArray.push(employees[i].name)
        }
    });

    const params = await inquirer.prompt([
        {
            message: 'loading... (press enter)',
            name: 'loading'
        },
    {
        message: 'Select an employee to update role',
        name: 'employee',
        type: 'list',
        choices: employeesArray,
    },
    {
        message: 'Which role would you like to assign to this employee?',
        name: 'role',
        type: 'list',
        choices: rolesArray,
    },
    ]);

    let roleId;

    for (i=0; i < rolesArray.length; i++) {
        if (params.role == rolesArray[i]) {
            roleId = i+1;
            params.role = roleId;
        };
    };

    let employeeId;

    for (i=0; i < employeesArray.length; i++) {
        if (params.employee == employeesArray[i]) {
            employeeId = i+1;
            params.employee = employeeId;
        };
    };

    const sql = `UPDATE employee SET role_id = ${params.role} WHERE id = ${params.employee}`;

    db.query(sql, (err, results) => {
        console.table("Employee added to database");
        handleOptions();
    });





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
    } else if (results.choice == 'View All Roles') {
        displayRoles();
    } else if (results.choice == 'View All Employees') {
        displayEmployees();
    } else if (results.choice == 'Add Department') {
        addDepartment();
    } else if (results.choice == 'Add Role') {
        addRole();
    } else if (results.choice == 'Add Employee') {
        addEmployee();
    } else if (results.choice == 'Update Employee Role') {
        updateEmployee();
    }
};

handleOptions();