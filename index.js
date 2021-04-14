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

//function that prompts the user to answer questions
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

//Function to view all employees
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
//function to view all roles in the company
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
//fuction to view all departments within the company
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
// adding new employees function

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
            message: "Employee's title? (please use corresponding number only)",
            name: "titleID"
        },
        {
            type: "input",
            message: "Who is the employee's manager? (please use corresponding number only)",
            name: "managerID"
        }
    ];

const updateEmpManager = (empID, roleID) =>{
        connection.query("UPDATE employees SET emp_role_id = ? WHERE emp_id = ?", [roleID, empID])
    };

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
                updateEmpManager(answer.titleID, answer.managerID);
                viewAllEmployees();
            }
        );
    });
};
//adding new departments
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
//function to add role in the company
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
            (error, res) => {
                if (error) throw error;
                init();
            }
        );
    });
};
//function to give employee new role
const updateEmployeeRole = () => {
    connection.query(`SELECT * FROM company_db.employees`, 
                        (err, res) => {
                        if (err) throw err

    inquirer.prompt([
        {
          name: 'employeeUpdated',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({ first_name }) => {
              choiceArray.push(first_name);
            });
            return choiceArray;
          },
          message: 'Name of employee you want to update',
        },
        {
            name: 'newRole',
            type: 'rawlist',
            choices() {
                const choiceArray = [];
                results.forEach(({ role_id }) => {
                  choiceArray.push(role_id);
                });
                return choiceArray;
              },
            message: "What is the new role? (please use corresponding number only)",
        },

      ])
        .then((answer) => {
            console.log(answer.employeeUpdated);
            console.log(answer.newRole);
                init();
            });
    
    connection.query(
                'UPDATE employees SET role_id = ? WHERE first_name = ?',
                [answer.newRole, answer.employeeUpdated],
                    (err) => {
                    if (err) throw err;
                    init();
                }
            )
        })
    }   



//connection to mysql server and database

connection.connect((err) => {
    if (err) throw err;
//runs the init function after connection is made to prompt the user
    init();
});