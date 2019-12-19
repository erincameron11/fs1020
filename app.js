// from video: https://www.youtube.com/watch?v=6iZiqQZBQJY

let express = require('express');
let app = express(); // Create the app
let fs = require('fs'); // File System for loading the list of contacts

// Our "database" is "additional.json", check first to see if it exists
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

// Set up the server
// process.env.PORT is related to deploying on heroku
let server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  let host = server.address().address;
  let port = server.address().port;
}

// A route for adding a new word with a score
app.get('/add/:name/:email/:phone', addContact);

// Handle that route
function addContact(req, res) {
  // Word and score
  let name = req.params.name;
  let email = req.params.email;
  // Make sure it's not a string by accident
  let phone = req.params.phone;

  // Put it in the object
  contacts[name] = email + ' ' + phone;

  // Let the request know it's all set
  let reply = {
    status: 'success',
    name: name,
    email: email,
    phone: phone
  }
  console.log('adding: ' + JSON.stringify(reply));

  // Write a file each time we get a new word
  // This is kind of silly but it works
  let json = JSON.stringify(contacts, null, 2);
  fs.writeFile('contacts.json', json, 'utf8', finished);
  function finished(err) {
    console.log('Finished writing contacts.json');
    // Don't send anything back until everything is done
    res.send(reply);
  }
}

// Route for sending all the concordance data
app.get('/all', showAll);

// Callback
function showAll(req, res) {
  // Send the entire dataset
  // express automatically renders objects as JSON
  res.send(contacts);
}