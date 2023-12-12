//-------------------------//
//     Module Imports     //
//-----------------------//

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

//-------------------------//
//     Datbase Filepath   //
//-----------------------//

const dbPath = path.join(__dirname, "database.db");  

//--------------------------//
//     Create SQLite Db    //
//------------------------//


const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error("Error opening database", error.message);
    } else {
        console.log("Connected to the SQLite database.");
        createTables();
    }
});

//--------------------------//
//     Create Tables       //
//     User and Posts     //
//-----------------------//

function createTables() {

//-------------------------//
//     user Table         //
//-----------------------//

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        dateCreated TEXT NOT NULL
    )`, (error) => {
        if (error) {
            console.error("Error creating users table", error.message);
        } else {
            console.log("Users table created or already exists.");
        }
    });

//-------------------------//
//     posts Table        //
//-----------------------//

    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        datePosted TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id)
    )`, (error) => {
        if (error) {
            console.error("Error creating posts table", error.message);
        } else {
            console.log("Posts table created or already exists.");
        }
    });
}

//-------------------------//
//     Module Export      //
//-----------------------//

module.exports = db;
