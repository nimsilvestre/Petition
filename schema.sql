DROP TABLE IF EXIST users;
DROP TABLE IF EXIST users_profile;
DROP TABLE IF EXIST signatures;


CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    first VARCHAR(300) not null,
    last VARCHAR(300) not null,
    signarute TEX NOT NULL
    email VARCHAR(300) not null unique,
    hashed_pass VARCHAR(300) not null
    created TIMESTAMP
);



var q = `INSERT INTO signatures (first, last, signatures)
VALUES($1, $2, $3) RETURNING id`

db.query(q, [first, last, sig]).then(result) => {
    const sigId = result.row[0].id;
});

app.post('/petition', function(req, res) {
    sign(req.body.first, req.body.last, req.body.sig).then(function(signId){
    req.session.sigId  = sigId;
    })
})
