/**** Core modules */
const { readdirSync } = require('fs');
/**** Core modules */

/**** 3rd party modules */
const { json: applicationJson, urlencoded } = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
/**** 3rd party modules */

/**** Local modules */
/**** Local modules */

const app = express();

// Best practices app settings
app.set('port', 8080);
app.set('app URL', 'localhost:8080');
app.set('title', 'Node App');
app.set('query parser', `extended`);

// POST routes/APIs data in application/json format
app.use(applicationJson());

/**** Setting up the CORS for app */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});
/**** Setting up the CORS for app */

// Handles routes in the app
app.use('/api', require('./src/routes/routes'));

// Connect to Mongoose ODM
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => {
  console.info(`Connection has been established successfully using mongoose ODM with test database.`);
  readdirSync(__dirname + '/src/models').forEach(file => require(__dirname + '/src/models/' + file));
  app.listen(app.get('port'), () => {
    console.info(`Find the server at: ${app.get('app URL')}`);
  });
})
.catch(err => console.error(err));

module.exports = app
