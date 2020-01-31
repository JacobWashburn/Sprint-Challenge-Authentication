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
  // implement login
});

module.exports = router;
