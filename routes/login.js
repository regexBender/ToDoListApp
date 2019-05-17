var express = require("express");
var login = express.Router();
const initDb = require("../database").initDb;
const getDb = require("../database").getDb;
const jwt = require('jsonwebtoken');

const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

login.use( (req, res, next) => {
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



login.post("/", urlencodedParser, (req, res, next) => {

    var email_login = req.body.email;
    var password_login = req.body.password;

    connection.query("SELECT userid, email, password FROM users WHERE ?", {email: email_login}, (err, rows, fields) => {
        if (err) {
            res.status(400);
            res.send(err);
            console.log(err);
            return next(err);
        }
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

                const token = jwt.sign({user: email_login}, 'secret');
                res.json({userid: rows[0].userid, jwt: token });

                //res.send("Login successful!");
                console.log("Login successful!");
            }

        }
    });

});



module.exports = login;