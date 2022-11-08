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
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
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
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployee();
                    break;
            }
    
        })
    }

    function allDepartments(){
        db.promise().query("SELECT * FROM department")
        .then(([rows]) => {
            const departmentArray = rows;
            console.table(departmentArray);
        })
        .then(() => optionSelect())
    }
    
    function allRoles(){
        db.promise().query(`SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        LEFT JOIN department ON role.department_id = department.id
        ORDER BY role.id`)
        .then(([rows]) => {
            const roleArray = rows;
            console.table(roleArray);
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
            const employeeArray = rows;
            console.table(employeeArray);
        })
        .then(() => optionSelect())
    }
    
    function addEmployee(){
        let roleArray = [];
        let managerArray = ["None"];
        
        db.query(`SELECT title FROM role`, (err, result1) => {
            if (err) console.error(err);
            result1.forEach(role => roleArray.push(role.title));
            
            db.query(`SELECT CONCAT(employee.first_name, " ", employee.last_name) AS manager_name FROM employee`, (err, result2) => {
                if (err) console.error(err);
                result2.forEach(manager => managerArray.push(manager.manager_name));
                
                inquirer.prompt([
                    {
                        name: "employeeFirstName",
                        type: "input",
                        message: "Enter employee's first name",
                    },
                    {
                        name: "employeeLastName",
                        type: "input",
                        message: "Enter employee's last name",
                    },
                    {
                        name: "employeeRole",
                        type: "list",
                        message: "Enter employee's role",
                        choices: roleArray,
                    },
                    {
                        name: "employeeManager",
                        type: "list",
                        message: "Enter employee's manager",
                        choices: managerArray,
                    },
                ])
                .then((response) => {
                    if (response.employeeManager === "None"){ 
                        db.promise().query(`INSERT INTO employee (first_name, last_name, role_id)
                        VALUES (?, ?, (SELECT id FROM role WHERE title = ?))`, 
                        [response.employeeFirstName, response.employeeLastName, response.employeeRole])

                        .then(() => optionSelect())
                    } else{ 
                        db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?,?, 
                        (SELECT id FROM role WHERE title = ?), 
                        (SELECT id FROM employee manager WHERE CONCAT(first_name, " ", last_name) = ?));`, 
                        [response.employeeFirstName, response.employeeLastName, response.employeeRole, response.employeeManager])

                        .then(() => optionSelect())
                    }
                })
            })
        })
    }

    function updateEmployee(){
        let employeeArray = [];
        let roleArray = [];
        db.query(`SELECT CONCAT(first_name, " ", last_name) AS name FROM employee`, (err, result1) => {
            if (err) console.error(err)
            result1.forEach(employee => employeeArray.push(employee.name));
    
            db.query(`SELECT title FROM role`, (err, result2) => {
                if(err) console.error(err)
                result2.forEach(role => roleArray.push(role.title));
    
                inquirer.prompt([
                    {
                        name: "updatedEmployeeName",
                        type: "list",
                        message: "Which employee's role do you want to update?",
                        choices: employeeArray,
                    },
                    {
                        name: "updatedEmployeeRole",
                        type: "list",
                        message: "Which role do you want to assign the selected employee?",
                        choices: roleArray,
                    }
                ])
                .then((response) => {
                    params = [response.updatedEmployeeRole, response.updatedEmployeeName];
                    db.promise().query(`UPDATE employee 
                    SET role_id = (SELECT id FROM role WHERE title = ?)
                    WHERE CONCAT(first_name, " ", last_name) = ?`, params)

                    .then(() => optionSelect())
                })
            })
        })
    }
    
    function addRole(){
        db.query('SELECT name FROM department', (err, result) =>{
            if (err){
                console.error(err);
            } else{
                inquirer.prompt([
                    {
                        name: "roleName",
                        type: "input",
                        message: "Enter name of role",
                    },
                    {
                        name: "roleSalary",
                        type: "input",
                        message: "Enter salary of the role",
                    },
                    {
                        name: "roleDepartment",
                        type: "list",
                        message: "Which department does the role belong to?",
                        choices: result,
                    }
                ]).then((response) => {
                    if (response){
                        const params = [response.roleName, response.roleSalary, response.roleDepartment];
                        db.promise().query(`INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, (SELECT id FROM department WHERE name = ?))`, params)
                        .then(() => {
                            console.log(`Added ${response.roleName} to the database.`);
                        })
                        .then(() => optionSelect())
                    } 
                    
                })
            }
        });
    
    }
    
    function addDepartment(){
        inquirer.prompt(
            {
                name: "departmentName",
                type: "input",
                message: "What is the name of the department?",
            }
        )
        .then((response) => {
            if (response.departmentName){
                db.promise().query(`INSERT INTO department (name) VALUES (?)`, response.departmentName)
                .then(() => {
                    console.log(`Added ${response.departmentName} to the database`);
                })
                .then(() => optionSelect())
            } 

        })
    }
    
    optionSelect();