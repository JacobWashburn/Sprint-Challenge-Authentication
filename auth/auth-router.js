const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config/secrets');

const db = require('../users/users-model');

router.post('/register', (req, res) => {
    let user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    db.add(user)
        .then(addedUser => {
            res.status(201).json(addedUser);
        })
        .catch(error => {
            console.log('add a user error', error);
            res.status(500).json({
                message: 'there was an error adding a user.',
                error: error
            });
        });
});

router.post('/login', (req, res) => {
    let {username, password} = req.body;
    db.findBy({username})
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = signToken(user);
                res.status(200).json({
                    message: `Welcome ${user.username}!`,
                    token
                });
            } else {
                console.log('else user', user);
                res.status(500).json({message: 'Invalid Credentials'});
            }
        })
        .catch(error => {
            console.log('login error', error);
            res.status(500).json({message: 'login error'});
        });
});

function signToken(user) {
    const payload = {
        user
    };
    const options = {
        expiresIn: '1d'
    };
    return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
