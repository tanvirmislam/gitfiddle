"use strict";

var express = require('express');

var cors = require('cors');

var routes = require('./router/api/routes');

var path = require('path');

var PORT = process.env.PORT || 5000;
var app = express();
app.use(cors()); // API routes

app.use('/api', routes); // Client app routes redirection

app.use(express.static(path.resolve(__dirname, '../public')));
app.get(/.*/, (request, response) => {
  response.sendFile(__dirname, '../public/index.html');
});
app.listen(PORT, () => {
  console.log("Server listening to PORT: ".concat(PORT));
});