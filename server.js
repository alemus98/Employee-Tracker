require('console.table');
const {prompt} = require('inquirer');
const dbRender = require('./libs/db-render');

const getOptionsInfo = async () => {
    return prompt ({
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: [
            {
                name: "View all Departments.",
                value: "listDepartments"
            },
            {
                name: "View all Roles.",
                value: "listRoles"
            },
            {
                name: "View all Employees",
                value: "listEmployees"
            },
            {
                name: "Add a Department",
                value: "addDepartment"
            },
            {
                name: "Add a Role",
                value: "addRole"
            },
            {
                name: "Add an Employee",
                value: "addEmployee"
            },
            {
                name: "Update Employee Role",
                value: "updateEmployeeRole"
            },
            {
                name: "Exit",
                value: "exit"
            }
        ]
    });
};

const init = async () => {
    while (true) {
        
        const {option} = (await getOptionsInfo());

        if (option === 'exit') {
            console.log('Goodbye.');
            return;
        }

        const renderOption = dbRender[option];
        if (renderOption) await renderOption();
    }
}