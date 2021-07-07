const db = require('../db');
const jwt = require('jsonwebtoken');

// module.exports.check_form = (req, res, next) => {
    
//     const token = req.cookies.jwt;
//     if(!token) return res.send('no');
    
    // try {
    //     const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    //     req.user = verified;

    //     db.query(`Select * FROM ${req.user.user_type} where registration_id = ${req.user.registration_id}`, (err, result) => {
    //         if(err) return res.send(err);

    //         if(result[0].length == 0){
    //             res.redirect(`user/form_${req.user.user_type}`);
    //         }
    //         next();
    //     });
    // }catch(err) {
    //     res.send('Invalid authentication token');
    // }
// }

module.exports.check_form = async (req, res, next) => {
    console.log('worked');
    
    if(!req.cookies.jwt) return next();

    const token = req.cookies.jwt;

    // console.log('Secret' + process.env.TOKEN_SECRET);
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log('User iD: ' + req.user._id);
        db.query(`Select * FROM ${req.user.user_type}s where registration_id = ${req.user._id}`, (err, result) => {
            if(err) return res.send('This error: ' + err);

            // res.send('Lenght' + result.length);
            if(result.length == 0){
                res.redirect(`user/form_${req.user.user_type}`);
            }else {
                next();
            }
           
        });
        
    }catch(err) {
        // res.send(err);
        // next()
        console.log(err);
    }


    // next();
}
