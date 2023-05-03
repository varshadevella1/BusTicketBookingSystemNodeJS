const Users = require('../models/Users');
const usersLogger = require('./logger')

const updateUser = async(req,res)=>{
    const id= req.params.id
    try{
      const updatedUser = await Users.findByIdAndUpdate(id,{
        $set:req.body
      },{new:true})
      res.status(200).json({ success: true, message: "Successfully updated user", data: updatedUser })
      usersLogger.log('info','Successfully in updating User')
    }
    catch(error){
        res.status(404).json({ success: false, message: "Failed to update user" })
        usersLogger.log('error','Error in updating User')
    }
}

const deleteUser = async(req,res)=>{
    const id = req.params.id;
    try{
        await Users.findByIdAndDelete(id);
        res.status(200).json({
            success:true,
            message:"Successfully deleted user"
        });
        usersLogger.log('info','Successfully in deleting User')
    }catch(err){
        res.status(404).json({
            success:false,
            message:"Unable to delete user"
        });
        usersLogger.log('error','Error in deleting User')
    }
}

const getAllUsers = async(req,res)=>{
    try{
        const users= await Users.find({})
        res.status(200).json({
            success:true,
            message:"Successful",
            data:users
        });
        usersLogger.log('info','Successfully got list of Users')
    } catch(err){
        res.status(404).json({
            success:false,
            message:"Data Not found"
        });
        usersLogger.log('error','Error finding Users')
    }
}

const getSingleUser = async (req, res) => {
    const id = req.params.id;
    try {
        // const tour = await Tour.findById(id);
        const user = await Users.findById(id);
        if (user != null) {
            res.status(200).json({
                success: true,
                message: "Successful",
                data: user
            });
            usersLogger.log('info','Successfully got User information')
        }
        else {
            res.status(400).json({
                success: false,
                message: "No data with requested id"
            })
            usersLogger.log('error','Error in finding User')
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Data Not found"
        });
        usersLogger.log('error','Error finding Users')
    }
}
module.exports = { deleteUser, getAllUsers, getSingleUser, updateUser }