"use strict";

var http = require("http");
var fs = require("fs");
var mime = require("mime");

http.createServer(function (request, response) {
  let url = request.url;
  console.log(url);
  if (url == "/")
    url = "/index.html"
  
  if (url.startsWith("/game")) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("server-side logic goes here");
  } else {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.end("how did you get here??");
  }
}).listen(8001, "127.0.0.1");

console.log("Server started");
