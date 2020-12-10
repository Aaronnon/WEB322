//This is solely my work.
//Name:Gilberto Cenmo
//ID:138228176
//Heroku Link: https://serene-mountain-02230.herokuapp.com/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.send("Gilberto Cenmo,138228176");

});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);