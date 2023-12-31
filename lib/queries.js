const inquirer = require("inquirer");
const connection = require("../config/connection");

function listAllDepartments() {
  return connection.promise().query("SELECT * FROM department;");
}

function listAllRoles() {
  return connection.promise().query(`
    SELECT role.id, role.title, role.salary, department.name AS deparment
    FROM role
    LEFT JOIN department ON role.department_id = department.id;
  `);
}

function listAllEmployees() {
  return connection.promise().query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,'',manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON manager.id = employee.manager_id;
  `);
}

function addDepartment(data) {
  return connection.promise().query("INSERT INTO department SET ?", {
    name: data.name
  });
}

function addRole(data) {
  return connection.promise().query("INSERT INTO role SET ?", {
    title: data.roleTitle,
    salary: data.roleSalary,
    department_id: data.roleDepartment
  });
}

function addEmployees(data) {
  return connection.promise().query("INSERT INTO employee SET ?", {
    first_name: data.firstName,
    last_name: data.lastName,
    role_id: data.employeeRole,
    manager_id: data.employeeManager
  });
}

function updateEmployeeRole(empId, roleId) {
  return connection.promise().query("UPDATE employee SET ? WHERE ?", [
    {
      role_id: roleId
    },
    {
      id: empId
    }
  ]);
}

module.exports = {
  listAllDepartments,
  listAllRoles,
  listAllEmployees,
  addDepartment,
  addRole,
  addEmployees,
  updateEmployeeRole
};
