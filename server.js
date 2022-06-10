const inquirer = require('inquirer');
const Employee = require("./lib/employee");
const Role = require("./lib/role");
const Department = require("./lib/department");

const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Exit'
            ]
        }
    ])
        .then((answers) => {
            const { choices } = answers;
            if (choices === "View All Employees") {
                getAll(Employee);
            }
            if (choices === "Add Employee") {
                addEmployee();
            }
            if (choices === "Update Employee Role") {
                updateEmployee();
            }
            if (choices === "View All Roles") {
                getAll(Role);
            }
            if (choices === "Add Role") {
                addRole();
            }
            if (choices === "View All Departments") {
                getAll(Department);
            }
            if (choices === "Add Department") {
                addDepartment();
            }
            if (choices === "Exit") {
                process.exit();
            }
        });
}

getAll = (filterParam) => {
    let filter = new filterParam;
    filter.getAll(function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log(`\n`);
            console.table(data)
            console.log(`\n`);
            promptUser();
        }
    }
    );
}

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: "What is the name of the department?"
        }
    ])
        .then(answer => {
            let department = new Department;
            department.addDepartment(answer.newDepartment);
            console.log((`\nAdded ${answer.newDepartment} to the database`));
            promptUser();
        })
}

addRole = () => {
    var allDepartments = [];
    let department = new Department;
    department.getAll(function (err, data) {
        if (err) {
            console.log(err)
        } else {
            data.forEach(row => allDepartments.push({ name: row.name, value: row.id }));
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'newTitle',
                    message: "What is the name of the role?"
                },
                {
                    type: 'input',
                    name: 'newSalary',
                    message: "What is the salary of the role?"
                },
                {
                    type: 'list',
                    name: 'newDepartmentId',
                    message: "Which department does the role belong to?",
                    choices: allDepartments
                }
            ])
                .then(answer => {
                    let role = new Role;
                    role.addRole(answer.newTitle, answer.newSalary, answer.newDepartmentId);
                    console.log(`\nAdded ${answer.newTitle} to the database`);
                    promptUser();
                })
        }
    })
}

addEmployee = () => {
    var allRoles = [];
    let role = new Role;
    let employee = new Employee;
    role.getAll(function (err, data) {
        if (err) {
            console.log(err)
        } else {
            data.forEach(row => allRoles.push({ name: row.title, value: row.id }));
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "What is the employee's first name?"
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "What is the employee's last name?"
                },
                {
                    type: 'list',
                    name: 'roleID',
                    message: "What is the employee's role?",
                    choices: allRoles
                }
            ])
                .then(answer => {
                    const newEmployee = { first_name: answer.firstName, last_name: answer.lastName, role_id: answer.roleID };

                    employee.getManagers(function (err, data) {
                        if (err) {
                            console.log(err)
                        } else {
                            data.unshift({ value: 0, name: "None" });
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'newManagerId',
                                    message: "Who is the employee's manager?",
                                    choices: data
                                }
                            ])
                                .then(answer => {
                                    newEmployee.manager_id = answer.newManagerId;
                                    employee.addEmployee(newEmployee.first_name, newEmployee.last_name, newEmployee.role_id, newEmployee.manager_id);
                                    console.log(`\nAdded ${answer.firstName}` + " " + `${answer.lastName} to the database`);
                                    promptUser();
                                })
                        }
                    })
                })
        }
    })
}

updateEmployee = () => {
    var allEmployees = [];
    var allRoles = [];
    let role = new Role;
    let employee = new Employee;
    employee.getAll(function (err, data) {
        if (err) {
            console.log(err)
        } else {
            data.forEach(row => allEmployees.push({ name: row.first_name + " " + row.last_name, value: row.id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: "Which employee's role do you want to update?",
                    choices: allEmployees
                }
            ])
                .then(answer => {
                    const employeeId = answer.employeeId;

                    role.getAll(function (err, data) {
                        if (err) {
                            console.log(err)
                        } else {
                            data.forEach(row => allRoles.push({ name: row.title, value: row.id }));
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'roleID',
                                    message: "Which role do you want to assign the selected employee?",
                                    choices: allRoles
                                }
                            ])
                                .then(answer => {
                                    employee.updateEmployeeRole(employeeId, answer.roleID);
                                    console.log(`\n`);
                                    console.log("Employee's role updated.")
                                    console.log(`\n`);
                                    promptUser();
                                })
                        }
                    })
                })
        }
    })
}

promptUser();