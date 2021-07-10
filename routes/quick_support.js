const router       = require('express').Router();
const {check_form} = require('./check_form');
var atob           = require('atob');

// Decoding Cookie Data
function decode(token) {
    var ca = token;
    var base64Url = ca.split('.')[1];

    return JSON.parse(atob(base64Url));
}

router.get('/', check_form, (req, res) => {
    
    var decodedValue;
    let isValidated = false;
    if(req.cookies.jwt){
        isValidated = true;
        decodedValue = decode(req.cookies.jwt);
        
        res.render('quick_support', {isValidated, _id: decodedValue._id});
    }else {
        res.render('quick_support', {isValidated});
    }
    
    
})

module.exports = router;