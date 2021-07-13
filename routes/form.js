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

            if(err) return res.send(err);

            if(decodedValue.user_type == 'user') {
                db.query(`SELECT d.first_name, d.last_name, d.registration_id, DATE(a.appointment_date) AS appointment_date, a.status, a.appointment_id FROM ${decodedValue.user_type}s JOIN registrations USING(registration_id) JOIN appointment a ON ${decodedValue.user_type}s.registration_id = a.${decodedValue.user_type}s_registration_id JOIN doctors d ON a.doctors_registration_id = d.registration_id WHERE ${decodedValue.user_type}s.registration_id = ${decodedValue._id} ORDER BY a.appointment_id DESC `, (err2, result2) => {
                    
                    if(err2) return res.send(err2);

                    // console.log(result[0]);
                    // console.log("RESULT: " + result2);
                    // if(typeof(result2 == 'undefined'))
                    //     result2 = [];
                    // console.log("RESULT: " + result2);
                    // console.log("Appointment_date: " + result2[0].appointment_date);
                    // res.send(result2);
                    
                    console.log('Url Query: ' + req.query.booked);
                    res.render('profile_user', {isValidated:true, result:result[0], results: result2, booked: req.query.booked});
                })
            } else {
                // console.log('he  is a doctor');   
                var isValidated = true;
                console.log('isValidated: ' + isValidated);

                db.query(`call doctor_patient_details(${decodedValue._id})`, (err, result2) => {

                    if(err) return res.send(err);
                    // console.log('reSULTS' + result2);
                    // res.send(result2[0][1].first_name);
                    res.render('profile_doctor', {isvalidated:isValidated, result:result[0],results:result2[0]});
                })
            }
        })
        
    }else
        res.redirect('../authenticate')
})

router.get('/:id/more', check_form, (req, res) => {

    if(req.cookies.jwt) {
        var decodedValue = decode(req.cookies.jwt);
        let user_id;
        let doctor_id;
        if(decodedValue.user_type == 'doctor'){
            user_id = req.query.user_id;
            doctor_id = decodedValue._id;
        }else {
            user_id = decodedValue._id;
            doctor_id = req.query.doctor_id;
        }
        db.query(`SELECT * FROM users JOIN registrations on (users.registration_id) where users.registration_id=${user_id} `, (err, result) => {
            if(err) return res.send(err);

            db.query(`SELECT * FROM doctors where registration_id = ${doctor_id}`, (err2, result2) => {
                
                if(err2) return res.send(err2);

                // res.send(result);
                res.render('show_more', {isValidated:true, result: result, result2: result2, _id: decodedValue._id, user_type: decodedValue.user_type, status: req.query.status, user_id: req.query.user_id});
            })
        })
    }else{
        res.redirect('/authenticate');
    }
})

module.exports = router;