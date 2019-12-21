// from video: https://www.youtube.com/watch?v=6iZiqQZBQJY

// AUTHENTICATION
//require('dotenv').config({client: 'pg'});
const express = require('express');
const app = express(); // Create the app
const fs = require('fs'); // File System for loading the list of contacts
const session = require('express-session');
const server = express();

app.set('view engine', 'ejs');

// AUTHENTICATION
// const KnexSessionStore = require('connect-session-knex')(session);
// const knex = require('knex');
// const knexConfig = require('../fs1020-project/node_modules/knex/knex.js');
// const db = knex(knexConfig);




// CHECK FIRST TO SEE IF OUR DB EXISTS
let contacts;
let exists = fs.existsSync('src/db.json');
if (exists) {
  // Read the file
  console.log('loading contacts');
  let txt = fs.readFileSync('src/db.json', 'utf8');
  // Parse it back to object
  contacts = JSON.parse(txt);
} else {
  // Otherwise start with blank list
  console.log('No contacts');
  contacts = {};
}



// LISTEN ON PORT
// since ports are not always constantly the same number, this is the proper way to set up a port
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});




// THIS IS THE AUTHENTICATION PORTION WE APPARENTLY NEED
// server.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: new KnexSessionStore({ knex: db }),
//     cookie: {
//       maxAge: 1200000, // 20 minutes
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//     },
//   }));



/** Fields required: Name, Email, Phone Number - when
 * submitted should be sent to JSON file, and when rejected
 * proper HTTP status code should show
 */

// ROUTE FOR THE HOMEPAGE
app.get('/', function(req, res){
    res.render('index');
})

// ROUTE TO CREATE AN ENTRY WHEN THE USER SUBMITS THEIR FORM (ADDING A NEW CONTACT WITH NAME, EMAIL AND PHONE)
app.post('/user/:name/:email/:phone', addContact);
// Handle that route
function addContact(req, res){
  let name = req.params.name;
  let email = req.params.email;
  let phone = Number(req.params.phone);
//   res.render('user', {data: {user: req.params.name, user: req.params.email, user: req.params.phone}});
  let id = ([contacts.length++]); // NEED TO FIX THIS
  // Put it in the object
  contacts[id] = {name, email, phone};
  res.render('user', {data: {name: name, email: email, phone: phone}});
  res.status(201);
  // Let the request know it was sent properly
  let reply = {
    status: 'success',
    name: name,
    email: email,
    phone: phone
  }
  console.log('adding: ' + JSON.stringify(reply));
  // Write a file each time we get a new contact
  let json = JSON.stringify(contacts, null, 2);
  fs.writeFile('src/db.json', json, 'utf8', finished);
  function finished(err) {
    console.log('Finished writing db.json');
    }
    // Don't send anything back until everything else is done
    res.send(reply);  
}



  // ROUTE TO CREATE OR REGISTER A USER
  app.post('/id/:user/:password', function(req, res) {
    let user = req.params.user;
    let password = req.params.password;
    let id = ([contacts.length++]);
    // Put it in the object
    contacts[id] = {user, password};
    res.status(201);
    res.render('id', {data: {user: user}});
    let reply = {
        status: 'success',
        user: user,
      }
      console.log('adding: ' + (user + ' and super secret password'));
      let json = JSON.stringify(contacts, null, 2);
      fs.writeFile('src/db.json', json, 'utf8', finished);
      function finished(err) {
        console.log('Finished writing db.json with new user');
        // Don't send anything back until everything else is done
        res.send(reply);
      }
  });





  // WORK ON THIS!!!!!     ROUTE TO LOG A REGISTERED USER IN TO CREATE A SESSION
  app.post('/login', function (req, res) {
    res.render('login', {data: {}});
});


  app.post('/login/:user/:password', function (req, res) {
    let user = req.params.user;
    let password = req.params.password;
        if(user && password === contacts[user]) {
        res.render('goodlogin');
    } else {
        res.render('faillogin');
    }  
res.render('login', {data: {user: contacts[user], password: contacts[password]}});
  });





  // ROUTE TO GET A LISTING OF ALL SUBMISSIONS
app.get('/allContacts', function (req, res) {
    res.status(202);
    res.render('all', {data: {allContacts: contacts}});
});




// DEFAULT ERROR HANDLER
app.use(function (req, res, next, error) {
    console.error(error.stack);
});