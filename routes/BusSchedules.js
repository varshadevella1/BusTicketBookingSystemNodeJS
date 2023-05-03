// import express from 'express'
const { ImportCSVFile, SearchBusesByName, cancelBusSchedule, createNewBusSchedule, getAllAvailableBuses, getAllBuses, getAllUnAvailableBuses, getBusesByOrigin, getSingleBusSchedule, searchBuses, searchByFilter, updateBusSchedule } = require('../controllers/BusSchedules.js')
const { validateToken, verifyAdmin } = require ('../utils/verifyToken.js')
const express = require('express')
const router = express.Router();

router.get('/',getAllBuses)
router.get('/:id',getSingleBusSchedule)
router.get('/all-bus-available',getAllAvailableBuses)
router.get('/all-bus-unavailable',getAllUnAvailableBuses)
router.delete('/:id',validateToken,cancelBusSchedule)
router.post('/',createNewBusSchedule)
router.put('/:id',updateBusSchedule);
router.get('/search',searchBuses);
router.post('/filter',searchByFilter);
router.post('/',getBusesByOrigin);
router.get('/searchByName',SearchBusesByName)
router.post('/import-csv',ImportCSVFile)
module.exports = router;