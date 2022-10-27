const {prompt} = require('inquirer');
const {
    getDepartments,
    getRoles,
    getEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
} = require('./db-query');

const viewDepartments = async () =>
    console.table(await getDepartments());

const viewEmployees = async () =>
    console.table(await getEmployees());

const viewRoles = async () =>
    console.table(await getRoles());

const addDepartmentPrompt = async () => {
    const {department} = await prompt({
        name: 'department',
        message: 'Enter your department name:'
    });

    await addDepartment(department);
    console.log('Department added');
    await viewDepartments();
}

const addRolePrompt = async () => {
    const departments = (await getDepartments()).map(department => ({
        name: department.name,
        value: department.id,
    }));

    const {
        roleName,
        roleSalary,
        roleDepartment,
    } = await prompt([
        {
            name: 'roleName',
            message: 'Enter the name of your role:',
        },
        {
            name: 'roleSalary',
            message: 'Enter the salary for your role:',
        },
        {
            type: 'list',
            name: 'roleDepartment',
            message: 'Enter the department for your role:',
            choices: departments,
        },
    ]);

    await addRole([roleName, roleSalary, roleDepartment]);
    await viewRoles();
};

const addEmployeePrompt = async () => {
    
    const roles = (await getRoles()).map(role => ({
        name: role.title,
        value: role.id,
    }));

    const managers = (await getEmployees()).map(employee => ({
        name: employee.first_name + ' ' + employee.last_name,
        value: employee.id,
    }));

    const {
        roleOption,
        manager,
        firstName,
        lastName,
    } = await prompt([
        {
            name: 'firstName',
            message: "Enter the employee's first name:",
        },
        {
            name: 'lastName',
            message: "Enter the employee's last name:",
        },
        {
            type: 'list',
            name: 'roleOption',
            message: 'Enter employee role:',
            choices: roles
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Select a manager for the employee:',
            choices: managers
        }
    ]);

    await addEmployee([firstName, lastName, roleOption, manager]);
    await viewEmployees();
};

const updateEmployeeRolePrompt = async () => {

    const employees = (await getEmployees()).map(employee => ({
        name: employee.first_name + ' ' + employee.last_name,
        value: employee.id,
    }));

    const roles = (await getRoles()).map(role => ({
        name: role.title,
        value: role.id,
    }));

    const {
        employeeOption,
        roleOption,
    } = await prompt([
        {
            type: 'list',
            name: 'employeeOption',
            message: 'Select an employee to update:',
            choices: employees
        },
        {
            type: 'list',
            name: 'roleOption',
            message: 'Please assign a new role:',
            choices: roles
        }
    ]);

    await updateEmployeeRole([roleOption, employeeOption]);
    await viewEmployees();
};

module.exports = {
    viewDepartments,
    viewEmployees,
    viewRoles,
    addDepartmentPrompt,
    addRolePrompt,
    addEmployeePrompt,
    updateEmployeeRolePrompt
}