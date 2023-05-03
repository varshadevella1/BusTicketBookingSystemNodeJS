const mongoose = require('mongoose')
const BusScheduleSchema = new mongoose.Schema({
    TravelsName:{
        type:String,
        require:true
    },
    type:{
        type:String,
        enum:["AC","Deluxe","Normal"]
    },
    fare:{
        type:Number,
        trim:true,
        required:true,
    },
    seatsAvailability:{
        type:Number,
        trim:true,
        default:30,
        maxlength:32
    },
    isAvailable:{
        type:Boolean,
        default:false
    },
    origin:{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'City'
        type:String,
        required:true
    },
    destination:{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'City'
        type:String,
        required:true
    },
    arrivalTime:{
        type:String,
        required:true
    },
    departureTime:{
        type:String,
        required:true
    },
    BusNumber:{
        type:String,
        required:true
    },
    journeyDate: {
        type: String
      },
    createdDate: {
        type: Date,
        default: Date.now
      },
      updatedDate: {
        type: Date,
        required: false
    }
})
module.exports = mongoose.model("BusSchedules",BusScheduleSchema)