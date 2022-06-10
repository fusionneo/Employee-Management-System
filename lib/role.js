const database = require("./db");

class Role {
    getAll(callback) {
        const sql = `SELECT r.id, r.title, d.name AS department, r.salary FROM role r LEFT JOIN department d ON r.department_id = d.id`;
        database.query(sql, (err, rows) => {
            if (err) {
                callback(err.message);
            } else {
                callback(null, rows)
            }
        });
    }
    
    addRole(title, salary, department_id) {
        const sql = `INSERT INTO role (title, salary, department_id) VALUES ("${title}", ${salary}, ${department_id})`;
        database.query(sql, (err, rows) => {
            if (err) {
                console.log(err.message);
                return;
            }
        });
    }

    viewDepartmentBudget(callback){
        const sql = `SELECT department_id AS id, department.name AS department, SUM(salary) AS budget FROM role JOIN department ON role.department_id = department.id GROUP BY department_id`;
        database.query(sql, (err, rows) => {
            if (err) {
                callback(err.message);
            } else {
                callback(null, rows)
            }
        });
    }
}

module.exports = Role;