"use strict";

let express = require('express');
let router = require('./router');

let app = express();

// MIDDLEWARE
app.use(express.json()); // so we can read JSON sent in req.body
app.use(router); // this is just applying our router as middleware

// DEFAULT ERROR HANDLER
app.use(function (req, res, next, error) {

});

// LISTEN ON PORT
let port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

/** Fields required: Name, Email, Phone Number - when
 * submitted should be sent to JSON file, and when rejected
 * proper HTTP status code should show
 */
app.get('/', function(request, response) {
  response.send('GET request to the homepage');
});


// Route to create an entry when the user submits their form.
app.post('/submit', function(request, response) {
  response.send('POST request to show you submitted information');
});


// Route to create or register a user.
app.post('/new/:user', function(request, response) {
  // function to allow user var/array to fill with new user info
  let user = [];
  let newUser;
  if (newUser === '') {
    response.send('Please enter all information!');
  } else {
    user.push(newUser);
    response.send('You have created a New User!');
  }
  response.send('POST for a new user is complete. Your username and password have been saved.');
});


// Route to log a registered user in to create a session.
app.post('/login', function(request, response) {
  response.send('POST request - you are logged in!');
});


// Route to get a listing of all submissions.

// app.get('/list', function(request, response) {
//   let user = ['Erin', 'Laura', 'Heather', 'Stephanie'];
//   response.send(user.join(", "));
// });

app.get('/list', function( request, response){
  response.send(request.params.user);
});
