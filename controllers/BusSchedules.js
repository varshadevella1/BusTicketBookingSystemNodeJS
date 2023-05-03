const express = require('express')
const BusSchedules = require('../models/BusSchedules')
const Bookings = require('../models/Bookings')
const fs= require('fs')
const BusesLogger = require('./logger')
const cities = require('../models/cities')
const csv = require('csv-parser')


const getUpdatedBuses = async(req,res)=>{
    
    let buses =[]
    try{
        buses =await BusSchedules.aggregate([
            {
              $lookup: {
                from:"Bookings",
                localField:"_id",
                foreignField: "BusNumber",
                as: "seatsAvailability"
              }
            },
            {
              $project: {
                _id: 1,
                TravelsName:1,
                origin:1,
                destination:1,
                arrivalTime:1,
                departureTime:1,
                busNumber:1,
                seatsAvailability:1,
                NumberOfSeatsBooked:"$bookings.NumberOfSeatsBooked",
                result: { $subtract: [ '$seatsAvailability','$NumberOfSeatsBooked'] }
              }
            }
          ]).then(res.status(200).json({
            success: true,
            message: "Successful",
            data:buses
        }))

    }
    catch(err){
        res.status(404).json({
            success: false,
            message: "Data Not found"
        });
    }
}

const getAllBuses = async (req, res) => {
    try {
        const buses = await BusSchedules.find({}).sort({createdDate:-1}).populate({path:"origin destination"})
        res.status(200).json({
            success: true,
            message: "Successful",
            data: buses
        })
        BusesLogger.log('info','Successfully got BusSchedules')
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Data Not found"
        });
        BusesLogger.log('error','Error in finding BusSchedules')
    }
}

const getAllAvailableBuses = async(req,res)=>{
    try{
    const buses = await BusSchedules.find({isAvailable:true})
    res.status(200).json({
        success:true,
        message:"Successful",
        data:buses
    })
    BusesLogger.log('info','Successfully got available BusSchedules')
    }
    catch(err){
        res.status(400).json({
            success:false,
            message:"Data not found"
        })
        BusesLogger.log('error','Error in finding BusSchedules')
    }
}

const getAllUnAvailableBuses = async(req,res)=>{
    try{
    const buses = await BusSchedules.find({isAvailable:false})
    res.status(200).json({
       success:true,
        message:"Successful",
        data:buses
    })
    BusesLogger.log('info','Successfully got Unavailable BusSchedules')
    }
    catch(err){
        res.status(400).json({
            success:false,
            message:"Data not found"
        })
     c
    }
}

const getSingleBusSchedule = async (req, res) => {
    const id = req.params.id;
    try {
        const bus = await BusSchedules.findById(id);
        if (bus != null) {
            res.status(200).json({
                success: true,
                message: "Successful",
                data: bus
            });
            BusesLogger.log('info','Successfully got BusSchedule')
        }
        else {
            res.status(400).json({
                success: false,
                message: "No data with requested id"
            })
            BusesLogger.log('error','Error in finding BusSchedule')
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Data Not found"
        });
        BusesLogger.log('error','Error in finding BusSchedule')
    }
}

const cancelBusSchedule = async (req, res) => {
    const id = req.params.id;
    try {
        await BusSchedules.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Successfully deleted"
        });
        BusesLogger.log('info','Successfully deleted BusSchedule')
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Unable to delete"
        });
        BusesLogger.log('error','Error in deleting BusSchedule')
    }
}

const createNewBusSchedule = async (req, res) => {
    const newBusSchedule = new BusSchedules(req.body)
    try {
        if(!newBusSchedule){
        const savedBusSchedule = await newBusSchedule.save().sort({created:1})
        res.status(200).json({ success: true, message: "Successfully created", data: savedBusSchedule })
        BusesLogger.log('info','Successfully created new BusSchedule')
        }
        else{
             res.status(400).json({
                success:false,
                message:"Bus is already scheduled"
            })
            BusesLogger.log('error','Error in creating new BusSchedule')
        }
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Failed to create" })
        BusesLogger.log('error','Error in creating BusSchedule')
    }
}


