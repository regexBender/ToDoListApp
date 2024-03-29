const assert = require("assert");
const mysql = require("mysql");

let _db;

module.exports = {
    getDb,
    initDb
}


function initDb (callback) {
    if (_db) {
        console.warn("A connection to the database has already been established.");
        return callback(null, _db);
    }
    
    _db = mysql.createConnection({
        host    : "localhost",
        user    : "alandow",
        password: "otter",
        database: "alec"
    });

    _db.connect( (err) => {
        
        if (err) {
            console.log(err);
            return(err);
        }   
    
        console.log("Connected to database");
    });

    return callback(null, _db);
}

function getDb() {
    assert.ok(_db, "Database has not been initialized. Please call initDB first.");
    return _db;
}


// Call initDb() once here.