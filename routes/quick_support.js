const router = require('express').Router();

router.get('/', (req, res) => {
    
    let isValidated = false;
    
    if(req.cookies.jwt)
        isValidated = true;
    
        res.render('quick_support', {isValidated});
})

module.exports = router;