const updateBusSchedule = async (req, res) => {
    const id = req.params.id
    const bookingId = req.params.id
    try { 
        const booking = await Bookings.findById(bookingId)
        const updatedBusSchedule = await BusSchedules.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true })
        res.status(200).json({ success: true, message: "Successfully updated", data: updatedBusSchedule })
        BusesLogger.log('info','Successfully updated BusSchedule')
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Failed to update Tour" })
        BusesLogger.log('error','Error in updating BusSchedule')
    }
}

const searchBuses = async (req, res) => {
    const { origin, destination, journeyDate } = req.query;
    try {
        const buses = await BusSchedules.find({origin,destination,journeyDate, type: { $in: type }})
        if(buses.length<=0){
            res.status(400).json({
                success:false,
                message:"No data with matching search found"
            })
            BusesLogger.log('info','Successfully got BusSchedules')
        }
        else{
        res.status(200).json({
            success: true,
            message: "Successful",
            data: buses
        })
        BusesLogger.log('error','Error in fetching BusSchedules')
    }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Data Not found"
        });
        BusesLogger.log('error','Error in fetching BusSchedules')
    }
}

const SearchBusesByName = async(req,res)=>{
    const TravelsName = req.query.TravelName;
    try{
        const buses = await BusSchedules.find({TravelsName: {$regex: "^" + TravelsName}})
        if(buses.length<=0){
            res.status(400).json({
                success:false,
                message:"No data found with the search"
            })
            BusesLogger.log('error','Error in fetching BusSchedule')
        }
        else{
            res.status(200).json({
                success:true,
                message:"Successful",
                data:buses
            });
            BusesLogger.log('info','Successfully got BusSchedule')
        }
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"No data Found"
        });
        BusesLogger.log('error','Error in fetching BusSchedule')
    }
}

const searchByFilter = async(req,res)=>{
    const {origin,destination,journeyDate} = req.body;
    try{
    const bus= await BusSchedules.find({
        origin,destination,journeyDate,isAvailable:true,
    })
    res.status(200).json({
        success:true,
        message:"Successful",
        data:bus
    })
    BusesLogger.log('info','Successfully got BusSchedules')

}
catch(err){
    res.status(400).json({
        success:false,
        message:"No Data Found"
    })
    BusesLogger.log('error','Error in fetching BusSchedule')
}
}

const getBusesByOrigin = async (req, res) => {
    try {
        const Origin = origin ? { origin: { $regex: new RegExp(origin), $options: 'i' } } : {}
        BusSchedules.find({ Origin }).then(data => {
            if (data.length === 0) {
                res.send("Cannot find data")
                BusesLogger.log('error','Error in fetching BusSchedule')
            }
            else {
                res.send(data)
                BusesLogger.log('info','Successfully got BusSchedules')
            }
        })

    }
    catch (err) {
        res.status(404).json({
            success: false,
            message: "Data Not found"
        });
        BusesLogger.log('error','Error in fetching BusSchedule')
    }
}

const data = []
fs.createReadStream('file.csv')
    .pipe(csv()).on('data',(row)=>{
          data.push(row);
      })
const ImportCSVFile = async(req,res)=>{
 try{
    const records = await BusSchedules.insertMany(data)
    res.status(200).json({
        success:true,
        message:"data Inserted Successfully into Mongo DB",
        data:records
    });
    BusesLogger.log('info','Successfully imported CSV File')
 }
 catch(err){
    res.status(400).json({
       success:false,
       message:"Server Error"
    })
    BusesLogger.log('error','Error in importing CSV File ')
 }
};

module.exports = {ImportCSVFile, SearchBusesByName, cancelBusSchedule, createNewBusSchedule, getAllAvailableBuses, getAllBuses, getAllUnAvailableBuses, getBusesByOrigin, getSingleBusSchedule, searchBuses, searchByFilter, updateBusSchedule }