const router       = require('express').Router();
const db           = require('../db');
const {check_form} = require('./check_form');
var atob           = require('atob');

// Decoding Cookie Data
function decode(token) {
    var ca = token;
    var base64Url = ca.split('.')[1];
    return JSON.parse(atob(base64Url));
}

// Date Format Change
function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
  


router.get('/', check_form, (req, res) => {

    if(req.cookies.jwt)
        var decodedValue = decode(req.cookies.jwt);

    db.query(`SELECT * from doctors`, (err, result) => {
        if(err) return res.send('Error while querying the database..');

        // console.log(result);
        let isValidated = false;
        if(req.cookies.jwt)
            isValidated = true;
        if(isValidated)
            res.render('appointment', {result: result, _id: decodedValue._id, isValidated});
        else 
            res.render('appointment', {result: result, isValidated});
    })
})

router.get('/:id', check_form, (req, res) => {

    var decodedValue;
    let isValidated = false;
        if(req.cookies.jwt){
            isValidated = true;
            decodedValue = decode(req.cookies.jwt);

            db.query(`SELECT * FROM doctors where registration_id = ${req.params.id} `, (err, result) => {
                if(err) return res.send(err);
                
                db.query(`SELECT status from appointment WHERE doctors_registration_id = ${req.params.id} AND users_registration_Id = ${decodedValue._id} AND status = 2`, (err2, status) => {

                    if(err2) return res.send(err2);
                    console.log('Status: ' + typeof(status[0]));
                    // res.send(status);
                    let status_value;
                    if(typeof(status[0]) == 'undefined')
                        status_value = 0;
                    else   
                        status_value = status[0].status;

                        console.log('status value: ' + status_value);
                    
                    // console.log(result[0]);
                    res.render('doctor_details', {result: result, isValidated, _id: req.params.id, user_id: decodedValue._id, user_type: decodedValue.user_type, status: status_value});
            
                })
                
            })
        }else {
            res.redirect('../authenticate');
        }
    
})

router.post('/book_appointment', check_form, (req, res) => {
    var decodedValue;
    if(req.cookies.jwt) {
        decodedValue = decode(req.cookies.jwt);
        if(decodedValue.user_type = 'user') {
            db.query(`SELECT * FROM users where registration_id = ${decodedValue._id}`, (err, result) => {
                if(err) return res.send('err sent during quering bro');

                db.query(`SELECT * FROM doctors where registration_id = ${req.body.doctor_id}`, (err2, result2) => {
                    if(err2) return res.send('err2 sent during during querying bro..');

                    res.render('appointment_details', {isValidated:true, _id: decodedValue._id, result: result, result2: result2, date: `${req.body.appointment_date}`})

                })
            }) 
            
        }else {
            res.redirect('../')
        }
    }else {
        res.redirect('/');
    }
})

router.post('/confirm', check_form, (req, res) => {
    
    if(req.cookies.jwt) {
        var decodedValue = decode(req.cookies.jwt);
        if(decodedValue.user_type == 'user') {
            // Today's Date
            var today = new Date();
            var date_now = today.getFullYear()+'-0'+(today.getMonth()+1)+'-0'+today.getDate();    

            let status = 1;

            console.log('Date.now: ' + date_now + ' Appointment: ' + req.body.appointment_date);
            if(req.body.appointment_date >= date_now)
                status = 2;

            db.query(`call appointment(${decodedValue._id}, ${req.body.doctor_id}, ${status}, '${req.body.appointment_date}', ${req.body.fee})`, (err, result) => {
                if(err) return res.send(err);

                res.redirect(`/user/${decodedValue._id}/?booked=true`);
            })
        }else {
            res.redirect('/');
        }

    }else {
        res.redirect('/');
    }
})

router.post('/appointed', check_form, (req, res)=> {

    if(req.cookies.jwt) {
        let decodedValue = decode(req.cookies.jwt);
        if(decodedValue.user_type = 'doctor') {
            db.query(`UPDATE appointment set status = 1 WHERE doctors_registration_id = ${decodedValue._id} AND users_registration_id=${req.query.user_id} AND status =2`, (err, result) => {
                if(err) return res.send(err);

                res.redirect(`/user/${decodedValue._id}/?changed=yes`);
            })
        }else {
            res.redirect(`user/${decodedValue._id}`);
        }
    }else {
        res.redirect('/authenticate');
    }
})

module.exports = router;