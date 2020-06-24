'use strict'

// require dependencies
const express = require('express')
// const passport = require('passport')
// create an express router object
const router = express.Router()
// require book model
const WeeklyVotes = require('./../models/weeklyVotes')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404

// Create: POST /events save the event data
router.post('/votes', (req, res, next) => {
  // get event data from request
  const weeklyVotes = req.body.weeklyVotes
  // save event to mongodb
  WeeklyVotes.create(weeklyVotes)
    // if successful respond with 201 and event json
    .then(weeklyVotes => res.status(201).json({ weeklyVotes: weeklyVotes.toObject() }))
    // on error respond with 500 and error message
    .catch(next)
})

router.get('/votes', (req, res, next) => {
  // fetch all the events from mongodb
  WeeklyVotes.find()
    .then(handle404)
    // use mongoose toObject on each event to include virtuals
    .then(weeklyVotes => weeklyVotes.map(weeklyVote => weeklyVote.toObject()))
    // send response 200 with weeklyVotes to client
    .then(weeklyVotes => res.json({ weeklyVotes: weeklyVotes }))
    // on error run next middleware
    .catch(next)
})

// Destroy: DELETE /events/:id delete the event
router.delete('/votes/:id', (req, res, next) => {
  const id = req.params.id
  WeeklyVotes.findById(id)
    // handle 404 error if no event found
    .then(handle404)
    // delete event from mongodb
    .then(weeklyVotes => weeklyVotes.deleteOne())
    // send 204 if successful
    .then(() => res.sendStatus(204))
    // on error go to next middleware
    .catch(next)
})

module.exports = router
