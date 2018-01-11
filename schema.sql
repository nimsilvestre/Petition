DROP TABLE IF EXIST signatures;

CREATE TABLE signatures(
    id SERIAL primary key,
    first VARCHAR(300) not null,
    last VARCHAR(300) not null,
    signarute TEX NOT NULL
);
