// import express from 'express'
// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt'
// import validator from 'validator'
// import User from '../models/Users.js';
// import * as dotenv from 'dotenv';
const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')
const User = require('../models/Users')
const dotenv = require('dotenv')
dotenv.config()
// registration
const register = async (req, res) => {
  try {
    //hashing password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt)
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      phoneNumber: req.body.phoneNumber
    })
    //validate user input 
    if (!validator.isEmail(newUser.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email"
      })
    }
    if (validator.isEmpty(newUser.password) || !validator.isLength(newUser.password, { min: 6 })) {
      return res.status(400).json({
        success: false,
        message: "Password must at least 6 characters long"
      })
    }

    //check if user already exists

    const existingUser = await User.findOne({email:req.body.email});
     console.log("existingUser",existingUser)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with email already exists"
      })
    }

    //create new user
    await newUser.save()
    res.status(200).json({
      success: true,
      message: "Successfully registered new user"
    })
  }
  catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to register user . Try again"
    });
  }
}

//login
const login = async (req, res) => {
  const email = req.body.email
  try {
    const user = await User.findOne({ email })
    // console.log(user)
    // if user doesn't exists 
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
      //if user exists compare the password
      const checkPassword = await bcrypt.compare(req.body.password,user.password)
      if(!checkPassword){
        return res.status(404).json({
          success: false,
          message: "Incorrect email or password"
          })
      }
      const {password,role, ...rest} = user._doc
      //create jwt token 
      const token = jwt.sign(
        {
          id: user._id,
          //email:user.email
          role: user.role
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15d" }
      )

      res.cookie('accessToken',token,{
        httpOnly:true,
        expires:token.expiresIn
      }).status(200).json({
        success:true,
        message:"Successful",
        data:token
      })
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to Login"
    })
  }
}

module.exports = {register,login}