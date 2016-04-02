var findUsersById = function (id, callback) {
    database.users.forEach( function (user) {
        if (user.id == id) {
            return callback(user);
        }
    });
};

var readDB = function () {
    fs.readFile("db.json", "utf8", function (err, data) {
        if (err) throw err;
        database = JSON.parse(data);
    });
}

var writeDB = function () {
    fs.writeFile("db.json", JSON.stringify(database, null, 2),"utf8", (err) => {
        if (err) throw err;
            console.log("Database saved!");
    });
};

var express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    fs = require("fs"),
    database;

readDB();

// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + "/client"));

app.listen(3000);
console.log("Server is listening at 3000");

app.get("/contacts", function (req, res) {
    res.json(database.contacts);
});

app.post("/contacts", function (req, res) {
    "use strict";

    var newContact = req.body;
    database.contacts.push(newContact);
    writeDB();
    res.send("Contact posted");
});

app.get("/users", function (req, res) {
    res.json(database.users); 
});

app.post("/users", function (req, res) {
    var newUser = req.body;
    database.users.push(newUser);
    writeDB();
    res.send("New user added");
});

app.get("/users/:id", function (req, res) {
    var id = req.params.id;
    findUsersById(id, function (user) {
        res.json(user);
    });
});