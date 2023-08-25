-- Use employees database
USE employees;

-- Insert departments
INSERT INTO department (id, name)
VALUES
    (1, 'Marketing'),
    (2, 'Engineering'),
    (3, 'Finance'),
    (4, 'Legal');

-- Insert roles
INSERT INTO role (id, title, salary, department_id)
VALUES
    (1, 'Software Developer', 80000, 2),
    (2, 'Sales Manager', 75000, 1),
    (3, 'Accountant', 120000, 3),
    (4, 'Legal Counsel', 180000, 4);

-- Insert employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'John', 'Doe', 1, NULL),
    (2, 'Jane', 'Smith', 2, 1),
    (3, 'Michael', 'Johnson', 3, 1),
    (4, 'Emily', 'Williams', 4, 2);
