const router = require('express').Router();
const db = require('../users/users-model');

router.get('/', (req, res) => {
    db.find()
        .then(users => {
            if (users) {
                res.status(200).json({users});
            } else {
                res.status(404).json({message: 'There are no users in the database.'});
            }
        })
        .catch(error => {
            console.log('get all users error', error);
            res.status(500).json({message: 'There was an error getting users.'});
        });
});

module.exports = router;