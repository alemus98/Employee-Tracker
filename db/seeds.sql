USE employees_db;

INSERT INTO department (name)
VALUES ("Art"),
       ("Tech"),
       ("Sales"),
       ("Media");

INSERT INTO role (title, salary, department_id)
VALUES ("Concept Artist", 70000, 1),
       ("3D Animator", 100000, 1),
       ("Debugger", 120000, 2),
       ("Software Engineer", 150000, 2),
       ("Accountant", 600000, 3),
       ("Public Relations", 750000, 4),
       ("Social Media Lead", 450000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Illyana", "Rasputina", 1, NULL),
       ("Kitty", "Pryde", 2, 1),
       ("Betsy", "Braddock", 3, NULL),
       ("Ororo", "Monroe", 4, 3),
       ("Emma", "Frost", 5, NULL),
       ("Jean", "Grey", 6, NULL),
       ("Jubilation", "Lee", 7, 6);