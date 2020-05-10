const app = require('./app');
const http = require('http');
var server = http.createServer(app);
require('dotenv').config({ path: './.env' });
const mongoose = require('./db/connectDB');
const port = process.env.PORT;
server.listen(port, function () {
    console.log("Server running at port " + port);
});