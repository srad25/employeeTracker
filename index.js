const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require(`console.table`);


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Srad1234",
    database: "company_db"

});



const init = () => {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Departments",
                "View All Roles",
                "Add Employees",
                "Add Departments",
                "Add Roles",
                "Update Employee Role",
                "Find Employee",
                "Find Roles",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Employees":
                    addEmployee();
                    break;
                case "Add Departments":
                    addDepartment();
                    break;
                case "Add Roles":
                    addRole();
                    break;
                case "Update Employee Roles":
                    updateEmployeeRole();
                    break;
                case "Find Employee":
                    findEmployee();
                    break;
                case "Find Roles":
                    findRoles();
                case "exit":
                    connection.end();
                    break;
            }
        });
};


const viewAllEmployees = () => {
    connection.query(
        `SELECT employee.emp_id, employee.first_name, employee.last_name, title, salary, dept_name, 
            employee2.first_name AS manager_first_name, employee2.last_name AS manager_last_name
            FROM employees AS Employee
            INNER JOIN company_role AS Company ON Employee.emp_role_id = company.role_id 
            INNER JOIN department AS Department ON Company.dept_id = department.dept_id 
            LEFT JOIN employees AS Employee2 ON Employee.manager_id = Employee2.emp_id;`,

        (err, res) => {
            if (err) throw err;
            const table = cTable.getTable(res);
            console.log(table);
            init();
        }
    )
};

const viewAllRoles = () => {
    connection.query(
        `SELECT company_role.role_id, company_role.title, company_role.salary, department.dept_name AS department
            FROM company_role 
            LEFT JOIN department
            ON company_role.dept_id = department.dept_id;`,
        (err, res) => {
            if (err) throw err;
            const table = cTable.getTable(res);
            console.log(table);
            init();
        }
    )
};

const viewAllDepartments = () => {
    connection.query(
        `SELECT * FROM department`,
        (err, res) => {
            if (err) throw err;
            const table = cTable.getTable(res);
            console.log(table);
            init();
        }
    )
};


connection.connect((err) => {
    if (err) throw err;
    init();
});