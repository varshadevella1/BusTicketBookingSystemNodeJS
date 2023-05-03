const mongoose = require('mongoose')
const CitySchema = new mongoose.Schema({
    city:{
        type:String,
        require:true
    },
    cityCode:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("City", CitySchema);