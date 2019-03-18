import express = require('express'); // CommonJS Modules
// the same as import express from 'express'; // ES2015 Modules

const server = express();
import db = require('./data/db.js'); // added this line ************
server.use(express.json());


server.get('/', (req, res) => {
    res.send('new web server');
});

server.get('/api/users', (req, res) => {
    const users = db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({message: 'The users information could not be retrieved.'});
        });
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = db.findById(id)
        .then(user => {
            if(!user){
                throw {status: 404, message: 'The user with the specified ID does not exist.'};
            }
            res.status(200).json(user);
        }).catch(err => {
            res.status(err.status || 500).json({message: err.message});
        });
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(ressult => {
            if(ressult === 0){
                throw {status: 404, message: 'The user with the specified ID does not exist.'};
            }
            db.find()
                .then(users => {
                    res.status(200).json(users);
                })
        }).catch(err => {
        res.status(err.status || 500).json({message: err.status ? err.message : "The user could not be removed"});
    })

});

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const changes =req.body;

    if (!changes.name || !changes.bio){
        res.status(400).json(JSON.stringify("Please provide name and bio for the user."));
        return;
    }

    db.update(id, changes)
        .then(updated => {
            if(!!updated){
                const user = db.findById(id)
                    .then(user => {
                        res.status(200).json(user);
                    })
            }else {
                throw {status: 404, message: 'The user with the specified ID does not exist.'};
            }

        }).catch(err => {
        res.status(err.status || 500).json({message: err.status ? err.message : "The user information could not be modified."});
    });

});

server.post('/api/users', (req, res) => {
    const user =req.body;
    if (!user.name || !user.bio){
        res.status(400).json({message: 'Please provide name and bio for the user.'})
        return;
    }

    db.insert(user)
        .then(ressult => {
            db.findById(ressult.id)
                .then(user => {
                    res.status(201).json(user);
                })
        }).catch(err => {
        res.status(500).json({message: 'There was an error while saving the user to the database'});
    });

});

server.listen(4000, () => {
    console.log('\n** API up and running on port 4k **');
});

// run yarn to download the dependencies || npm i
// yarn add express || npm i express
// yarn server || npm run server
// add index.js with this code
// loaded browser at http://localhost:4000

// npm run server vs yarn server
