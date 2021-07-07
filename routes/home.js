const express = require('express');
const router = express.Router();
const {check_form} = require('./check_form');

// Get Request
router.get('/',  check_form, (req, res) => {
    res.render('home', {page: 'home', isValidated: req.cookies.jwt});
});

module.exports = router;
