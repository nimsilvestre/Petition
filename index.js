const express = require("express");
const app = express();
const hb = require("express-handlebars");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
//const session = require("express-session");
const csurf = require("csurf");
const db = require("./db");

app.use(cookieParser("cookieSecret"));

app.use(
    cookieSession({
        secret: "big secret",
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

//BODY PARSER
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

//STATIC PAGE
app.use("/public", express.static(__dirname + "/public"));

//HANDLEBARS TEMPLATING ENGINE
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

//CSURF
app.use(csurf());

//INDEX PAGE
app.get("/", (req, res) => {
    if (req.session.signed) {
        res.redirect("/thank-you");
    } else if (req.session.user) {
        res.redirect("/login");
    } else {
        res.redirect("/register");
    }
});

//REGISTER PAGE
app.get("/register", (req, res) => {
    res.render("register", {
        layout: "main",
        csrfToken: req.csrfToken()
    });
});

app.post("/register", (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        res.render("register", {
            layout: "main",
            error: "You need complete the entire form to proceed.",
            csrfToken: req.csrfToken()
        });
    } else {
        db
            .searchForUser(email)
            .then(results => {
                if (!results) {
                    db
                        .hashPassword(password)
                        .then(hashedPassword => {
                            db
                                .registerUser(
                                    firstname,
                                    lastname,
                                    email,
                                    hashedPassword
                                )
                                .then(user => {
                                    console.log("this is the user: ", user);
                                    req.session.user = {
                                        firstname: firstname,
                                        lastname: lastname,
                                        email: email,
                                        id: user.id
                                    };
                                    res.redirect("/more-info");
                                })
                                .catch(err => {
                                    console.log("ERR FROM REGISTER USER", err);
                                });
                        })
                        .catch(err => {
                            console.log("ERR HASHING PW", err);
                        });
                } else {
                    res.render("register", {
                        layout: "main",
                        error: "This user already exists. Please login.",
                        csrfToken: req.csrfToken()
                    });
                }
            })
            .catch(err => {
                console.log("err checking user", err);
            });
    }
});
//MORE INFOS PAGE

app.get("/more-info", (req, res, next) => {
    res.render("more-info", {
        layout: "main",
        csrfToken: req.csrfToken()
    });
});

app.post("/more-info", (req, res, next) => {
    const userId = req.session.user.id; //IMPORTANT!!!
    const age = req.body.age;
    const city = req.body.city;
    const country = req.body.country;
    const url = req.body.url;

    if (req.session.signed) {
        res.redirect("/thank-you");
        next();
    } else if (!age || !city || !country || !url) {
        //IF THEY DON'T FILL OUT EVERYTHING... THERE'S AN ERROR
        next();
    } else {
        db
            .addMoreInfo(age, city, country, url, userId)
            .then(() => {
                res.redirect("/petition");
            })
            .catch(err => {
                console.log("err with addMoreInfo", err);
            });
    }
});

//LOGIN PAGE
app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main",
        csrfToken: req.csrfToken()
    });
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.render("login", {
            layout: "main",
            error: "You need to complete the entire form to proceed.",
            csrfToken: req.csrfToken()
        });
    } else {
        db
            .checkHashPass(email)
            .then(hashedPassword => {
                db
                    .checkPassword(password, hashedPassword)
                    .then(doesMatch => {
                        if (doesMatch) {
                            db
                                .searchForUser(email)
                                .then(user => {
                                    console.log("ID", user.id);
                                    console.log("USER", user);
                                    req.session.user = {
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        email: user.email,
                                        id: user.id
                                    };
                                    if (!req.session.signed) {
                                        res.redirect("/petition");
                                    } else {
                                        res.redirect("/thank-you");
                                    }
                                })
                                .catch(err => {
                                    console.log("err with searchUser", err);
                                });
                        } else {
                            res.render("login", {
                                layout: "main",
                                error:
                                    "Your password was incorrect. Please try again.",
                                csrfToken: req.csrfToken()
                            });
                        }
                    })
                    .catch(err => {
                        console.log("err in app.post for login", err);
                        res.render("login", {
                            layout: "main",
                            error: "There was an error. Please try again.",
                            csrfToken: req.csrfToken()
                        });
                    });
            })
            .catch(err => {
                console.log("err with checkEmail", err);
                res.render("login", {
                    layout: "main",
                    error:
                        "Something went wrong with your email. Please try again.",
                    csrfToken: req.csrfToken()
                });
            });
    }
});

//PETITION PAGE
app.get("/petition", (req, res) => {
    if (!req.session.user) {
        res.redirect("/register");
    } else if (req.session.signed) {
        res.redirect("/thank-you");
    } else {
        const firstname = req.session.user.firstname;
        const lastname = req.session.user.lastname;

        db
            .getName(firstname, lastname)
            .then(results => {
                const userId = results.id;
                res.render("petition", {
                    layout: "main",
                    csrfToken: req.csrfToken()
                });
            })
            .catch(err => {
                console.log("err in getName || index.js", err);
            });
    }
});

//SUBMIT SIGNATURE PAGE

app.post("/submit-sig", (req, res, next) => {
    const { firstname, lastname, signature } = req.body;
    const userId = req.session.user.id;

    if (req.session.signed) {
        res.redirect("/thank-you");
    } else {
        db
            .signPetition(userId, signature)
            .then(sig => {
                req.session.signed = {
                    id: userId
                };
                res.redirect("/thank-you");
            })
            .catch(err => {
                console.log("err with signing petition", err);
            });
    }
});

//THANK YOU PAGE
app.get("/thank-you", (req, res) => {
    const userId = req.session.user.id;
    db
        .getSigImage(userId)
        .then(function(results) {
            console.log("results", results);
            res.render("thank-you", {
                layout: "main",
                signature: results.rows[0].signature,
                csrfToken: req.csrfToken()
            });
        })
        .catch(err => {
            console.log("app.get/thank you error", err);
            res.render("thank-you", {
                layout: "main",
                error: "There was a problem... sorry.",
                csrfToken: req.csrfToken()
            });
        });
});

//SIGNATURES PAGE
app.get("/signatures", (req, res, next) => {
    db
        .sigList()
        .then(results => {
            res.render("signatures", {
                layout: "main",
                signees: results.rows,
                csrfToken: req.csrfToken()
            });
            // console.log('RESULTS.ROWS', results.rows)
        })
        .catch(err => {
            console.log("app.get signees error", err);
        });
});

//SIGNATURES BY CITY
app.get("/signatures/:city", (req, res) => {
    const city = req.params.city;
    db
        .getSigsByCity(city)
        .then(results => {
            console.log;
            res.render("cities", {
                layout: "main",
                citySigs: results.rows,
                city: city,
                csrfToken: req.csrfToken()
            });
        })
        .catch(err => {
            console.log("signatures/:city error", err);
        });
});

//SERVER
app.listen(process.env.PORT || 8080, () =>
    console.log(`I'm listening on 8080.`)
);
