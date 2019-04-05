const express = require("express");
//const bodyParser = require("body-parser");
const app = express();

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

const todos = [ // what is an easy way to access one of these objects in an array?
    { id: 1, checked: true, content: "A", created: new Date() },
    { id: 2, checked: false, content: "B", created: new Date() },
    { id: 3, checked: true, content: "C", created: new Date() },
    { id: 4, checked: false, content: "D", created: new Date() },
    { id: 5, checked: true, content: "E", created: new Date() }
];

var nextID = 6; // How to reset this upon restarting of the server?

app.get("/todos", (req, res) => {
    res.status(200);
    res.json(todos); // why not use send?
})

app.post("/todos", (req, res) => {
    //var thisID = req.body.id;
    var task = req.param('task');
    nextID++;
    todos.push({id: nextID, checked: false, content: task, created: new Date()});

    res.json(todos);
})

app.get("/todos:id", (req, res) => {
    res.status(200);
    res.json("Got ID: " + req.param('id')); // single quote vs. double quote?
})

app.patch("/todos:id", (req, res) => {
    
    // Is there an easier way to update an element of the array?
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == req.param('id')) { // === does not work
            todos[i].content = req.param('update');
            break;
        }
    }
    
    //todos[req.params.id - 1].content = req.params.update; // "content" disappears from id:1
    //todos[req.param('id') - 1].content = req.param('update');
    res.json(todos);
})

app.delete("/todos:id", (req, res) => {

    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == req.param('id')) { // === does not work
            todos.splice(i, 1);
            break;
        }
    }

    res.json(todos);
})

app.get("/", (req, res) => {
    res.status(200);
    res.json({
        text: "Hello world!"
    });
});

app.listen(3000, () => {
    console.log("Application running on port 3000.");
});