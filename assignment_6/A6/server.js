/*********************************************************************************
 * WEB322 – Assignment 06
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: _Gilberto CenMo_______ Student ID: __138228176___ Date: __10 April,2020____
 *
 * Online (Heroku) Link: _ https://immense-falls-95281.herokuapp.com/ ___________
 *
 ********************************************************************************/

const express = require("express");
const data = require("./data-service.js");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const exphbs = require("express-handlebars");
const app = express();
const dataServiceAuth = require("./data-service-auth");
const clientSession = require("client-sessions");

const HTTP_PORT = process.env.PORT || 8080;

app.use(
  clientSession({
    cookieName: "session",
    secret: "assignment6",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60,
  })
);
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
const ensureLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
};
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
    },
  })
);

app.set("view engine", ".hbs");

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
  destination: "./public/pictures/uploaded",
  filename: function (req, file, cb) {
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/pictures/add", ensureLogin, (req, res) => {
  res.render("addPicture");
});

app.get("/pictures", ensureLogin, (req, res) => {
  fs.readdir("./public/pictures/uploaded", function (err, items) {
    res.render("pictures", { pictures: items });
  });
});
app.post(
  "/pictures/add",
  ensureLogin,
  upload.single("pictureFile"),
  (req, res) => {
    res.redirect("/pictures");
  }
);

/*People routes */
app.get("/people", ensureLogin, (req, res) => {
  if (req.query.vin) {
    data
      .getPeopleByVin(req.query.vin)
      .then((data) => {
        res.render(
          "people",
          data.length > 0
            ? { people: data.map((value) => value.dataValues) }
            : { message: "no results" }
        );
      })
      .catch((err) => {
        res.render("people", { message: "no results" });
      });
  } else {
    data
      .getAllPeople()
      .then((data) => {
        console.log(data.map((value) => value.dataValues));
        res.render(
          "people",
          data.length > 0
            ? { people: data.map((value) => value.dataValues) }
            : { message: "no results" }
        );
      })
      .catch((err) => {
        res.render("people", { message: "no results" });
      });
  }
});
app.get("/people/add", ensureLogin, (req, res) => {
  data
    .getCars()
    .then((data) => {
      console.log(data.map((value) => value.dataValues));
      res.render("addPeople", { cars: data.map((value) => value.dataValues) });
    })
    .catch((err) => {
      // set cars list to empty array
      res.render("addPeople", { cars: [] });
    });
});

app.post("/people/add", ensureLogin, (req, res) => {
  data
    .addPeople(req.body)
    .then(() => {
      res.redirect("/people");
    })
    .catch((err) => {
      res.status(500).send("Unable to Add the Person");
    });
});

app.get("/person/:id", ensureLogin, (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};

  data
    .getPeopleById(req.params.id)
    .then((data) => {
      if (data) {
        viewData.person = data.map((value) => value.dataValues)[0];
        //store person data in the "viewData" object as "person"
      } else {
        viewData.person = null; // set person to null if none were returned
      }
    })
    .then(data.getCars)
    .then((data) => {
      // store cars data in the "viewData" object as "cars"
      viewData.cars = data.map((value) => value.dataValues);
      // loop through viewData.cars and once we have found the vin that matches
      // the person's "vin" value, add a "selected" property to the matching
      // viewData.cars object
      for (let i = 0; i < viewData.cars.length; i++) {
        if (viewData.cars[i].vin == viewData.person.vin) {
          viewData.cars[i].selected = true;
        }
      }
    })
    .then(() => {
      if (viewData.person == null) {
        // if no person - return an error
        res.status(404).send("Person Not Found");
      } else {
        res.render("person", { viewData: viewData }); // render the "person" view
      }
    })
    .catch(() => {
      viewData.person = null;
      viewData.cars = []; // set cars to empty if there was an error
      res.status(404).send("Person Not Found");
    });
});

app.post("/person/update", ensureLogin, (req, res) => {
  data
    .updatePerson(req.body)
    .then(() => {
      res.redirect("/people");
    })
    .catch((err) => {
      res.status(500).send("Unable to Update the Person");
    });
});

app.get("/people/delete/:id", ensureLogin, (req, res) => {
  data
    .deletePeopleById(req.params.id)
    .then(() => {
      res.redirect("/people");
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Person / Person Not Found");
    });
});

