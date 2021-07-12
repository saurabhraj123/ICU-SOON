const db = require('../db');
var atob = require('atob');
const jwt = require('jsonwebtoken');

function decode(token) {
    var ca = token;
    var base64Url = ca.split('.')[1];

    return JSON.parse(atob(base64Url));
}

function notification (req, res, next) {

    if(req.cookies.jwt) {
        var decodedValue = decode(req.cookies.jwt);
        db.query(`SELECT * FROM notifications WHERE ${decodedValue.user_type}s_registration_id = ${decodedValue._id} AND user_type = '${decodedValue.user_type}' ` , (err, result) => {
            
            if(err) return res.send(err);

            // const notification_result = result;
            console.log(result);
            next();
        })
    }else {
        res.redirect('/');
    }   
}

module.exports = notification;