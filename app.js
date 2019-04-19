const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//app.use(express.static(path.join(__dirname, 'public')));

const mysql = require("mysql");
const connection = mysql.createConnection({
    host    : "localhost",
    user    : "root",
    password: "root",
    database: "alec"
});

var PORT = 3000;

// PM2 --> Look at this.
connection.connect( (err) => { // How/where do I close with connect.end() ?
        
    if (err) {
        throw err;
    }   


    console.log("Connected to database");
});

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json()); // How can I use this instead of urlencoded...? Is urlencoded preferable?
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

const todos = [
    { id: 1, checked: true, content: "A", created: new Date() },
    { id: 2, checked: false, content: "B", created: new Date() },
    { id: 3, checked: true, content: "C", created: new Date() },
    { id: 4, checked: false, content: "D", created: new Date() },
    { id: 5, checked: true, content: "E", created: new Date() }
];

var nextID = 6;

app.get("/todos", (req, res) => {
    
    //res.json(todos);  // why not use send? // json interprets as JSON, can do more 

    connection.query("SELECT * FROM `todo`", (err, rows, fields) => {
        res.status(200); // send back status once query is complete, must be before res.json
        res.json(rows);
    });
    
    
 
})

// Need to use request body
// If task became large, it would be truncated
//      post body is not limited 
app.post("/todos", urlencodedParser, (req, res) => {
    
    var task = req.body.task;

    connection.query("INSERT INTO `todo` SET ?", {content: task}, (err, results, fields) => {
        if (err) throw err;
        res.status(201);
        console.log("Task added.");
        connection.query("SELECT * FROM `todo` WHERE id = LAST_INSERT_ID()", (err, rows, fields) => {
            res.json(rows);
        });
        
    });

})

app.get("/todos/:id", (req, res) => {

    connection.query("SELECT * FROM `todo` WHERE `id` = ?", [req.param("id")], (err, rows, fields) => { // Do I need ` ticks?
        if (err) throw err;
        res.status(200);
        console.log("Got ID " + req.param("id"));
        res.json(rows);
    });
})

// Post can do same as patch, but use convention to implement what the protocol says
// Send data as body of message
// req.body.update -> Use body parser
// :id is different from other parameters (can access using req.param())
// Access others via the body
//      Look up "request body"
app.patch("/todos/:id", urlencodedParser, (req, res) => {
    var update = {};

    var task = req.body.task;
    var check_flag = req.body.checked;

    if (task) {
        update.content = task;
    }
    
    if (check_flag) {
        update.checked = check_flag;
    }
    

    connection.query("UPDATE `todo` SET ? WHERE `id` = ?", [update, req.param("id")], (err, results, fields) => {
        if (err) throw err;
        res.status(201);
        if (task) {
            console.log("content updated.");
        }

        if (check_flag) {
            console.log("checked updated.");
        }
        res.json(results);
    });

})

app.delete("/todos/:id", (req, res) => {

    connection.query("SELECT * FROM `todo` WHERE `id` = ?", [req.param("id")], (err, rows, fields) => {
        if (err) throw err;
        
        if (rows.length) {
            connection.query("DELETE FROM `todo` WHERE `id` = ?", [req.param("id")], (err, rows, fields) => {
                if (err) throw err;
                res.status(204);
                console.log("ID " + req.param("id") + " deleted");
                res.json(rows);
            });
        } else {
            console.log(`ID ${req.param("id")} does not exist.`);
            res.send(`ID ${req.param("id")} does not exist.`);
        }


    });

})

//----------------------------------------------------------------------------------//
//   Register
//----------------------------------------------------------------------------------//
app.post("/register", urlencodedParser, (req, res) => {

    var email_to_register = req.body.email;
    var password_to_register = req.body.password;
    var firstname_to_register = req.body.firstname;
    var lastname_to_register = req.body.lastname;

    // Check to see if email already exists in the database
    connection.query("SELECT email FROM email_password WHERE ?", {email: email_to_register}, (err, rows, fields) => {
        if (err) throw err;
        if (rows.length == 0) {
            connection.query("INSERT INTO email_password SET ?", 
                    {email: email_to_register, password: password_to_register,
                     firstname: firstname_to_register, lastname: lastname_to_register}, 
                (err, rows, fields) => {
                if (err) throw err;
                
                /*
                res.render("C:/Users/alandow/Documents/Pair_Coding/ToDoListApp/register.html", (err, html) => {
                    if (err) throw err;
                    res.send(html);
                });
                */
                var new_table_name = "";
                connection.query("SELECT userid FROM email_password WHERE email = ?", email_to_register, (err, rows, fields) => {
                    if (err) throw err;
                    console.log("userid: "+ rows[0].userid);
                    new_table_name = "todo_" + rows[0].userid;
                    console.log(new_table_name);
                

                    // This did not work at first because the event loop executed the query before
                    //      new_table_name was assigned a value
                    connection.query("CREATE TABLE ?? AS SELECT * FROM todo WHERE 1 > 2", new_table_name, (err, rows, fields) => {
                        if (err) throw err;
                        console.log(`New table created: ${new_table_name}`);
                    });
                    
                });

                res.status(201);
                res.send("Email successfully registered");

            });
        } else {
            res.status(504); // What status?
            res.send("This email is already registered.");
            console.log(`The email ${email_to_register} is already in the database.`);
        }
    });

});


//----------------------------------------------------------------------------------//
//   Register
//----------------------------------------------------------------------------------//
app.post("/login", urlencodedParser, (req, res) => {

    var email_login = req.body.email;
    var password_login = req.body.password;

    connection.query("SELECT email, password FROM email_password WHERE ?", {email: email_login}, (err, rows, fields) => {
        if (err) throw err;
        if (rows.length == 0) { // The email does not match
            res.status(504); // What status?
            res.send("The email is either incorrect or unregistered.");
            console.log(`The email ${email_login} was not in the database.`);
        } else { // The email matches

            if (password_login != rows[0].password) { // But the password does not match
                res.status(504); // What status?
                res.send("The password is incorrect.");
                console.log(`The password ${password_login} is incorrect. The correct password was ${rows[0].password}.`);
            } else { // Email and password are in the database!
                res.status(201);
                res.send("Login successful!");
                console.log("Login successful!");
            }

        }
    });

});



app.get("/", (req, res) => {
    res.status(200);
    res.json({
        text: "Hello world!"
    });
});

function endDatabaseConnection(callback) {
    setTimeout(() => {
        console.log("endDatabaseConnection");
        callback();
    }, 4000);
}

function endServer(callback) {
    setTimeout(() => {
        console.log("endServer");
        callback();
    }, 1000);
}

function killProcess(callback) {
    setTimeout(() => {
        console.log("Kill process");
        callback();
    }, 500);
}


const server = app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}.`);
});

app.get("/quit", (req, res) => {
    res.status(200);
    res.send("closing...")
    endDatabaseConnection(() => {
        endServer(() => {
            killProcess(() => {
                console.log("Done with all functions");
            });
        });
    });
    // connection.end();
    // server.close();
    // process.exit();
});

// intercept CTRL-C to execute closing processes