const router = require('express').Router();
const db     = require('../db');

router.get('/', (req, res) => {

    db.query(`SELECT * from doctors`, (err, result) => {
        if(err) return res.send('Error while querying the database..');

        // console.log(result);
        let isValidated = false;
        if(req.cookies.jwt)
            isValidated = true;
        res.render('appointment', {result: result, isValidated});
    })
})


module.exports = router;