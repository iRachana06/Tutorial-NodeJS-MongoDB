var express = require('express');
var app = express();
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

let Person;
const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

Person = mongoose.model("Person", personSchema , 'personlist');  //personlist is the name of the collection in MongoDB - its optional 
												//if you dont specify, it will be inferred from model name by Mongoose

const createAndSavePerson = (done) => {
 var nia = new Person({name: "nia arora", age: 84, favoriteFoods: ["eggs", "fish", "fresh fruit"]});

  nia.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  });
};

var arrayOfPeople = [
  {name: "Frankie", age: 74, favoriteFoods: ["Del Taco"]},
  {name: "Sol", age: 76, favoriteFoods: ["roast chicken"]},
  {name: "Robert", age: 78, favoriteFoods: ["wine"]}
];

var createManyPeople = function(arrayOfPeople, done) {
  Person.create(arrayOfPeople, function (err, people) {
    if (err) return console.log(err);
    done(null, people);
  });
};
 const findPeopleByName = (personName, done) => {
   Person.find({name: personName}, function (err, personFound) {
     if (err) return console.log(err);
     done(null, personFound);
   });
 };

 const findOneByFood = (food, done) => {
   Person.findOne({favoriteFoods: food}, function (err, personFound) {
     if (err) return console.log(err);
     done(null, personFound);
  });
 };

 const findPersonById = (personId, done) => {
   Person.findById({_id: personId}, function (err, personFound) {
	//Findid=>fn name, _id : field in collection, personId -argument
     if (err) return console.log(err);
		done(null, personFound);
   });
 };

const findEditThenSave = (personId, done) => {
   const foodToAdd = "hamburger";
     Person.findById({_id: personId}, function (err, personFound) {
       if (err) return console.log(err);
      personFound.favoriteFoods.push(foodToAdd);
      personFound.save((err, updatedPerson) => {
       if(err) return console.log(err);
       done(null, updatedPerson)
      })
      });
 };

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  
   Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, (err, updatedDoc) => {
     if(err) return console.log(err);
     done(null, updatedDoc);

});
};

const removeById = (personId, done) => {
    Person.findByIdAndRemove({_id: personId}, function (err, personRemoved) {
     if (err) return console.log(err);
     done(null , personRemoved);
    });
  };

const removeManyPeople = (done) => {
   const nameToRemove = "Mary";

   Person.remove({name: nameToRemove}, (err, response) => {
     if(err) return console.log(err);
     done(null, response);

   });
 };

const queryChain = (done) => {
  const foodToSearch = "burrito";
Person.find({ favoriteFoods: foodToSearch })
  .sort({ name:1 })
  .limit(2)
  .select({ age: 0 })
  .exec(function(err, data) {
         if(err) return console.log(err);
     done(null, data);
  });
 
};


exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
