// import express from 'express'
const  { deleteUser, getAllUsers, getSingleUser, updateUser } = require('../controllers/Users.js')
const { validateToken, verifyAdmin, verifyUser } = require('../utils/verifyToken.js')
const express = require('express')
const router = express.Router()
//get all Users
router.get('/',validateToken,(req, res, next) => {
  if(req.user.role==="admin"){
  next();
  }
  else{
    return res.status(400).json({
        success:false,
        message:"You are not authorized"
    })
  }
},getAllUsers);

//update User
router.put('/:id',validateToken,verifyUser,updateUser);

//delete User
router.delete('/:id',validateToken,verifyUser, deleteUser)

// get single user 
router.get('/:id',validateToken,verifyUser,getSingleUser)

module.exports = router;
