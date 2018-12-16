const express = require('express');
const router = express.Router();
const uuid = require('uuid4');

function getSessionCookie(req, res) {
    if(req.cookies.userId) {
        console.log("Found the following userId: " + req.cookies.userId);
    } else {
        res.cookie("userId", uuid());
    }
}

router.get('/', function (req, res, next) {
    getSessionCookie(req, res);
    res.sendFile('index.html', {root: './pages'});
});

module.exports = router;
