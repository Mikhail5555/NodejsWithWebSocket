const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.sendFile('game.html', {root: './public'});
});

module.exports = router;