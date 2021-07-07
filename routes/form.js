const {check_form} = require('./check_form');
const router       = require('express').Router();
const db           = require('../db');
var atob           = require('atob');

function decode(token) {
    var ca = token;
    var base64Url = ca.split('.')[1];

    return JSON.parse(atob(base64Url));
}

router.get('/form_user', (req, res) => {
    if(req.cookies.jwt){
        // res.render('form_user');
        

        var decodedValue = decode(req.cookies.jwt);

        db.query(`SELECT * FROM ${decodedValue.user_type}s where registration_id = ${decodedValue._id}`, (err, result) => {
            if(err) return res.send('This is an error here bro..');

            if(result.length == 0)
                res.render('form_user');
            else {
                res.redirect('/');
            }
        })
        // res.send(decodedValue["user_type"]);
    }
    else 
        res.redirect('../authenticate');
});


router.post('/form_user', (req, res) => {
    var decodedValue = decode(req.cookies.jwt);

    db.query(`INSERT INTO ${decodedValue.user_type}s VALUES (${decodedValue._id}, '${req.body.fname}', '${req.body.lname}', '${req.body.gender}', ${req.body.age}, '${req.body.cnumber}', '${req.body.state}', '${req.body.city}', '${req.body.pin}')`, (err, result) => {

        if(err) return res.send(err);

        res.redirect('/');
    });
});

// Doctor 
router.get('/form_doctor', (req, res) => {
    if(req.cookies.jwt){
        // res.render('form_user');
        

        var decodedValue = decode(req.cookies.jwt);

        db.query(`SELECT * FROM ${decodedValue.user_type}s where registration_id = ${decodedValue._id}`, (err, result) => {
            if(err) return res.send('This is an error here bro..');

            if(result.length == 0)
                res.render('form_doctor');
            else {
                res.redirect('/');
            }
        })
        // res.send(decodedValue["user_type"]);
    }
    else 
        res.redirect('../authenticate');
})

router.post('/form_doctor', (req, res) => {
    var decodedValue = decode(req.cookies.jwt);

    console.log(req.body.gender);

    db.query(`INSERT INTO ${decodedValue.user_type}s VALUES (${decodedValue._id}, '${req.body.fname}', '${req.body.lname}', '${req.body.gender}', '${req.body.cnumber}', '${req.body.specialization}', '${req.body.clinic}', ${req.body.fee}, '${req.body.country}', '${req.body.state}', '${req.body.pin}', '${req.body.from}', '${req.body.to}')`, (err, result) => {

        if(err) return res.send(err);

        res.redirect('/');
    });
    // res.send(req.body.from);
})


module.exports = router;