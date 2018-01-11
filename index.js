const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const basicAuth = require('basic-auth');
const hb = require('express-handlebars');
// const myList = require('./projects.js'); // signatures list!

/*Handlebars Template*/
app.engine('handlebars', hb({defaultLayout:'main'}));
app.set('view engine', 'handlebars');


/*<=================CHANGE INFORMATION HERE====================>*/

app.use(bodyParser.urlencoded({
    extended: false
}));

/*<==========GET Home Page===========>*/
app.use(express.static('public')); //vai apresentar logo o documento que esta dentro da pasta.

// /*TEMPLATE*/
app.get('/', (req, res) => { // HERE WE SET THE ROUTES THAT WE NEED!
    res.render('home', {
        // layout:'main'
    });
});
/*<==========GET Thank you Page===========>*/

/*ADD 2 MORE GET'S AND ONE POST*/

/*<==========GET Who signed page ==========>*/

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
// });
app.listen(8080, () => console.log(`I'm listening`));
