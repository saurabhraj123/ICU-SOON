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

    // console.log(req.body.description);

    db.query(`INSERT INTO ${decodedValue.user_type}s VALUES (${decodedValue._id}, '${req.body.fname}', '${req.body.lname}', '${req.body.gender}', '${req.body.cnumber}', '${req.body.specialization}', "${req.body.clinic}", ${req.body.fee}, '${req.body.country}', '${req.body.state}', '${req.body.pin}', '${req.body.from}', '${req.body.to}', "${req.body.description}", "${req.body.about_me}")`, (err, result) => {

        if(err) return res.send(err);

        res.redirect('/');
    });
    // res.send(req.body.from);
})

router.get('/:id', check_form, (req, res) => {
    
    if(req.cookies.jwt)
        var decodedValue = decode(req.cookies.jwt);

    if(req.cookies.jwt){
        db.query(`SELECT * FROM ${decodedValue.user_type}s JOIN registrations USING(registration_id) WHERE registration_id = ${decodedValue._id}`, (err, result) => {

            if(err) return res.send('Error in first query..');

            db.query(`SELECT d.first_name, d.last_name, a.appointment_date, a.status, a.appointment_id FROM ${decodedValue.user_type}s JOIN registrations USING(registration_id) JOIN appointment a ON ${decodedValue.user_type}s.registration_id = a.${decodedValue.user_type}s_registration_id JOIN doctors d ON a.doctors_registration_id = d.registration_id WHERE ${decodedValue.user_type}s.registration_id = ${decodedValue._id} ORDER BY a.appointment_id DESC `, (err2, result2) => {
                
                if(err2) return res.send(err2);

                console.log(result[0]);
                console.log("RESULT: " + result2);
                // if(typeof(result2 == 'undefined'))
                //     result2 = [];
                console.log("RESULT: " + result2);
                // res.send(result2);
                
                console.log('Url Query: ' + req.query.booked);
                res.render('profile_user', {isValidated:true, result:result[0], results: result2, booked: req.query.booked});
            })
            
        })
        
    }else
        res.redirect('../authenticate')
})

module.exports = router;