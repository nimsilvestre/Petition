var spicedPg = require('spiced-pg');

const {
  dbUser,
  dbPass
} = require('./secrets');

var db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/cities`);

function getSignature(signature) {
  return db
    .query( //SQL injection - if using targeting it would make it vunerable!
      `SELECT first, last FROM signatures
            WHERE first = $1 AND last = $2`, [signature]

    )
    .then(function(results) {
      console.log(results.rows[0]);
    })
    .catch(function(err) {
      console.log(err);
    });
}
