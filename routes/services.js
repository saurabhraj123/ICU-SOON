const router = require('express').Router()
const atob = require('atob');

// Decoding Cookie Data
function decode(token) {
    var ca = token;
    var base64Url = ca.split('.')[1];

    return JSON.parse(atob(base64Url));
}

router.get('/', (req, res)=> {
    if(req.cookies.jwt) {
        const decodedValue = decode(req.cookies.jwt);
        res.render('services', {isValidated: true, _id: decodedValue._id});
    } else{
        res.render('services', {isValidated: false});
    }
})

module.exports = router;