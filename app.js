const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const mysql = require("mysql");
const connection = mysql.createConnection({
    host    : "localhost",
    user    : "root",
    password: "root",
    database: "alec"
});

var PORT = 3000;

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
    res.status(200);
    //res.json(todos);  // why not use send? // json interprets as JSON, can do more 

    connection.query("SELECT * FROM `todo`", (err, rows, fields) => {
        res.json(rows);
    });
    
 
})

// Need to use request body
// If task became large, it would be truncated
//      post body is not limited 
app.post("/todos", urlencodedParser, (req, res) => {
    
    var task = req.body.task;

    todos.push({id: nextID, checked: false, content: task, created: new Date()});
    nextID++;

    connection.query("INSERT INTO `todo` SET ?", {content: task}, (err, results, fields) => {
        if (err) throw err;
        console.log("Task added.");
        res.json(results);
    });

})

app.get("/todos/:id", (req, res) => {
    res.status(200);

    connection.query("SELECT * FROM `todo` WHERE `id` = ?", [req.param("id")], (err, rows, fields) => { // Do I need ` ticks?
        if (err) throw err;
        console.log("Got ID " + res.param("id"));
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

    var task = req.body.task;
    
    connection.query("UPDATE `todo` SET `content` = ? WHERE `id` = ?", [task, req.param("id")], (err, results, fields) => {
        if (err) throw err;
        console.log("Task updated.");
        res.json(results);
    });

})

app.delete("/todos/:id", (req, res) => {

    connection.query("SELECT * FROM `todo` WHERE `id` = ?", [req.param("id")], (err, rows, fields) => {
        if (err) throw err;
        
        if (rows.length) {
            connection.query("DELETE FROM `todo` WHERE `id` = ?", [req.param("id")], (err, rows, fields) => {
                if (err) throw err;
                console.log("ID " + req.param("id") + " deleted");
                res.json(rows);
            });
        } else {
            console.log(`ID ${req.param("id")} does not exist.`);
            res.json(`ID ${req.param("id")} does not exist.`);
        }


    });


    
    
})

app.get("/", (req, res) => {
    res.status(200);
    res.json({
        text: "Hello world!"
    });
});




const server = app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}.`);
});

app.get("/quit", (req, res) => {
    res.status(200);
    
    res.send("closing...")
    
    console.log("Closing the database...");
    connection.end();

    console.log("Closing the node server...");
    server.close();
    process.exit();
});