const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // your MySQL username
  password: 'root123',    // your MySQL password
  database: 'room_booking_db'
});

connection.connect(err => {
  if (err) console.error('DB connection failed:', err);
  else console.log('Connected to MySQL!');
});

module.exports = connection;
