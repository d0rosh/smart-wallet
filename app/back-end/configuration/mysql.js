const mysql = require('mysql');

// Create connection
const db = mysql.createConnection({
	host      : 'localhost',
	user      : 'root',
	password  : '12345',
	database  : 'accounting_app'
});

// Connect
db.connect((err) => {
	if (err) {
		throw err;
	}

	console.log('MySql Connected...');
});

module.exports = db;
