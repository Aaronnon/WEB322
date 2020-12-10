/*********************************************************************************
 * WEB322 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: _Gilberto CenMo_______ Student ID: __138228176___ Date: __21 March,2020____
 *
 * Online (Heroku) Link: _ https://fierce-hamlet-60442.herokuapp.com/ ___________
 *
 ********************************************************************************/

const Sequelize = require('sequelize');

var sequelize = new Sequelize('ddeofq8balct86', 'uthwoxbeyitkdu', '569f410b7a2597f4ecfdff6e450418e4f508b3a52dcd2cadb674c900c0f7d5c0', {
  host: 'ec2-34-206-252-187.compute-1.amazonaws.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: true
  }
});


var People = sequelize.define("People", {
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  phone: Sequelize.STRING,
  address: Sequelize.STRING,
  city: Sequelize.STRING
});

var Car = sequelize.define("Car", {
  vin: {
    type: Sequelize.STRING,
    primaryKey: true,
    unique: true
  },
  make: Sequelize.STRING,
  model: Sequelize.STRING,
  year: Sequelize.STRING
});

var Store = sequelize.define("Store", {

  retailer: Sequelize.STRING,
  phone: Sequelize.STRING,
  address: Sequelize.STRING,
  city: Sequelize.STRING
});

Car.hasMany(People, {
  foreignKey: "vin"
});

// promise function,  parse is to transform the JSON to data
module.exports.initialize = () => {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(People => {
       
      })
      .then(Car => {
       
      })
      .then(Store => {
        resolve();
      })
      .catch(err => {
        reject("unable to sync the database");
      });
  });
};

// promise
// check the the data, if has nothing return the reject result else the data inside
module.exports.getAllPeople = function () {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        resolve(People.findAll());
      })
      .then(() => {
        resolve(Car.findAll());
      })
      .catch(err => {
        reject("no result returned");
      });
  });
};

//PeopleData from POST people/add
module.exports.addPeople = function (PeopleData) {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      for (let i in PeopleData) {
        if (PeopleData[i] == "") {
          PeopleDatap[i] = null;
        }

      }
      resolve(People.create({
          // first_name: Sequelize.STRING,
          // last_name: Sequelize.STRING,
          // phone: Sequelize.STRING,
          // address: Sequelize.STRING,
          // city: Sequelize.STRING
          first_name: PeopleData.first_name,
          last_name: PeopleData.last_name,
          phone: PeopleData.phone,
          address: PeopleData.address,
          city: PeopleData.city,
          vin:Car.vin

        }))
        .catch(() => {
          reject("unable to create the person");
        })
    }).catch(() => {
      reject("no result found");
    })

  });
};

// vin from people json.vin
module.exports.getPeopleByVin = function (vin) {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        People.findAll({
          where: {
            vin: vin
          }
        }).then(data => {
          resolve(data);
        });
      })
      .catch(err => {
        reject("no result returned");
      });
  });
};

module.exports.getPeopleById = function (id) {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        People.findAll({
          where: {
            id: id
          }
        }).then(data => {
          resolve(data)
        })
      })
      .catch(err => {
        reject("no result returned");
      })

  });
};


module.exports.updatePerson = function (personData) {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      for (let i in personData) {
        if (personData[i] == "")
          personData[i] = null;
      }
      resolve(People.update({


          first_name: personData.first_name,
          last_name: personData.last_name,
          phone: personData.phone,
          address: personData.address,
          city: personData.city,
          vin:Car.vin

        }, {
          where: {
            id: personData.id
          }
        }))
        .catch(() => {
          reject("unable to update person");
        })
    }).catch(() => {
      reject("no result found");
    })
  });
};



module.exports.deletePeopleById = function (id) {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      resolve(People.destroy({
        where: {
          id: id
        }
      }));
    }).catch((err) => {
      reject("Cannot Delete");
    });
  });
}


