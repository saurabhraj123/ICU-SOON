const router = require('express').Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

// Schema for JOI
const schema = {
    email: Joi.string().min(3).email().required(),
    password: Joi.string().min(6).required(),
    user_type: Joi.string()
}

router.get('/', async (req,res) => {
    if(!req.cookies.jwt)
        res.render('authentication');
    else
        res.redirect('/');
})

router.post('/', async (req, res) => {
    
    // User Login Request..
    if(req.body.auth === 'Log In'){
        // Querying Database to authenticate the user
        db.query(`call getUser('${req.body.email}')`, async (err, result) => {    
            if(err) { 
                res.send(err);
                return; 
            }

            // Validating the Input
            if(result[0].length == 0) {
                res.render('authentication', {notValidated:true})
                return;
            }else {
                // Hashing and Comparing Password using bcrypt
                const validate = await bcrypt.compare(req.body.password, result[0][0].password);

                // Password Incorrect
                if(!validate) {
                    // res.send('Invalid Username or Password');
                    res.render('authentication', {notValidated: true})
                    return;
                }

                // Creating JSON Web Token
                const token = jwt.sign({_id: result[0][0].registration_id, user_type: result[0][0].user_type}, process.env.TOKEN_SECRET);
                
                // Saving jwt token
                res.cookie('jwt', token, {httpOnly:true});
    
                console.log(result[0][0].password);
                // console.log(page);
                // res.send(result);

                isValidated = false;

                if(req.cookies.jwt)
                    isValidated = true;
                res.redirect('/')
            }
            
            
            
            }
        )
    
    // Sign Up Request..
    }else if(req.body.auth === 'Sign Up'){
        // Validating User Input using Joi
        const { error } = Joi.validate({email: req.body.email_field, password: req.body.password_field, user_type: req.body.user_type}, schema);

        // console.log(error);
        if(error) return res.status(400).render('authentication', {Joi: error})

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password_field, salt);

            let user_type = req.body.user_type;

            db.query(`call register('${req.body.email_field}', '${hashedPassword}', '${user_type}')`, (err, result) => {
                if(err){
                    // console.log(err);
                    return res.render('authentication', {exists: true});
                }
                res.render('authentication', {registered: true});
            })

        }catch(err) {
            console.log('An error was thrown in Sign Up', err);
            res.send('An error was thrown in Sign Up');
        }
    }else {
        res.send('Sorry, something went wrong!');
    }
        
})

router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
})

module.exports = router;