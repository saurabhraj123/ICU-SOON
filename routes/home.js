const express = require('express');
const router = express.Router();


// Get Request
router.get('/', (req, res) => {
    res.render('home', {page: 'home', isValidated: req.cookies.jwt});
});

module.exports = router;