//cars json data
module.exports.getCars = function () {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        resolve(Car.findAll());
      })
      .catch(err => {
        reject("no result returned");
      });
  });
};

// vin from cars.vin
module.exports.getCarsByVin = function (vin) {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        Car.findAll({
          where: {
            vin: vin
          }
        }).then(data => {
          resolve(data);
        });
      })
      .catch(err => {
        reject("no result returned");
      });
  });
};

module.exports.getCarsByMake = function (make) {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        Car.findAll({
          where: {
            make: make
          }
        }).then(data => {
          resolve(data);
        });
      })
      .catch(err => {
        reject("no result returned");
      });
  });
};

module.exports.getCarsByYear = function (year) {

  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        Car.findAll({
          where: {
            year: year
          }
        }).then(data => {
          resolve(data);
        });
      })
      .catch(err => {
        reject("no result returned");
      });
  });
};

module.exports.addCar = function (carData) {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      for (let i in carData) {
        if (carData[i] == "") {
          carData[i] = null;
        }
      }
      Car.create({
        vin: carData.vin,
        make: carData.make,
        model: carData.model,
        year: carData.year,
      }).then(() => {
        resolve(Car);
      }).catch((err) => {
        reject("unable to create Car");
      });
    }).catch(() => {
      reject("unable to create Car");
    });
  });
}


module.exports.updateCar = function (carData) {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      for (let i in carData) {
        if (carData[i] == "")
          carData[i] = null;
      }
      resolve(Car.update({
          vin: carData.vin,
          make: carData.make,
          model: carData.model,
          year: carData.year,

        }, {
          where: {
            vin: carData.vin
          }
        }))
        .catch(() => {
          reject("unable to update car");
        })
    }).catch(() => {
      reject("no result found");
    })
  });
};

module.exports.getCarByVin = function (vin) {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        Car.findAll({
          where: {
            vin: vin
          }
        }).then(data => {
          resolve(data);
        });
      })
      .catch(err => {
        reject("no result returned");
      });
  });
};

module.exports.deleteCarByVin = function (vin) {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      resolve(Car.destroy({
        where: {
          vin: vin
        }
      }));
    }).catch((err) => {
      reject("Cannot Delete");
    });
  });
}

//stores json file data
module.exports.getStores = function () {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        resolve(Store.findAll());
      })
      .catch(err => {
        reject("no result returned");
      });
  });
};

module.exports.getStoresByRetailer = function (retailer) {

  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        Store.findAll({
          where: {
            retailer: retailer
          }
        }).then(data => {
          resolve(data);
        });
      })
      .catch(err => {
        reject("no result returned");
      });
  });
};

module.exports.addStore = function (storeData) {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      for (let i in storeData) {
        if (storeData[i] == "") {
          storeData[i] = null;
        }
      }
      Store.create({
        retailer: storeData.retailer,
        phone: storeData.phone,
        address: storeData.address,
        city: storeData.city,
      }).then(() => {
        resolve(Store);
      }).catch((err) => {
        reject("unable to create Car");
      });
    }).catch(() => {
      reject("unable to create Car");
    });
  });
}


module.exports.updateStore = function (storeData) {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      for (let i in storeData) {
        if (storeData[i] == "")
          storeData[i] = null;
      }
      resolve(Store.update({

          retailer: storeData.retailer,
          phone: storeData.phone,
          city: storeData.city,
          address: storeData.address,

        }, {
          where: {
            id: storeData.id
          }
        }))
        .catch(() => {
          reject("unable to update store");
        })
    }).catch(() => {
      reject("no result found");
    })
  });
};

module.exports.getStoreById = function (id) {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        Store.findAll({
          where: {
            id: id
          }
        }).then(data => {
          resolve(data);
        });
      })
      .catch(err => {
        reject("no result returned");
      });
  });
};

module.exports.deleteStoreById = function (id) {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      resolve(Store.destroy({
        where: {
          id: id
        }
      }));
    }).catch((err) => {
      reject("Cannot Delete");
    });
  });
}