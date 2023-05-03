const { getAllCities } = require('../controllers/city.js')
const express = require('express')

const router = express.Router()
router.get('/',getAllCities)

module.exports = router;