// import mongoose from 'mongoose'
const mongoose = require('mongoose')
const express = require('express')
const BusScheduleRouter = require('./routes/BusSchedules')
const AuthController = require('./routes/auth');
const UserController = require('./routes/Users');
const BookingsController = require('./routes/Bookings');
const CityController = require('./routes/city')
const app = express();
const port = 2000
//Database connection
mongoose.connect('mongodb://localhost:27017/BusTicketBookings', {
     useNewUrlParser: true,useUnifiedTopology: true})
.then(() => {
  console.log('Connected to database');
})
.catch((e) => {
  console.log('Connection Failed');
});


//middleware
app.use(express.json())
app.use('/busSchedules',BusScheduleRouter)
app.use('/auth',AuthController)
app.use('/users',UserController)
app.use('/bookings',BookingsController)
app.use('/cities',CityController)
app.listen(port,()=>{
    const connection = mongoose.connection;
  connection.once('open',()=>{ 
    console.log('MongoDB database connection is successful');
  });
    console.log("Server listening on port",port)
  })
module.exports = app