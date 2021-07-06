const mysql = require('mysql');

// Connecting to the database..
var db;
function connectDatabase() {
    if(!db) {
        db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'doctors'
        });

        db.connect((err) => {
            if(err)
                console.log('Error connecting database!');
            else 
                console.log('Connected to the database..');
        });
    }
    return db;
}

// Exporting db object
module.exports = connectDatabase();