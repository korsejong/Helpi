const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	res.render('index', { 
		title: 'HELPi',
		message: req.flash('message'),
	});
});

module.exports = router;