/* Cars Routes */
app.get("/cars", ensureLogin, (req, res) => {
  if (req.query.vin) {
    data
      .getCarsByVin(req.query.vin)
      .then((data) => {
        res.render(
          "cars",
          data.length > 0
            ? { cars: data.map((value) => value.dataValues) }
            : { message: "no results" }
        );
      })
      .catch((err) => {
        res.render("cars", { message: "There was an error" });
      });
  } else if (req.query.year) {
    data
      .getCarsByYear(req.query.year)
      .then((data) => {
        res.render(
          "cars",
          data.length > 0
            ? { cars: data.map((value) => value.dataValues) }
            : { message: "no results" }
        );
      })
      .catch((err) => {
        res.render("cars", { message: "There was an error" });
      });
  } else if (req.query.make) {
    data
      .getCarsByMake(req.query.make)
      .then((data) => {
        res.render(
          "cars",
          data.length > 0
            ? { cars: data.map((value) => value.dataValues) }
            : { message: "no results" }
        );
      })
      .catch((err) => {
        res.render("cars", { message: "There was an error" });
      });
  } else {
    data
      .getCars()
      .then((data) => {
        console.log(data.map((value) => value.dataValues));
        res.render(
          "cars",
          data.length > 0
            ? { cars: data.map((value) => value.dataValues) }
            : { message: "no results" }
        );
      })
      .catch((err) => {
        res.render("cars", { message: "There was an error" });
      });
  }
});
app.get("/cars/add", ensureLogin, (req, res) => {
  res.render("addCars");
});

app.post("/car/add", ensureLogin, (req, res) => {
  data
    .addCars(req.body)
    .then(() => {
      res.redirect("/cars");
    })
    .catch((err) => {
      res.status(500).send("Unable to Add the Car");
    });
});

app.get("/car/:vin", ensureLogin, (req, res) => {
  data
    .getCarsByVin(req.params.vin)
    .then((data) => {
      res.render("car", { car: data.map((value) => value.dataValues)[0] });
    })
    .catch(() => {
      res.status(404).send("Car Not Found");
    });
});

app.post("/car/update", ensureLogin, (req, res) => {
  data
    .updateCar(req.body)
    .then(() => {
      res.redirect("/cars");
    })
    .catch((err) => {
      res.status(500).send("Unable to Update the Car");
    });
});

app.get("/cars/delete/:vin", ensureLogin, (req, res) => {
  data
    .deleteCarByVin(req.params.vin)
    .then(() => {
      res.redirect("/cars");
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Car / Car Not Found");
    });
});

/*Stores Route*/
app.get("/stores", ensureLogin, (req, res) => {
  if (req.query.retailer) {
    data
      .getStoresByRetailer(req.query.retailer)
      .then((data) => {
        res.render(
          "stores",
          data.length > 0
            ? { stores: data.map((value) => value.dataValues) }
            : { message: "no results" }
        );
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    data
      .getStores()
      .then((data) => {
        res.render(
          "stores",
          data.length > 0
            ? { stores: data.map((value) => value.dataValues) }
            : { message: "no results" }
        );
      })
      .catch((err) => {
        res.send(err);
      });
  }
});

app.get("/stores/add", ensureLogin, (req, res) => {
  res.render("addStore");
});

app.post("/stores/add", ensureLogin, (req, res) => {
  data
    .addStore(req.body)
    .then(() => {
      res.redirect("/stores");
    })
    .catch((err) => {
      res.status(500).send("Unable to Add the Store");
    });
});

app.get("/store/:id", ensureLogin, (req, res) => {
  data
    .getStoreById(req.params.id)
    .then((data) => {
      res.render("store", { store: data.map((value) => value.dataValues)[0] });
    })
    .catch(() => {
      res.status(404).send("Store Not Found");
    });
});

app.post("/store/update", ensureLogin, (req, res) => {
  data
    .updateStore(req.body)
    .then(() => {
      res.redirect("/stores");
    })
    .catch((err) => {
      res.status(500).send("Unable to Update the Store");
    });
});

app.get("/stores/delete/:id", ensureLogin, (req, res) => {
  data
    .deleteStoreById(req.params.id)
    .then(() => {
      res.redirect("/stores");
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Store / Store Not Found");
    });
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const userData = req.body;
  dataServiceAuth
    .registerUser(userData)
    .then((value) => {
      res.render("register", { successMessage: "User created" });
    })
    .catch((err) => {
      res.render("register", {
        errorMessage: err,
        userName: req.body.userName,
      });
    });
});

app.post("/login", (req, res) => {
  req.body.userAgent = req.get("User-Agent");
  dataServiceAuth
    .checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName, // authenticated user's userName
        email: user.email, // authenticated user's email
        loginHistory: user.loginHistory, // authenticated user's loginHistory
      };
      res.redirect("/people");
    })
    .catch((err) => {
      res.render("login", { errorMessage: err, userName: req.body.userName });
    });
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

app.get("/userHistory", ensureLogin, (req, res) => {
  res.render("userHistory");
});

/***404 routes and initialize**/
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

data
  .initialize()
  .then(dataServiceAuth.initialize)
  .then(function () {
    app.listen(HTTP_PORT, function () {
      console.log("app listening on: " + HTTP_PORT);
    });
  })
  .catch(function (err) {
    console.log("unable to start server: " + err);
  });
