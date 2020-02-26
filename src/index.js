// from video: https://www.youtube.com/watch?v=6iZiqQZBQJY

require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs'); // File System for loading the list of contacts
const defaultErrorHandler = require('./default-error-handler');
const util = require('util');
let path = require('path');

app.use('/static', express.static('static'));
const session = require('express-session');
const server = express();

app.set('view engine', 'ejs');
// Default error handler should in any of our routes we call next() with an error
app.use(defaultErrorHandler);


// LISTEN ON PORT
// since ports are not always constantly the same number, this is the proper way to set up a port
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


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


/** Fields required: Name, Email, Phone Number - when
 * submitted should be sent to JSON file, and when rejected
 * proper HTTP status code should show
 */

// ROUTE FOR THE HOMEPAGE
app.get('/', function(req, res){
    res.render('index');
})


// // Promises
// let readFile = util.promisify(fs.readFile);
// let writeFile = util.promisify(fs.writeFile);

// let dbPath = path.resolve('src/db.json');

// // READ
// async function read() {
//     let json = await readFile(dbPath);
//     return JSON.parse(json);
//   }

// // WRITE
//   async function write(dbItems) {
//     let json = JSON.stringify(dbItems, null, 2); // the parameters for `null` and `2` are so it's formatted with 2 spaces of indentation
//     await writeFile(dbPath, json);
//   }



// ROUTE TO CREATE AN ENTRY WHEN THE USER SUBMITS THEIR FORM (ADDING A NEW CONTACT WITH NAME, EMAIL, PHONE)
app.post('/user/:name/:email/:phone', addContact);
// Handle that route
function addContact(req, res){
  let name = req.params.name;
  let email = req.params.email;
  let phone = Number(req.params.phone);
  let id = ([contacts.length++]); // NEED TO FIX THIS
  // Put it in the object
  contacts[id] = {name, email, phone};
  res.render('user', {data: {name: name, email: email, phone: phone}});
  res.status(201);
  // Let the request know it was sent properly
  console.log('adding: ' + JSON.stringify(name + ' ' + email + ' ' + phone));
  // Write a file each time we get a new contact
  let json = JSON.stringify(contacts, null, 2);
  fs.writeFile('src/db.json', json, 'utf8', finished);
  function finished(err) {
    console.log('Finished writing db.json');
    }
}



// ROUTE TO SEND CONTACT INFORMATION WHEN THE USER SUBMITS THEIR FORM
app.post('/contact', ContactInput);
// Handle that route
function ContactInput(req, res){
  let name = req.params.name;
  let email = req.params.email;
  let phone = req.params.phone;
  let message = req.params.message;
  let info = ([contacts.length++]); // NEED TO FIX THIS
  // Put it in the object
  contacts[info] = {name, email, phone, message};
  res.render('contact', 
  {data: {name: name, email: email, phone: phone, message: message}});
  res.status(201);
  // Let the request know it was sent properly
  console.log('adding: ' + JSON.stringify(name + ' ' + email + ' ' + phone + ' ' + message));
  // Write a file each time we get a new contact
  let json = JSON.stringify(contacts, null, 2);
  fs.writeFile('src/db.json', json, 'utf8', finished);
  function finished(err) {
    console.log('Finished writing db.json');
    }
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
    // Let the request know it was sent properly
      console.log('adding: ' + (user + ' and super secret password'));
    // Write a file each time we get a new contact
      let json = JSON.stringify(contacts, null, 2);
      fs.writeFile('src/db.json', json, 'utf8', finished);
      function finished(err) {
        console.log('Finished writing db.json with new user');
      }
  });




  // WORK ON THIS!!!!! ROUTE TO LOG A REGISTERED USER IN TO CREATE A SESSION
  app.post('/login', function (req, res) {
    res.render('login');
});


  app.post('/login/:user/:password', function (req, res) {
    let user = req.params.user;
    let password = req.params.password;
        if (user && password === contacts[user && password]) {
        res.render('goodlogin');
    } else {
        res.status(401);
        res.render('faillogin');
    }  
  });


// AUTHENTICATION
app.use(session({
    secret: 'I have a secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 7200000, // 2 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  }));



//   /**
//  * Determines if a user with a particular username already exists or not
//  */
// function usernameExists(username) {
//     return readUsers()
//       .then((users) => {
//         let exists = false;
  
//         users.forEach((user) => {
//           if (user.username === username) {
//             exists = true;
//           }
//         });
  
//         return exists;
//       });
//   }
  





  // ROUTE TO GET A LISTING OF ALL SUBMISSIONS
app.get('/allContacts', function (req, res) {
    res.status(202);
    res.render('all', {data: {allContacts: contacts}});
});
