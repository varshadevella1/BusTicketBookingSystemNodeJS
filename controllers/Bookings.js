const Bookings = require('../models/Bookings')
const BusSchedules = require('../models/BusSchedules')
const crypto = require('crypto')
const PDFDocument = require('pdfkit')
const fs= require('fs')
const path = require('path')
const BookingLogger = require('./logger')

const generatePNR = () => {
    const randomBytes = crypto.randomBytes(10);
    const hexString = randomBytes.toString('hex');
    return hexString.slice(0, 10).toUpperCase();
};

 async function calculatePrice(BusNumber, seatsBooked) {
    const bus = await BusSchedules.findById(BusNumber);
    const totalPrice = bus.fare * seatsBooked;
    return totalPrice;
  }
  
const createBooking = async (req, res) => {
    try{
    const {Date,NumberOfSeatsBooked,BookedBy,BusNumber,verification}=req.body;
    const Price= await calculatePrice(BusNumber,NumberOfSeatsBooked)
    const PNR = generatePNR()
    const newBooking = new Bookings({
          PNR,Date,NumberOfSeatsBooked,BookedBy,BusNumber,verification,Price
    })
    await newBooking.save();
    const bus = await BusSchedules.findOne({ _id: BusNumber });
    const new_seatsAvailability = bus.seatsAvailability - newBooking.NumberOfSeatsBooked;
    const updateBusSchedule = await BusSchedules.updateOne(
        { _id: BusNumber },
        { $set: { seatsAvailability :new_seatsAvailability } }
      );
    res.status(200).json({ 
        success: true,
         message: 'Booking created successfully',
         data:newBooking
        });
        BookingLogger.log('info','Successfully created Booking')
}
catch(error){
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
    BookingLogger.log('error','Error in creating Booking')
}
}

const getBookings = async (req, res) => {
    try {
        const bookings = await Bookings.find().sort({ Date: 1 })
        res.status(200).json({
            success: true,
            message: "Successful ",
            data: bookings
        })
        BookingLogger.log('info','Successfully got Bookings')
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Data Not found"
        });
        BookingLogger.log('error','Error in getting Bookings')
    }
}


const getBookingsById = async (req, res) => {
    const id = req.params.id
    try {
        const booking = await Bookings.findById(id.sort({ date: 1 }))
        res.status(200).json({
            success: true,
            message: "Successful",
            data: booking
        });
        BookingLogger.log('info','Successfully got Booking')
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Data not found"
        });
        BookingLogger.log('error','Error in getting Booking')
    }
}


const getBookingsByDate = async (req, res) => {
    const Date = req.body.Date
    try {
        const bookings = await Bookings.find({ Date })
        res.status(200).json({
            success: true,
            message: "Successful",
            data: bookings
        })
        BookingLogger.log('info','Successfully got Booking')
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Data Not found"
        });
        BookingLogger.log('error','Error in getting Booking')
    }
}

const cancelBooking = async (req, res) => {
    const id = req.params.id;
    try {
        await Bookings.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Successfully deleted"
        });
        BookingLogger.log('info','Successfully deleted Booking')
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Unable to delete"
        });
        BookingLogger.log('error','Error in deleting Booking')
    }
}

const generatePDF =async(req,res)=>{
    const id= req.params.id
    try{
       const booking = await Bookings.findById(id);
       if (!booking) {
        res.status(400).json({
            success: false,
            message: "No Data with matching ID"
        })
        BookingLogger.log('error','No Data with matching booking ID')
    }
    const doc= new PDFDocument();
    const fileName = `${booking.id}.pdf`;
    doc.pipe(fs.createWriteStream(`${booking.id}.pdf`));
    doc.fontSize(20).text('Booking Details');
    doc.fontSize(14).text(`ID: ${booking.id}`);
    doc.fontSize(14).text(`Date: ${booking.Date}`);
    doc.fontSize(14).text(`NumberOfSeatsBooked: ${booking.NumberOfSeatsBooked}`);
    doc.fontSize(14).text(`BookedBy: ${booking.BookedBy}`);
    doc.fontSize(14).text(`BusNumber: ${booking.BusNumber}`);
    doc.fontSize(14).text(`verification: ${booking.verification}`);
    doc.end();
    const pdfUrl = `${req.protocol}://${req.get('host')}/${fileName}`;
    res.status(200).json({
        success:true,
        message:"PDF created Successfully",
        data:booking,
        pdfUrl
    });
    BookingLogger.log('info','Successfully generated PDF for Booking')
    }
    catch(err){
        res.status(400).json({
            success:false,
            message:"Error while generating pdf"
        });
        BookingLogger.log('error','Error while generating PDF for Booking')
    }

}

module.exports= { cancelBooking, createBooking, getBookingsByDate, getBookings, getBookingsById, generatePDF }