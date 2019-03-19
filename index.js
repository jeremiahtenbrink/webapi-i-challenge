"use strict";
exports.__esModule = true;
var express = require("express"); // CommonJS Modules
// the same as import express from 'express'; // ES2015 Modules
var server = express();
var db = require("./data/db.js"); // added this line ************
server.use(express.json());
server.get('/', function (req, res) {
    res.send('new web server');
});
server.get('/api/users', function (req, res) {
    var users = db.find()
        .then(function (users) {
        res.status(200).json(users);
    })["catch"](function (err) {
        res.status(500).json({ message: 'The users information could not be retrieved.' });
    });
});
server.get('/api/users/:id', function (req, res) {
    var id = req.params.id;
    var user = db.findById(id)
        .then(function (user) {
        if (!user) {
            throw { status: 404, message: 'The user with the specified ID does not exist.' };
        }
        res.status(200).json(user);
    })["catch"](function (err) {
        res.status(err.status || 500).json({ message: err.message });
    });
});
server["delete"]('/api/users/:id', function (req, res) {
    var id = req.params.id;
    db.remove(id)
        .then(function (ressult) {
        if (ressult === 0) {
            throw { status: 404, message: 'The user with the specified ID does not exist.' };
        }
        db.find()
            .then(function (users) {
            res.status(200).json(users);
        });
    })["catch"](function (err) {
        res.status(err.status || 500).json({ message: err.status ? err.message : "The user could not be removed" });
    });
});
server.put('/api/users/:id', function (req, res) {
    var id = req.params.id;
    var changes = req.body;
    if (!changes.name || !changes.bio) {
        res.status(400).json(JSON.stringify("Please provide name and bio for the user."));
        return;
    }
    db.update(id, changes)
        .then(function (updated) {
        if (!!updated) {
            db.find()
                .then(function (user) {
                res.status(200).json(user);
            });
        }
        else {
            throw { status: 404, message: 'The user with the specified ID does not exist.' };
        }
    })["catch"](function (err) {
        res.status(err.status || 500).json({ message: err.status ? err.message : "The user information could not be modified." });
    });
});
server.post('/api/users', function (req, res) {
    var user = req.body;
    if (!user.name || !user.bio) {
        res.status(400).json({ message: 'Please provide name and bio for the user.' });
        return;
    }
    db.insert(user)
        .then(function (ressult) {
        if (ressult) {
            db.find().then(function (users) { return res.status(201).json(users); });
            return;
        }
        throw { status: 500, message: "There was an error while saving the user to the database" };
    })["catch"](function (err) {
        res.status(err.status || 500).json({ message: err.message ? err.message : 'There was an error while saving the user to the database' });
    });
});
server.listen(4000, function () {
    console.log('\n** API up and running on port 4k **');
});
// run yarn to download the dependencies || npm i
// yarn add express || npm i express
// yarn server || npm run server
// add index.js with this code
// loaded browser at http://localhost:4000
// npm run server vs yarn server
//# sourceMappingURL=index.js.map