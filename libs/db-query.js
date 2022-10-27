const connection = require('../config/connection');

const promiseQuery = async (queryStatement, ...args) =>
    (await connection.promise().execute(queryStatement, ...args))[0];

const getDepartments = () =>
    promiseQuery('SELECT * FROM department');

const getEmployees = () =>
    promiseQuery('SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, role.salary AS salary, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id');

const getRoles = () =>
    promiseQuery('SELECT role.id, role.title, role.salary, department.name As department_name FROM role LEFT JOIN department ON role.department_id = department.id');

const addDepartment = name =>
    promiseQuery('INSERT INTO department (name) VALUES (?)', [name]);

const addRole = options =>
    promiseQuery('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', options);

const addEmployee = options =>
    promiseQuery('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', options);

const updateEmployeeRole = options => 
    promiseQuery('UPDATE employee SET role_id = ? WHERE id = ?', options);

module.exports = {
    getDepartments,
    getEmployees,
    getRoles,
    addDepartment,
    addRole, 
    addEmployee,
    updateEmployeeRole,
};