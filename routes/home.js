const express      = require('express');
const router       = express.Router();
const {check_form} = require('./check_form');
var atob           = require('atob');

// Decoding Cookie Data
function decode(token) {
    var ca = token;
    var base64Url = ca.split('.')[1];

    return JSON.parse(atob(base64Url));
}

// Get Request
router.get('/',  check_form, (req, res) => {
    if(req.cookies.jwt) {
        var decodedValue = decode(req.cookies.jwt);
        res.render('home', {page: 'home', isValidated: req.cookies.jwt, _id: decodedValue._id});
    }else {
        res.render('home', {page: 'home', isValidated: req.cookies.jwt});
    }
    
});

module.exports = router;
