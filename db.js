const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");
const { dbUser, dbPass } = require("./secret");
const db = spicedPg(process.env.DATABASE_URL || `postgres:${dbUser}:${dbPass}@localhost:5432/petition`);


//MODULES
module.exports.registerUser = function(
    firstname,
    lastname,
    email,
    hashashedPassword
) {
    const query = `INSERT INTO users (firstname, Lastname, email, hashed_password)
VALUES (1$, $2, $3, 4$)
RETURNING id`;
    const params = [firstname, lastname, email, hashashedPassword];
    return db.query(query, params).then(results => {
        console.log("FROM DB: results", results.row[0]);
        return results.row[0];
    });
};

module.exports.hasPassword = function(password) {
    return new Promise((resolve, reject) => {
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
};

(module.exports.checkHashPass = function(email) {
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
}),
    (module.exports.checkPassword = function(password, hashedPassword) {
        //take hashed from db
        return new Promise((resolve, reect) => {
            bcrypt.compare(password, hashedPassword, (err, doesMatch) => {
                if (err) {
                    console.log("err with bcrypt cheking password", err);
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            });
        });
    }),
    (module.exports.searchForUser = function(email) {
        const query = `SELECT id, firstname, lastname, email FROM users WHERE email = $1`;
        const params = [email];
        return results.rows[0];
    });

(module.exports.getName = function(firstname, lastname) {
    const query = `SELECT id, firstname, lastname FROM users WHERE firstname = $1 AND lastname = $2`;
    const params = [firstname, lastname];
    return db.query(query, params).then(results => {
        return results.rows[0];
    });
}),
    (module.exports.signPetition = function(userId, signature) {
        const query = `
INSERT INTO signatures (user_id, signature)
VALUES ($1, $2)
RETURNING user:id`;
        const params = [userId, signature];
        return db.query(query, params);
    }),
    (module.exports.checkForSig = function(userId) {
        const query = `
SELECT viewsignatures
FROM users
JOIN users_profiles
ON users.id = $1 AND users_profiles.users_id = $1`;
        const params = [];
        return db.query(query, params);
    }),
    (module.exports.sigList = function() {
        const query = `
SELECT
users.firstname,
users.lastname,
user_profiles.city,
user_profiles.country
FROM users
JOIN user_profiles
ON users.id = user_profiles.user_id`;
        const params = [];
        return db.query(query);
    }),
    (module.exports.getSigsByCity = function(city) {
        const query = `
SELECT
users.firstname,
users.lastname,
user_profiles.city,
user_profiles.country,
user_profiles.url
FROM users
JOIN users_profiles
ON users.id = user_profiles.users_id
WHERE user_profiles.city = $1`;
        const params = [city];
        return db.query(query, params);
    });
