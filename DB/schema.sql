DROP DATABASE IF EXISTS company_db;
CREATE database company_db;

USE company_db;

CREATE TABLE department (
    dept_id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30),
    PRIMARY KEY (dept_id)
);

CREATE TABLE company_role (
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DEC(10,2) NOT NULL,
    dept_id INT,
    PRIMARY KEY (role_id),
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)
);

CREATE TABLE employees (
    emp_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    emp_role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (emp_id),
    FOREIGN KEY (emp_role_id) REFERENCES company_role(role_id),
    FOREIGN KEY (manager_id) REFERENCES employees(emp_id)
);

INSERT INTO department (dept_name) VALUES ('Management'), ('Front of House'), ('Back of House');
INSERT INTO company_role (title, salary, dept_id) VALUES
('General Manager', 100000.00, 1), 
('Executive Chef', 85000.00, 1),
('Sous Chef', 60000.00, 3),
('Line Cook', 45000.00, 3),
('Dishwasher', 35000.00, 3),                
('Assistant Manager', 80000.00, 1),
('Host', 40000.00, 2),
('Server', 35000.00, 2);

INSERT INTO employees (first_name, last_name, emp_role_id, manager_id) VALUES
('Sean', 'Hugme', 1, 1),
('Septie', 'May', 2, 2),
('Holli', 'Carter', 3, null),
('Sue', 'Smith', 4, null),
('Harry', 'Stiles', 5, null),
('Maury', 'Mann', 6, 3),
('Bev', 'Cooke', 7, null),
('Alicia', 'Dunnmore', 8, null);