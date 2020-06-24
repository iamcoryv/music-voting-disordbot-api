const mongoose = require('mongoose')

const WeeklyVotesSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  week: {
    type: Number
  },
  album1Vote: {
    type: Number
  },
  album2Vote: {
    type: Number
  },
  album3Vote: {
    type: Number
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('WeeklyVotes', WeeklyVotesSchema)
