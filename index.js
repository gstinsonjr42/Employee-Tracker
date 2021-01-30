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
                    name: "ADD"
                },
                {
                    name:"View departments, roles, employees",
                    value:"VIEW"
                },
                {
                    name:"Update employee roles",
                    value:"VIEW"
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
                case "View departments, roles, employees":
                    view();
                    break;
                case "Update employee roles":
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
            name:"addDPR",
            type: "list",
            message:"Would you like to add a department, role, or an employee",
            choices: ["department", "role", "employee", "exit"]
        }).then(function(answer){
            switch(answer.addDPR){
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

/*function addEmployee(){
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
                    salary: answer.addRoleSalary,
                    department_id: answer.addDepId
                },
                (err,res)=>{
                    if(err) throw err;
                    console.log("Role Added!");
                    mainMenu();
                }
            )
    })
}*/

