const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      required: [true, "Email required"]
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    createdDate: {
      type: Date,
      default: Date.now
    },
    updatedDate: {
      type: Date,
      required: false
  },
    phoneNumber: {
    type: String,
    max : 9999999999,
    min: 8000000000,
    required: [true, 'User phone number required']
  }
  },
);

module.exports =  mongoose.model("User", userSchema);