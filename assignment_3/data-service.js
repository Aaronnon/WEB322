// array
var cars = new Array();
var people = new Array();
var stores = new Array();

var fs = require("fs");

// promise function,  parse is to transform the JSON to data
module.exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        fs.readFile('./data/people.json', 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read file.");
                return;
            }
            people = JSON.parse(data);
        });
        fs.readFile('./data/cars.json', 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read file.");
                return;
            }
            cars = JSON.parse(data);
        });
        fs.readFile('./data/stores.json', 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read file.");
                return;
            }
            stores = JSON.parse(data);
        });
        resolve();
    });
}

// promise 
// check the the data, if has nothing return the reject result else the data inside
module.exports.getAllPeople = function () {
    return new Promise((resolve, reject) => {
        if (people.length == 0) {
            reject("no results returned");
            return;
        }
        resolve(people);
    })
}

//PeopleData from POST people/add
module.exports.addPeople = function (PeopleData) {
    return new Promise((resolve, reject) => {
        PeopleData.id = people.length + 1;
        people.push(PeopleData);
        // fs.readFile('./data/people.json', 'utf8', (err, data) => {
        //     if (err) {
        //         reject("Unable to read file.");
        //         return;
        //     }

        // '\t' separate each array 
        result = JSON.stringify(people, null, '\t');
        fs.writeFile('./data/people.json', result, (err) => {
            if (err) {
                reject("no results returned");
                return;
            }
        })
        resolve(people);
    });
}
// vin from people json.vin 
module.exports.getPeopleByVin = function (vin) {
    return new Promise((resolve, reject) => {
        let vimArray = [];
        people.forEach(function(item){
            if(item.vin == vin){
                vimArray.push(item)
            }
        })
        // if the array is 0 will reject  with the msg
        vimArray.length ? resolve(vimArray) : reject("no result returned")
    })
}

module.exports.getPeopleById = function (id) {
    return new Promise((resolve, reject) => {
        let idArray = [];
        people.forEach(function(item){
            if(item.id == id){
                idArray.push(item)
            }
        })
        idArray.length ? resolve(idArray) : reject("no result returned")
    })
}


//cars json data
module.exports.getCars = function () {
    return new Promise((resolve, reject) => {
        if (cars.length == 0) {
            reject("no results returned");
            return;
        }
        resolve(cars);
    })
}

// vin from cars.vin
module.exports.getCarsByVin = function (vin) {
    return new Promise((resolve, reject) => {
        let vimArray = [];
        cars.forEach(function(item){
            if(item.vin == vin){
                vimArray.push(item)
            }
        })
        vimArray.length ? resolve(vimArray) : reject("no result returned")
    })
}

module.exports.getCarsByMake = function (make) {
    return new Promise((resolve, reject) => {
        let makeArray = [];
        cars.forEach(function(item){
            if(item.make == make){
                makeArray.push(item)
            }
        })
        makeArray.length ? resolve(makeArray) : reject("no result returned")

    });
}



module.exports.getCarsByYear = function (year) {
    return new Promise((resolve, reject) => {
        let yearArray = [];
        cars.forEach(function(item){
            if(item.year == year){
                yearArray.push(item)
            }
        })
        yearArray.length ? resolve(yearArray) : reject("no result returned")
    })
}


//stores json file data
module.exports.getStores = function () {
    return new Promise((resolve, reject) => {
        if (stores.length == 0) {
            reject("no results returned");
            return;
        }
        resolve(stores);
    });
}

// module.exports={
//     addPeople
// }