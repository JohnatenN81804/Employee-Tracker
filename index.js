const inquirer = require("inquirer");
const {
  listAllDepartments,
  listAllRoles,
  listAllEmployees,
  addDepartment,
  findDepartmentId,
  addRole,
  findRoleId,
  findEmployeeId,
  addEmployee,
  updateEmployeeRole,
} = require("./lib/queries");
const { displayTable } = require("./lib/displays");


function startApp() {
  inquirer.prompt([
    {
      type: "list",
      message: "Select an action:",
      name: "option",
      choices: [
        "View all Departments",
        "View all Roles",
        "View all Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update Employee Role",
        "Quit",
      ],
    },
  ]).then(handleUserChoice);
}

function handleUserChoice(response) {
  switch (response.option) {
    case "View all Departments":
      viewDepartments();
      break;

    case "View all Roles":
      viewRoles();
      break;

    case "View all Employees":
      viewEmployees();
      break;

    case "Add a Department":
      createNewDepartment();
      break;

    case "Add a Role":
      createNewRole();
      break;

    case "Add an Employee":
      createNewEmployee();
      break;

    case "Update Employee Role":
      updateEmployeeRolePrompt();
      break;

    default:
      exitApp();
      break;
  }
}

function viewDepartments() {
  listAllDepartments().then(([rows]) => {
    displayTable(rows);
    startApp();
  });
}

function viewRoles() {
  listAllRoles().then(([rows]) => {
    displayTable(rows);
    startApp();
  });
}

function viewEmployees() {
  listAllEmployees().then(([rows]) => {
    displayTable(rows);
    startApp();
  });
}

function createNewDepartment() {
  inquirer.prompt([
    {
      type: "input",
      message: "Enter the name of the new department:",
      name: "departmentName",
    },
  ]).then((response) => {
    addDepartment(response).then(() => {
      listAllDepartments().then(([rows]) => {
        displayTable(rows);
        console.log(`${response.departmentName} Department added to the database.`);
        startApp();
      });
    });
  });
}

const createNewRole = () => {
  db.query("SELECT * FROM department;")
    .then(([departments]) => {
      const departmentChoices = departments.map(({ id, name }) => ({
        name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "input",
            message: "Enter the title of the new role:",
            name: "roleTitle",
          },
          {
            type: "input",
            message: "Enter the salary for the new role:",
            name: "roleSalary",
          },
          {
            type: "list",
            message: "Select the department for the new role:",
            name: "roleDepartment",
            choices: departmentChoices,
          },
        ])
        .then((response) => addRoleToDatabase(response))
        .then(() => listAllRoles())
        .then(([rolesList]) => {
          displayTable(rolesList);
          start();
        })
        .catch((error) => {
          console.error(error);
        });
    });
};

const createNewEmployee = () => {
  db.query("SELECT * FROM role")
  .then(([rolesResult]) => {
    const roleChoices = rolesResult.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    db.query("SELECT * FROM employee")
      .then(([employeesResult]) => {
        const managerChoices = employeesResult.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "input",
              message: "Enter the new employee's first name:",
              name: "firstName",
            },
            {
              type: "input",
              message: "Enter the new employee's last name:",
              name: "lastName",
            },
            {
              type: "list",
              message: "Select the role for the new employee:",
              name: "employeeRole",
              choices: roleChoices,
            },
            {
              type: "list",
              message: "Select the manager for the new employee:",
              name: "employeeManager",
              choices: managerChoices,
            },
          ])
          .then((answers) => addNewEmployeeToDatabase(answers))
          .then(() => listAllEmployees())
          .then(([employeeList]) => {
            displayTable(employeeList);
            start();
          });
      });
  });
};

const updateEmployeeRolePrompt = () => {
  listAllEmployees()
  .then(([employeeRows]) => {
    const employeeChoices = employeeRows.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          message: "Select an employee to update their role:",
          name: "employeeId",
          choices: employeeChoices,
        },
      ])
      .then((response) => {
        const employeeId = response.employeeId;
        listAllRoles()
          .then(([roleRows]) => {
            const roleChoices = roleRows.map(({ id, title }) => ({
              name: title,
              value: id,
            }));
            inquirer
              .prompt([
                {
                  type: "list",
                  message: "Select the new role for the employee:",
                  name: "newRoleId",
                  choices: roleChoices,
                },
              ])
              .then((roleResponse) => {
                const newRoleId = roleResponse.newRoleId;
                updateEmployeeRoleInDatabase(employeeId, newRoleId)
                  .then(() => listAllEmployees())
                  .then(([updatedEmployeeList]) => {
                    displayTable(updatedEmployeeList);
                    start();
                  });
              });
          });
      });
  }) 
};

function exitApp() {
  console.log("Exiting the application...");
  process.exit(0);
}

startApp();
