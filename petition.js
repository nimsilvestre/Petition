var spicedPg = require('spiced-pg');

const {
  dbUser,
  dbPass
} = require('./secrets');

var db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/signatures`);

exports.sign = ({
  first,
  last,
  sign
}) => {};

exports.getSigners = () => {
  return db.query(SELECT * FROM signatures;); //will get the table with signatures and name;

};
