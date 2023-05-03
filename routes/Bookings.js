const { cancelBooking, createBooking, getBookingsByDate, getBookings, getBookingsById, generatePDF } = require('../controllers/Bookings.js')
const express  = require('express')

const router = express.Router()
router.post('/',createBooking)
router.get('/',getBookings)
router.get('/:id',getBookingsById)
router.delete('/:id', cancelBooking)
router.get('/search',getBookingsByDate)
router.get ('/download/:id',generatePDF)
module.exports = router;