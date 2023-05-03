const cities = require('../models/cities')

const getAllCities =async(req,res)=>{
try{
        const city= await cities.find({})
        res.status(200).json({
            success:true,
            message:"Successful",
            data:city
        })
    } catch(err){
        res.status(404).json({
            success:false,
            message:"Data Not found"
        });
    }
}
module.exports = {getAllCities}