const connection = require('./db');

function bookRoom(roomNumber, bookedBy, startTime, endTime, callback) {
  const query = `INSERT INTO bookings (room_name, booked_by, start_time, end_time) VALUES (?, ?, ?, ?)`;
  connection.execute(query, [roomNumber, bookedBy, startTime, endTime], (err, results) => {
    callback(err ? { success: false, err } : { success: true, results });
  });
}


function getBookings(callback) {
  const query = `SELECT * FROM bookings`;
  connection.query(query, (err, results) => {
    callback(err ? [] : results);
  });
}

module.exports = { bookRoom, getBookings };
