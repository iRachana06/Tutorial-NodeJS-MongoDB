//Server to run on localhost:3000
const express = require("express");
const app = express();
let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const router = express.Router();

const TIMEOUT = 10000;

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/view')));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/view/homepage.html");
});

app.get("/home", function (req, res) {
  res.sendFile(__dirname + "/view/homepage.html");
});

router.get("/file/*?", function (req, res, next) {
  if (req.params[0] === ".env") {
    return next({ status: 401, message: "ACCESS DENIED" });
  }
  fs.readFile(path.join(__dirname, req.params[0]), function (err, data) {
    if (err) {
      return next(err);
    }
    res.type("txt").send(data.toString());
  });
});



const Person = require("./App.js").PersonModel;

router.use(function (req, res, next) {
  if (req.method !== "OPTIONS" && Person.modelName !== "Person") {
    return next({ message: "Person Model is not correct" });
  }
  next();
});

// This is a POST Endpoint
router.post("/mongoose-model", function (req, res, next) {
  let p;
  p = new Person(req.body);
  res.json(p);
});

const createPerson = require("./App.js").createAndSavePerson;
router.get("/create-and-save-person", function (req, res, next) {
   let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  createPerson(function (err, data) {
    clearTimeout(t);
    if (err) {
      return next(err);
    }
    if (!data) {
      console.log("Missing `done()` argument");
      return next({ message: "Missing callback argument" });
    }
    Person.findById(data._id, function (err, pers) {
      if (err) {
        return next(err);
      }
      res.json(pers);
    });
  });
});

const createPeople = require("./App.js").createManyPeople;
router.post("/create-many-people", function (req, res, next) {
  Person.remove({}, function (err) {
    if (err) {
      return next(err);
    }
    // in case of incorrect function use wait timeout then respond
    let t = setTimeout(() => {
      next({ message: "timeout" });
    }, TIMEOUT);
    createPeople(req.body, function (err, data) {
      clearTimeout(t);
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }
      Person.find({}, function (err, pers) {
        if (err) {
          return next(err);
        }
        res.json(pers);
     });
    });
  });
});

const findByName = require("./App.js").findPeopleByName;
router.post("/find-all-by-name", function (req, res, next) {
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  Person.create(req.body, function (err, pers) {
    if (err) {
      return next(err);
    }
    findByName(pers.name, function (err, data) {
      clearTimeout(t);
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }
      res.json(data);
      Person.remove().exec();
    });
  });
});

const findByFood = require("./App.js").findOneByFood;
router.post("/find-one-by-food", function (req, res, next) {
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  let p = new Person(req.body);
  p.save(function (err, pers) {
    if (err) {
      return next(err);
    }
    findByFood(pers.favoriteFoods[0], function (err, data) {
      clearTimeout(t);
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }
      res.json(data);
      p.remove();
    });
  });
});

const findById = require("./App.js").findPersonById;
router.get("/find-by-id", function (req, res, next) {
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
   findById(pers._id, function (err, data) {
      clearTimeout(t);
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }
      res.json(data);
  
  });
});

const findEdit = require("./App.js").findEditThenSave;
router.post("/find-edit-save", function (req, res, next) {
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  let p = new Person(req.body);
  p.save(function (err, pers) {
    if (err) {
      return next(err);
    }
    try {
      findEdit(pers._id, function (err, data) {
        clearTimeout(t);
        if (err) {
          return next(err);
        }
        if (!data) {
          console.log("Missing `done()` argument");
          return next({ message: "Missing callback argument" });
        }
        res.json(data);
      });
    } catch (e) {
      console.log(e);
      return next(e);
    }
  });
});

const update = require("./App.js").findAndUpdate;
router.post("/find-one-update", function (req, res, next) {
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  let p = new Person(req.body);
  p.save(function (err, pers) {
    if (err) {
      return next(err);
    }
    try {
      update(pers.name, function (err, data) {
        clearTimeout(t);
        if (err) {
          return next(err);
        }
        if (!data) {
          console.log("Missing `done()` argument");
          return next({ message: "Missing callback argument" });
        }
        res.json(data);
        p.remove();
      });
    } catch (e) {
      console.log(e);
      return next(e);
    }
  });
});

const removeOne = require("./App.js").removeById;
router.post("/remove-one-person", function (req, res, next) {
  Person.remove({}, function (err) {
    if (err) {
      return next(err);
    }
    let t = setTimeout(() => {
      next({ message: "timeout" });
    }, TIMEOUT);
    let p = new Person(req.body);
    p.save(function (err, pers) {
      if (err) {
        return next(err);
      }
      try {
        removeOne(pers._id, function (err, data) {
          clearTimeout(t);
          if (err) {
            return next(err);
          }
          if (!data) {
            console.log("Missing `done()` argument");
            return next({ message: "Missing callback argument" });
          }
          console.log(data);
          Person.count(function (err, cnt) {
            if (err) {
              return next(err);
            }
            data = data.toObject();
            data.count = cnt;
            console.log(data);
            res.json(data);
          });
        });
      } catch (e) {
        console.log(e);
        return next(e);
      }
    });
  });
});

const removeMany = require("./App.js").removeManyPeople;
router.post("/remove-many-people", function (req, res, next) {
  Person.remove({}, function (err) {
    if (err) {
      return next(err);
    }
    let t = setTimeout(() => {
      next({ message: "timeout" });
    }, TIMEOUT);
    Person.create(req.body, function (err, pers) {
      if (err) {
        return next(err);
      }
      try {
        removeMany(function (err, data) {
          clearTimeout(t);
          if (err) {
            return next(err);
          }
          if (!data) {
            console.log("Missing `done()` argument");
            return next({ message: "Missing callback argument" });
          }
          Person.count(function (err, cnt) {
            if (err) {
              return next(err);
            }
            if (data.ok === undefined) {
              // for mongoose v4
              try {
                data = JSON.parse(data);
              } catch (e) {
                console.log(e);
                return next(e);
              }
            }
            res.json({
              n: data.n,
              count: cnt,
              ok: data.ok,
            });
          });
        });
      } catch (e) {
        console.log(e);
        return next(e);
      }
    });
  });
});

const chain = require("./App.js").queryChain;
router.post("/query-tools", function (req, res, next) {
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  Person.remove({}, function (err) {
    if (err) {
      return next(err);
    }
    Person.create(req.body, function (err, pers) {
      if (err) {
        return next(err);
      }
      try {
        chain(function (err, data) {
          clearTimeout(t);
          if (err) {
            return next(err);
          }
          if (!data) {
            console.log("Missing `done()` argument");
            return next({ message: "Missing callback argument" });
          }
          res.json(data);
        });
      } catch (e) {
        console.log(e);
        return next(e);
      }
    });
  });
});

app.use("/api", router);

// Error handler
app.use(function (err, req, res, next) {
  if (err) {
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
});

// Unmatched routes handler
app.use(function (req, res) {
  if (req.method.toLowerCase() === "options") {
    res.end();
  } else {
    res.status(404).type("txt").send("Not Found");
  }
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
