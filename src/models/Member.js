const mongoose = require('mongoose')

const MemberSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  currentXp: {
    type: Number,
    default: 0,
    required: true
  },
  lastJoin: {
    type: Date,
    default: Date.now,
    required: true
  }
})

module.exports = MemberSchema