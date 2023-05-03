const mongoose = require('mongoose')
const BookingSchema = new mongoose.Schema({
    Price:{
        type:Number,
        required:true
    },
    Date:{
        type:Date,
        default: Date.now
    },
    NumberOfSeatsBooked:{
        type:Number,
        required:true
    },
    BookedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    BusNumber :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusSchedules'
    },
    verification: {
        type: String,
        enum: ["verified", "notverified", "payed"],
        default: "notverified"
      },
    PNR :{
       type:String,
       required:true
    }
},
{ timestamps: true }
)
module.exports =  mongoose.model("Bookings",BookingSchema)