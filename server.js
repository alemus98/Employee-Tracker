const db = require('./config/connection');
const inquirer = require('inquirer');
const table = require('console.table');

    function optionSelect(){
        inquirer.prompt(
            {
             name: "action",
             type: 'rawlist',
             message: "What would you like to do?",
             choices: [
                'View All Employees',
                'View All Departments',
                'View All Roles',
                "Quit"
             ]
            }
        )
        .then((response) => {

            switch(response.action){
                case "View All Employees":
                    allEmployees();
                    break;
                case "View All Roles":
                    allRoles();
                    break;
                case "View All Departments":
                    allDepartments();
                    break;

            }
    
        })
    }

    function allDepartments(){
        db.promise().query("SELECT * FROM department")
        .then(([rows]) => {
            const departments = rows;
            console.table(departments);
        })
        .then(() => optionSelect())
    }
    
    function allRoles(){
        db.promise().query(`SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        LEFT JOIN department ON role.department_id = department.id
        ORDER BY role.id`)
        .then(([rows]) => {
            const roles = rows;
            console.table(roles);
        })
        .then(() => optionSelect())
    }

    function allEmployees(){
        db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager_name
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employee.manager_id;`)
        .then(([rows]) => {
            const employees = rows;
            console.table(employees);
        })
        .then(() => optionSelect())
    }
    
    optionSelect();