const mongoose = require('mongoose')
const Member = require('./Member')

const ServerSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  videoBonus: {
    type: Number,
    default: 1,
    required: true
  },
  streamingBonus: {
    type: Number,
    default: 1,
    required: true
  },
  crowdBonus: {
    value: {
      type: Number,
      default: 1,
      required: true
    },
    minMembersToCrowd: {
      type: Number,
      default: 10,
      required: true
    }
  },
  members: [Member]
})

module.exports = mongoose.model('Servers', ServerSchema)