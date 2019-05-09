var express = require("express");
var register = express.Router();
const initDb = require("../database").initDb;
const getDb = require("../database").getDb;
const passwordValidator = require('password-validator');

const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

register.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var connection = null;
initDb((err) => {
    if (err) {    
        next(err);
    }

    connection = getDb();

});


// Create a schema
const schema = new passwordValidator();
 
// Add properties to it
schema
.is().min(3)                                    // Minimum length 3
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values


register.post("/", urlencodedParser, (req, res, next) => {

    var email_to_register = req.body.email;
    var password_to_register = req.body.password;
    var firstname_to_register = req.body.firstname;
    var lastname_to_register = req.body.lastname;

    // Validate the password
    if ( !schema.validate(password_to_register) ) {
        res.status(400);
        var msg = "Invalid Password: " + schema.validate(password_to_register, {list: true});
        res.send(msg);
        console.log(msg);
        return next(msg);
    }

    // Check to see if email already exists in the database
    connection.query("SELECT email FROM users WHERE ?", {email: email_to_register}, (err, rows, fields) => {
        if (err) {
            res.status(400);
            res.send(err);
            console.log(err);
            return next(err);
        }
        
        if (rows.length == 0) {
            connection.query("INSERT INTO users SET ?", 
                    {email: email_to_register, 
                     password: password_to_register,
                     firstname: firstname_to_register, 
                     lastname: lastname_to_register}, 
                (err, rows, fields) => {

                if (err) {
                    res.status(400);
                    res.send(err);
                    console.log(err);
                    return next(err);
                }
                
               
                /*
                res.render("C:/Users/alandow/Documents/Pair_Coding/ToDoListApp/register.html", (err, html) => {
                    if (err) {
                        res.status(400);
                        res.send(err);
                        console.log(err);
                        return next(err);
                    }
                    res.send(html);
                });
                */ 

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


module.exports = register;