// array
var cars= new Array();
var people= new Array();
var stores= new Array();

var fs = require("fs");

// promise function,  parse is to transform the JSON to data
module.exports.initialize = () => {
    return new Promise(function(resolve, reject) {
        fs.readFile('./data/people.json', 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read file.");
                return;
            }
            people = JSON.parse(data);
        resolve(people);
        });
        fs.readFile('./data/cars.json', 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read file.");
                return;
            }
            cars = JSON.parse(data);
        resolve(cars);
        });
        fs.readFile('./data/stores.json', 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read file.");
                return;
            }
            stores = JSON.parse(data);
        resolve(stores);
        });

    });        
}

// promise 
// check the the data, if has nothing return the rejcet result else the data inside
module.exports.getAllPeople =function() {
   return new Promise((resolve, reject) => {
       if(people.lentth == 0){
           reject("no results returned");
           return;
       }
       resolve(people);
   })
}

module.exports.getCars = function() {
    return new Promise((resolve, reject) => {
        if(cars.lentth == 0){
            reject("no results returned");
            return;
        }
        resolve(cars);
    })
 }

 module.exports.getStores = function()  {
    return new Promise((resolve, reject) => {
        if(stores.lentth == 0){
            reject("no results returned");
            return;
        }
        resolve(stores);
    })
 }









