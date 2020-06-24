const mongoose = require('mongoose')

const WeeklyAlbumsSchema = new mongoose.Schema({
  week: {
    type: String,
    required: true
  },
  album1Artist: {
    type: String,
    required: true
  },
  album1: {
    type: String,
    required: true
  },
  album2Artist: {
    type: String,
    required: true
  },
  album2: {
    type: String,
    required: true
  },
  album3Artist: {
    type: String,
    required: true
  },
  album3: {
    type: String,
    required: true
  },
  active: {
    type: Boolean
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('WeeklyAlbums', WeeklyAlbumsSchema)
