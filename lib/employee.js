const database = require("./db");

class Employee {
    getAll(callback) {
        const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(e1.first_name, " ", e1.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee e1 ON e1.id = e.manager_id`;
        database.query(sql, (err, rows) => {
            if (err) {
                callback(err.message);
            } else {
                callback(null, rows)
            }
        });
    }

    getManagers(callback) {
        const sql = `SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee WHERE id IN (SELECT manager_id FROM employee)`;
        database.query(sql, (err, rows) => {
            if (err) {
                callback(err.message);
            } else {
                callback(null, rows)
            }
        });
    }

    addEmployee(first_name, last_name, role_id, manager_id) {
        if (manager_id === 0) manager_id = null
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_id})` ;
        database.query(sql, (err, rows) => {
            if (err) {
                console.log(err.message);
                return;
            }
        });
    }
    updateEmployeeRole(id, role_id) {
        const sql = ` UPDATE employee SET role_id = ${role_id} WHERE id = ${id}` ;
        database.query(sql, (err, rows) => {
            if (err) {
                console.log(err.message);
                return;
            }
        });
    }

}

module.exports = Employee;