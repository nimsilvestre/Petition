DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS users_profiles;
DROP TABLE IF EXISTS signatures;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(300),
    lastname VARCHAR(300),
    email VARCHAR(300) not null unique,
    hashed_password VARCHAR(300) not null,
    created TIMESTAMP
);

CREATE TABLE users_profiles(
    id SERIAL PRIMARY KEY,
    user_id INTEGER not null,
    city VARCHAR(300),
    country VARCHAR(300),
    age INTEGER,
    url VARCHAR(300),
    created TIMESTAMP
);


CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    user_id INTEGER not null,
    signature TEXT not null,
    created TIMESTAMP
);
