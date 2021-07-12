const express        = require('express');
const router         = express.Router();
const {check_form}   = require('./check_form');
var atob             = require('atob');
const db             = require('../db');

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
        
        let reg_pre = 'd';
        if(decodedValue.user_type == 'user')
            reg_pre = 'u';

        let appointment_status = 1;
        // db.query(`SELECT * FROM appointment WHERE appointment_status = 2 AND `)

        db.query(`SELECT u.registration_id as u_registration_id, u.first_name as u_first_name, u.last_name as u_last_name, d.registration_id as d_registration_id, d.first_name as d_first_name, d.last_name as d_last_name, nv.message as message, notification_status, n.user_type, n.date FROM notifications n JOIN doctors d ON d.registration_id = n.doctors_registration_id JOIN users u ON u.registration_id = n.users_registration_id JOIN notification_value nv ON nv.id = n.notification_value WHERE n.${decodedValue.user_type}s_registration_id = ${decodedValue._id} AND user_type = '${decodedValue.user_type}' ORDER BY notification_id DESC` , (err, result) => {
            
            if(err) return res.send(err);

            // const notification_result = result;
            console.log(result);
            res.render('home', {page: 'home', isValidated: req.cookies.jwt, _id: decodedValue._id, notification: result});
        })
        
    }else {
        res.render('home', {page: 'home', isValidated: req.cookies.jwt, notification: []});
    }
    
});

module.exports = router;
