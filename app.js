const express = require("express");
const register = require("./routes/register");
const login = require("./routes/login");

const initDb = require("./database").initDb;
const getDb = require("./database").getDb;

const bodyParser = require("body-parser");

const passport = require("passport");

const app = express();

/* Database */
var connection;
initDb((err) => { // Initialize the database connection
    if (err) {
        next(err);
    }

    connection = getDb();
});

/* JWT Authorization */
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'qQ1';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));


// Middleware function path invocations
app.use("/routes/register", register);
app.use("/routes/login", login);

// Middleware callback functions
// Had to add this to prevent failure of JQuery POST
app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var PORT = 3001;

// PM2 --> Look at this.

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

app.get('/authUser/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log("in /authUser/" + req.param("id"));
    res.send(req.user);
});

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
app.post("/todos", urlencodedParser, (req, res, next) => {
    
    var task = req.body.task;

    connection.query("INSERT INTO `todo` SET ?", {content: task}, (err, results, fields) => {
        if (err) {
            res.status(400);
            res.send(err);
            console.log(err);
            return next(err);
        }
        res.status(201);
        console.log("Task added.");
        connection.query("SELECT * FROM `todo` WHERE id = LAST_INSERT_ID()", (err, rows, fields) => {
            res.json(rows);
        });
        
    });

})

app.get("/todos/:id", (req, res, next) => {

    connection.query("SELECT * FROM `todo` WHERE `id` = ?", [req.param("id")], (err, rows, fields) => { // Do I need ` ticks?
        if (err) {
            res.status(400);
            res.send(err);
            console.log(err);
            return next(err);
        }
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
app.patch("/todos/:id", urlencodedParser, (req, res, next) => {
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
        if (err) {
            res.status(400);
            res.send(err);
            console.log(err);
            return next(err);
        }
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

app.delete("/todos/:id", (req, res, next) => {

    connection.query("SELECT * FROM `todo` WHERE `id` = ?", [req.param("id")], (err, rows, fields) => {
        if (err) {
            res.status(400);
            res.send(err);
            console.log(err);
            return next(err);
        }
        
        if (rows.length) {
            connection.query("DELETE FROM `todo` WHERE `id` = ?", [req.param("id")], (err, rows, fields) => {
                if (err) {
                    res.status(400);
                    res.send(err);
                    console.log(err);
                    return next(err);
                }
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
process.on("SIGINT", () => {
    console.log("Caught interrupt signal");
    endDatabaseConnection(() => {
        console.log("Closing database connection...");
        endServer(() => {
            console.log("Closing the node server...")
            killProcess(() => {
                console.log("Closing app.js...");
                console.log("Done with all functions");
                process.exit();
            });
        });
    });

    

});

