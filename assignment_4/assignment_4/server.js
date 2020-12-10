/*********************************************************************************
 * WEB322 – Assignment 04
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: _Gilberto CenMo_______ Student ID: __138228176___ Date: __21 Feb,2020____
 *
 * Online (Heroku) Link: _ https://fierce-hamlet-60442.herokuapp.com/ ___________
 *
 ********************************************************************************/

var express = require("express");
var path = require("path");
var dataService = require("./data-service.js");
// require multer module
var multer = require("multer");
// "fs" module
var fs = require("fs");
// require express-handlebars
const exphbs = require("express-handlebars");
// Add the “body-parser” dependency using the require() function
const bodyParser = require("body-parser");
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}
app.use(function(req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

// Adding body-parser middleware
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const storage = multer.diskStorage({
  destination: "./public/pictures/uploaded",
  filename: function(req, file, cb) {
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({
  storage: storage
});

//setting default to public
app.use(express.static("public"));

// express-handlebars
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function(url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      }
    }
  })
);
app.set("view engine", ".hbs");

app.get("/", function(req, res) {
  res.render("home");
});

//the link to about page
app.get("/about", (req, res) => {
  res.render("about");
});

//people/add
app.get("/people/add", (req, res) => {
  res.render("addPeople");
});

// POST /people/add
app.post("/people/add", (req, res, PeopleData) => {
  dataService.addPeople(req.body).then(PeopleData => {
    res.redirect("/people");
  });
});

// get the data from the file
// if no data return the message
app.get("/people", function(req, res) {
  if (req.query.vin) {
    dataService
      .getPeopleByVin(req.query.vin)
      .then(data => {
        res.render("people", { people: data });
      })
      .catch(msg => {
        res.render("people", { message: "no results" });
      });
  } else {
    dataService
      .getAllPeople()

      .then(function(data) {
        {
          res.render("people", { people: data });
        }
      })
      .catch(function(msg) {
        {
          res.render({
            message: msg
          });
        }
      });
  }
});

app.get("/person/:id", (req, res) => {
  dataService
    .getPeopleById(req.params.id)
    .then(data => {
      res.render("person", { person: data });
    })
    .catch(msg => {
      res.render("person", { message: msg });
    });
});

app.post("/person/update", (req, res) => {
  // console.log(req.body);
  dataService
    .updatePerson(req.body)
    .then(data => {
      res.redirect("/people");
    })
    .catch(msg => {
      res.json({ message: msg });
    });
});

// app.post("/person/update", (req, res)=>{
//   dataService.getPeopleById(req.body)
//   .then((data)=>{res.redirect("/people");})
//   .catch((err)=>{res.json({message:err});})
// });

//pictures/add
app.get("/pictures/add", (req, res) => {
  res.render("addImage");
});

// POST /pictures/add
app.post("/pictures/add", upload.single("pictureFile"), (req, res) => {
  res.redirect("/pictures");
});

// GET /pictures
app.get("/pictures", function(req, res) {
  fs.readdir("./public/pictures/uploaded", function(err, items) {
    res.render("pictures", { picture: items });
  });
});

app.get("/cars", function(req, res) {
  if (req.query.vin) {
    dataService
      .getCarsByVin(req.query.vin)
      .then(data => {
        res.render("cars", { cars: data });
      })
      .catch(msg => {
        res.render("cars", { message: "no results" });
      });
  } else if (req.query.make) {
    dataService
      .getCarsByMake(req.query.make)
      .then(data => {
        res.render("cars", { cars: data });
      })
      .catch(msg => {
        res.render("cars", { message: "no results" });
      });
  } else if (req.query.year) {
    dataService
      .getCarsByYear(req.query.year)
      .then(data => {
        res.render("cars", { cars: data });
      })
      .catch(msg => {
        res.render("cars", { message: "no results" });
      });
  } else {
    dataService
      .getCars()
      .then(function(data) {
        {
          res.render("cars", { cars: data });
        }
      })
      .catch(function(msg) {
        {
          res.render({
            message: msg
          });
        }
      });
  }
});

app.get("/stores", function(req, res) {
  if (req.query.retailer) {
    dataService
      .getStoresByRetailer(req.query.retailer)
      .then(data => {
        res.render("stores", { stores: data });
      })
      .catch(msg => {
        res.render("stores", { message: "no results" });
      });
  } else {
    dataService
      .getStores()
      .then(data => {
        res.render("stores", { stores: data });
      })
      .catch(msg => {
        res.render({
          message: msg
        });
      });
  }
});

// the page not found send message with the status 404 and message
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

dataService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart);
  })
  .catch(() => {
    console.log("error!");
  });
