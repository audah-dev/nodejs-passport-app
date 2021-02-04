const { Router } = require('express');

const router = Router();

// Welcome page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard page
router.get('/dashboard', (req, res) => res.render('dashboard'));

module.exports = router;