const mysql = require("mysql");
const inquirer = require("inquirer");

//create connection 
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"Ilovemymom2000",
    database:"employee_tracker_db"
});

//connect to the database
connection.connect((err)=>{
    if(err) throw err;
    console.log("Connected as connection " + connection.threadId + "\n");
    mainMenu();
});

//main menu

function mainMenu(){
    inquirer
        .prompt({
            name:"addViewUpdate",
            type:"list",
            message:"Please choose the option of what you would like to do",
            choices: 
            [
                {
                    name:"Add departments, roles, employees",
                    value: "ADD"
                },
                {
                    name:"View departments, roles, employees",
                    value:"VIEW"
                },
                {
                    name:"Update employee roles",
                    value:"UPDATE"
                },
                { 
                    name: "Exit",
                    value:"EXIT"
                }
             ]
        }).then(function(answer){
            switch(answer.addViewUpdate){
                case "ADD":
                    add();
                    break;
                case "VIEW":
                    view();
                    break;
                case "UPDATE":
                    update();
                    break;
                case "Exit":
                    connection.end();
                    break;
            };
        });
    }


function add(){
    inquirer 
        .prompt({
            name:"addDRE",
            type: "list",
            message:"Would you like to add a department, role, or an employee",
            choices: ["department", "role", "employee", "exit"]
        }).then(function(answer){
            switch(answer.addDRE){
                case "department":
                    addDepartment();
                    break;
                case "role":
                    addRole();
                    break;
                case "employee":
                    addEmployee();
                    break;
                case "exit":
                    mainMenu();
                    break;
            }
        });
}

function addDepartment(){
   inquirer
        .prompt({
            name: "addDepartment",
            type: "input",
            message:"What is the name of the department you would like to add?"
        }).then(function(answer){
            connection.query(
                'INSERT INTO departments SET ?',
                {
                    name: answer.addDepartment
                },
                (err,res)=>{
                    if(err) throw err;
                    console.log("Department Added!");
                    mainMenu();
                }
            )
        })
    }
function addRole(){
    inquirer
        .prompt([
            {
            name: "addRoleTitle",
            type: "input",
            message:"What is the name of the role you would like to add?"
        },
        {
            name:"addRoleSalary",
            type:"input",
            message:"What is the salary for this position"
        },
        {
            name:"addDepId",
            type:"input",
            message:"Type the number of the department's id to which this position belongs."
        }
    ]).then(function(answer){
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.addRoleTitle,
                    salary: parseFloat(answer.addRoleSalary),
                    department_id: answer.addDepId
                },
                (err,res)=>{
                    if(err) throw err;
                    console.log("Role Added!");
                    mainMenu();
                }
            )
    })
}

function addEmployee(){
    inquirer
        .prompt([
            {
            name: "addFirstName",
            type: "input",
            message:"What is the first name of the employee you would like to add?"
        },
        {
            name:"addLastName",
            type:"input",
            message:"What is the last name of the employee you would like to add?"
        },
        {
            name:"addRoleId",
            type:"input",
            message:"Type the id of the role that corresponds to the position of this employee"
        },
        {
            name:"addManagerId",
            type:"input",
            message:"If applicable, type the id of this employee's manager"
        }
    ]).then(function(answer){
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.addFirstName,
                    last_name: answer.addLastName,
                    role_id: answer.addRoleId,
                    manager_id: answer.addManagerId
                },
                (err,res)=>{
                    if(err) throw err;
                    console.log("Role Added!");
                    mainMenu();
                }
            )
    })
}

//View functionality

function view(){
    inquirer 
        .prompt({
            name:"viewDRE",
            type: "list",
            message:"Would you like to view departments, roles, or employees",
            choices: ["department", "role", "employee", "exit"]
        }).then(function(answer){
            switch(answer.viewDRE){
                case "department":
                    viewDepartments();
                    break;
                case "role":
                    viewRoles();
                    break;
                case "employee":
                    viewEmployees();
                    break;
                case "exit":
                    mainMenu();
                    break;
            }
        });
}

function viewEmployees(){
    const employees = connection.query(`SELECT * FROM employee`,(err,res)=>{
        if(err) throw err;
        console.table(res);
        mainMenu();
    })
    
}

function viewDepartments(){
    const department = connection.query(`SELECT * FROM departments`,(err,res)=>{
        if(err) throw err;
        console.table(res);
        mainMenu();
    })
    
}

function viewRoles(){
    const roles = connection.query(`SELECT * FROM role`,(err,res)=>{
        if(err) throw err;
        console.table(res);
        mainMenu();
    })
    
}

function update(){
    connection.query(`SELECT * FROM role`,(err,res)=>{
        if(err) throw err;
        console.table(res);
    });
    connection.query(`SELECT * FROM employee`,(err,res)=>{
        if(err) throw err;
        console.table(res);
        inquirer
        .prompt([
            {
            name:"updateDRE",
            type:"input",
            message: "Type the id number of the employee whose role you would like to update."
        },
        {
          name:"roleToUpdate",
          type:"input",
          message:"Type the id of the role you would like to update this employee's role to."  

        }
    ]).then(function(answer){
        connection.query(
                    "UPDATE employee SET ? WHERE ?",
                        [
                            {
                               role_id: parseInt(answer.roleToUpdate)
                            },
                            {
                                id: parseInt(answer.updateDRE)
                            }
                            ],
                            (err,res)=>{
                                if(err) throw err;
                                console.log("Role Updated!")
                                mainMenu()
                            }
        )
                        
                    
        });
    });
    
}
