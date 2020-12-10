/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _Gilberto CenMo_______ Student ID: __138228176___ Date: __17 Jan,2020____
*
* Online (Heroku) Link: _ https://hidden-forest-34724.herokuapp.com/ ___________
*
********************************************************************************/ 


var express = require("express");
var app = express();
var HTTP_PORT = process.env.PORT || 8080;
var path = require("path");
var dataService = require('./data-service.js');
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

//setting default to public 
app.use(express.static('public'));


app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

//the link to about page
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});


// get the data from the file 
// if no data return the message
app.get("/people", function(req, res){
    dataService.getAllPeople() 
    .then( function(data) {{res.json(data);}})
    .catch( function(msg){{res.json({message: msg});}})
});

app.get("/cars", function(req, res){
    dataService.getCars() 
    .then( function(data){{res.json(data);}})
    .catch( function(msg){{res.json({message: msg});}})
});

 app.get("/stores", function(req, res){
     dataService.getStores() 
    .then( function(data) {{res.json(data);}})
    .catch( function(msg){{res.json({message: msg});}})
 });
 

 // the page not found send messgae with the status 404 and message
 app.use((req,res) => { 
     res.status(404).send("Page Not Found");
 });



dataService.initialize()
    .then(() => {app.listen(HTTP_PORT, onHttpStart);})
    .catch(() => {console.log("error!")});



