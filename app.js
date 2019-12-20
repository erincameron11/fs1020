// from video: https://www.youtube.com/watch?v=6iZiqQZBQJY

// AUTHENTICATION 
//require('dotenv').config({client: 'pg'});
const express = require('express');
const app = express(); // Create the app
const fs = require('fs'); // File System for loading the list of contacts
const session = require('express-session');
const server = express();

// AUTHENTICATION
// const KnexSessionStore = require('connect-session-knex')(session);
// const knex = require('knex');
// const knexConfig = require('../fs1020-project/node_modules/knex/knex.js');
// const db = knex(knexConfig);




// Check first to see if our database exists
let contacts;
let exists = fs.existsSync('contacts.json');
if (exists) {
  // Read the file
  console.log('loading contacts');
  let txt = fs.readFileSync('contacts.json', 'utf8');
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

// ROUTE FOR ADDING A NEW CONTACT WITH NAME, EMAIL AND PHONE
app.post('/user/:name/:email/:phone', addContact);
// Handle that route
function addContact(req, res) {
  // Name, Email and Phone
  let name = req.params.name;
  let email = req.params.email;
  let phone = Number(req.params.phone);
  let id = ([contacts.length++]); // NEED TO FIX THIS
  // Put it in the object
  contacts[id] = {name, email, phone};
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
  fs.writeFile('contacts.json', json, 'utf8', finished);
  function finished(err) {
    console.log('Finished writing contacts.json');
    // Don't send anything back until everything else is done
    res.send(reply);
  }
}

  // ROUTE TO CREATE AN ENTRY WHEN THE USER SUBMITS THEIR FORM
  app.get('/submit', function(req,res) {
    res.send('Thank you for submitting the contact us form! Your data has been sent to our JSON file and stored.');
  });


  // ROUTE TO CREATE OR REGISTER A USER
  app.post('/id/:user/:password', function(req, res) {
    let user = req.params.user;
    let password = req.params.password;
    exports.getUserById = function(id) {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id == id) return users[i];
        }
      };
    // let id = ([contacts.length++]);
    // Put it in the object
    contacts[id] = {user, password};
    let reply = {
        status: 'success',
        user: user,
      }
      console.log('adding: ' + (user + ' and super secret password'));
      let json = JSON.stringify(contacts, null, 2);
      fs.writeFile('contacts.json', json, 'utf8', finished);
      function finished(err) {
        console.log('Finished writing contacts.json with new user');
        // Don't send anything back until everything else is done
        res.send(reply);
      }
  });

  // ROUTE TO LOG A REGISTERED USER IN TO CREATE A SESSION
  app.post('/login/:user/:password', function (req, res) {
    let user = contacts[name];
    if(!contact) {
        res.send('That username is not correct');
    } else {
        res.send('You are loggen in!');
    }
  });


  // ROUTE TO GET A LISTING OF ALL SUBMISSIONS
app.get('/all', function (req, res) {
    res.send(contacts);
});