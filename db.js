const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");
const { dbUser, dbPass } = require("./secret");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${dbUser}:${dbPass}@localhost:5432/petition`
);

/*
if (process.env.DATABASE_URL) {
    console.log('process env');
    db = spicedPg(process.env.DATABASE_URL);
} else {
    console.log('localhost');
    const secrets = require('./secrets.json');
    db = spicedPg(`postgres:${secrets.user}:${secrets.pass}@localhost:5432/petition`);
}
*/

//MODULES
module.exports.addMoreInfo = function(age, city, country, url, userId) {
    const query = `
        INSERT INTO users_profiles (age, city, country, url, user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING user_id`;
    const params = [age, city, country, url, userId];
    return db.query(query, params);
};

module.exports.registerUser = function(
    firstname,
    lastname,
    email,
    hashashedPassword
) {
    const query = `INSERT INTO users (firstname, lastname, email, hashed_password)
VALUES ($1, $2, $3, $4)
RETURNING id`;
    const params = [firstname, lastname, email, hashashedPassword];
    return db.query(query, params).then(results => {
        console.log("FROM DB: results", results.rows[0]);
        return results.rows[0];
    });
};

function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

module.exports.hashPassword = function(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt((err, salt) => {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};

module.exports.checkHashPass = function(email) {
    const query = `SELECT hashed_password FROM users WHERE email = $1`;
    const params = [email];
    return db
        .query(query, params)
        .then(results => {
            return results.row[0].hashed_password;
        })
        .catch(err => {
            console.log("err checking email", err);
        });
};

module.exports.checkPassword = function(password, hashedPassword) {
    //take hashed from db
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, doesMatch) => {
            if (err) {
                console.log("err with bcrypt cheking password", err);
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
};
module.exports.searchForUser = function(email) {
    const query = `SELECT id, firstname, lastname, email FROM users WHERE email = $1`;
    const params = [email];
    return db.query(query, params).then(results => {
        return results.rows[0];
    });
};

module.exports.getName = function(firstname, lastname) {
    const query = `SELECT id, firstname, lastname FROM users WHERE firstname = $1 AND lastname = $2`;
    const params = [firstname, lastname];
    return db.query(query, params).then(results => {
        return results.rows[0];
    });
};

module.exports.signPetition = function(userId, signature) {
    const query = `
INSERT INTO signatures (user_id, signature)
VALUES ($1, $2)
RETURNING id`;
    const params = [userId, signature];
    return db.query(query, params);
};

module.exports.getSigImage = function(userId) {
    const query = `
SELECT signature
FROM signatures
WHERE user_id = $1`;
    const params = [userId];
    return db.query(query, params);
};

module.exports.sigList = function() {
    const query = `
    SELECT users.firstname
    AS user_first, users.lastname
    AS user_last,
    users_profiles.age
    AS profile_age, users_profiles.city
    AS profile_city
    FROM signatures
    LEFT JOIN users
    ON user_id = signatures.user_id
    LEFT JOIN users_profiles
    ON users.id = users_profiles.user_id`;
    const params = [];
    return db.query(query);
};

module.exports.getSigsByCity = function(city) {
    const query = `
          SELECT users.firstname, users.lastname, users_profiles.city, users_profiles.country, users_profiles.url
          FROM users
          INNER JOIN users_profiles
          ON users.id = users_profiles.user_id
          WHERE users_profiles.city = $1`;
    const params = [city];
    return db.query(query, params);
    // .then((results) => {
    // return results.rows
    // })
};
