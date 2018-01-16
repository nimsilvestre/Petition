const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const hb = require("express-handlebars");
const db = require('./db');
/*<=================Handlebars Template=================>*/

app.engine(
    "handlebars",
    hb({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");
app.use(express.static("public")); //vai apresentar logo o documento que esta dentro da pasta.

/*<=================PARSERS : BODY/COOKIE====================>*/

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(cookieParser('cookieSecret'))

app.use(cookieSession({
    secret: require('/secrets').sessSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

/*<====================GET Home/Register Page===================>*/

app.get("/register", (req, res) => {
    res.render("home", {});
})

app.post('/register', (req, res) => {
    var {
        firstname,
        lastname,
        email,
        password
    } = req.body

    if (!firstname || !lastname || !email || !password) {
        res.render('register', {
            error: 'Please complete the form, thank you.'
        })
    } else {
        db.searchForUser(email).then(results => {
                if (!results) {
                    db.hasPassword(password).then((hashedPassword) => {
                        db.registerUser(firstname, lastname, email hashashedPassword).then((user) => {
                            console.log('This is the iuser:', user)
                            req.session.user = {
                                firstname: firsname,
                                lastname: lastname,
                                email: email,
                                id: user.id
                            }
                            res.redirect('/petition')
                        }).catch((err) => {
                            console.log('ERROR FROM REGISTER', err)
                        });
                    }).catch((err) => {
                        console.log('ERROR HASHING PW', err)
                    })
                }
            } else {
                res.render('register', {
                    error: 'This user already registered. Please try again.',
                })
            }
        }).catch((err) => {
        console.log('ERROR CHECKING USER', err)
    })
}
})

/*<====================LOGIN===================>*/

app.get('/login', (req, res) => {
            let email = req.ody.email;
            let password = req.body.password;

            if (!email || password) {
                res.render('login', {
                    error: 'You need to complete the forme to proceed.'
                })
            } else {
                db.checkHashPass(email).then((hashashedPassword) => {
                            db.checkPassword(password, hashedPassword).then((doesMatch) => {
                                    if (doesMatch) {
                                        db.searchForUser(email).then((user) => {
                                                console.log('ID', user); //<======== continuar aqui
                                            }
                                        }
                                    }
                                }
                            }

                        } //criar um login.handlebars

                        app.post('/login', (req, res) => {
                                const {
                                    email,
                                    password
                                } = req.body
                                console.log('inside POST / Login', email, password);

                                //check if email exists

                                const = 'SELECT * FROM users WHERE email = $1'
                                const params = [email]

                                db.query(q, params)
                                    .then(results) => {
                                        //check if email exists
                                        console.log('returned user data', results.rows);
                                        checkPassword(password, results.rows[0].hashedpass)
                                            .then(doesMatch => {}
                                                asuiop≥ d cy res.cooki('id', results.rows[0].id)
                                                //res.json or res.redirect('/petition')
                                            }
                                    }

/*<===================GET Thank you Page===================>*/

                                /*app.get('/thankyou', requireSignature, (req, res) => { // HERE WE SET THE ROUTES THAT WE NEED!
                                      res.render('thankYou', {
                                          //here goes the set cookies if fails then redirect to petition and
                                          if (!req.cookies.signed {
                                              res.redirect('/petition ')
                                            }
                                            // layout:'main'
                                          });
                                      });

                                /*<==================GET Who signed page ===================>*/
                                /*app.get('/viewsignatures', (req, res) => { // HERE WE SET THE ROUTES THAT WE NEED!
                                      res.render('whoSigned', {
                                        // layout:'main'
                                      });
                                    });
                                    // app.get('/saffron-code/:projectName/description', function(req,res){
                                    //     var project;
                                    //     for (var i=0; i < myList.length; i++) {
                                    //         console.log(myList[i]);
                                    //         if (myList[i].url === req.params.projectName) {
                                    //             console.log('there is a match');
                                    //             project = myList[i];
                                    //         }
                                    //     }
                                    //     res.render('description', {
                                    //         layout:'main',
                                    //         project: project
                                    //     });
                                    // });*/app.listen(8080, () => console.log(`I'm listening`));

                                /*function requireSignature(req, res, next) { //using repetition functions!
                                      if (!req.cookie.signed) {
                                        res.redirect('/petition')
                                      } else {
                                        next()
                                      }
                                  }*/
