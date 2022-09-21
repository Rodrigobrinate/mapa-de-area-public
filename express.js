const express = require('express')

const app = express()

var http = require('http');

const server = http.createServer(app);

module.exports = server;