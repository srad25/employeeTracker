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
const addEmployee = () => {
    let questions = [{
            type: "input",
            message: "Employee's first name?",
            name: "first_name"
        },
        {
            type: "input",
            message: "Employee's last name?",
            name: "last_name"
        },
        {
            type: "input",
            message: "Employee's title?",
            name: "titleID"
        },
        {
            type: "input",
            message: "Who is the employee's manager?",
            name: "managerID"
        }
    ];
    inquirer.prompt(questions).then((answer) => {
        connection.query(
            "INSERT INTO employees SET ?", {
                first_name: answer.first_name,
                last_name: answer.last_name,
                emp_role_id: answer.titleID,
                manager_id: answer.managerID,
            },
            function (error) {
                if (error) throw error;
                viewAllEmployees();
            }
        );
    });
};

const addDepartment = () => {
    inquirer
        .prompt({
            type: "input",
            message: "What is the name of the new department?",
            name: "department"
        })
        .then((answer) => {
            console.log(answer.department);
            connection.query("INSERT INTO department SET ?", {
                    "dept_name": answer.department,
                },
                function (err, res) {
                    if (err) throw err;
                    init();
                });
        });
};

const addRole = () => {
    let questions = [{
            type: "input",
            message: "What role would you like to add?",
            name: "title"
        },
        {
            type: "input",
            message: "In what department?",
            name: "department"
        },
        {
            type: "input",
            message: "What is the salary for this role?",
            name: "salary"
        }
    ];
    inquirer.prompt(questions).then((answer) => {
        connection.query(
            "INSERT INTO company_role SET ?", {
                "title": answer.title,
                "dept_id": answer.department,
                "salary": answer.salary
            },
            function (error, res) {
                if (error) throw error;
                init();
            }
        );
    });
};

connection.connect((err) => {
    if (err) throw err;
    init();
});