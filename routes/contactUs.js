const router = require('express').Router();

router.get('/', (req, res) => {
    if(req.cookies.jwt) {
        res.render('contactUs', {isValidated:true});
    }else {
        res.render('contactUs', {isValidated:false});
    }
})

module.exports = router;