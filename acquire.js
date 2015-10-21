"use strict";

var http = require("http");
var fs = require("fs");
var mime = require("mime");

http.createServer(function (request, response) {
  let url = request.url;
  console.log(url);
  if (url == "/")
    url = "/index.html"
  
  if (url.startsWith("/acquire/")) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("server-side logic goes here");
  } else {
    fs.readFile("client/" + url.substr(1), function(err, fileData) {
      if (err) {
        response.writeHead(400, {"Content-Type": "text/plain"});
        response.end(String(err));
        console.log(err);
        return;
      }
      
      response.writeHead(200, {"Content-Type": mime.lookup(url)});
      response.end(fileData.toString());
    });
  }
}).listen(8001, "0.0.0.0");

console.log("Server started");