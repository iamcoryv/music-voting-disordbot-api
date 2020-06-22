'use strict'

// require dependencies
const express = require('express')
const passport = require('passport')
// create an express router object
const router = express.Router()
// require book model
const WeeklyAlbums = require('./../models/weeklyAlbums')
// require custom error handlers
const customErrors = require('../../lib/custom_errors')
// this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// this is middleware that will remove blank fields from `req.body`, e.g.
// { movie: { title: '', text: 'foo' } } -> { movie: { text: 'foo' } }
// const removeBlanks = require('../../lib/remove_blank_fields')
// must pass a token for route to work
const requireToken = passport.authenticate('bearer', { session: false })

router.get('/weeklyalbums', (req, res, next) => {
  // fetch all the events from mongodb
  WeeklyAlbums.find()
    .then(handle404)
    // use mongoose toObject on each event to include virtuals
    .then(weeklyAlbums => weeklyAlbums.map(event => event.toObject()))
    // send response 200 with albums to client
    .then(weeklyAlbums => res.json({ weeklyAlbums: weeklyAlbums }))
    // on error run next middleware
    .catch(next)
})

// Show: GET /events/100 return a event
router.get('/weeklyalbums/:id', (req, res, next) => {
  // get id of event from params
  const id = req.params.id
  // fetching event by its id
  WeeklyAlbums.findById(id)
    // handle 404 error if no event found
    .then(handle404)
    // respond with json of the event
    // use mongoose toObject on event to include virtuals
    .then(weeklyAlbums => res.json({ weeklyAlbums: weeklyAlbums.toObject() }))
    // on error continue to error handling middleware
    .catch(next)
})

// Create: POST /events save the event data
router.post('/weeklyalbums', requireToken, (req, res, next) => {
  // get event data from request
  const weeklyAlbums = req.body.weeklyAlbums
  // save event to mongodb
  WeeklyAlbums.create(weeklyAlbums)
    // if successful respond with 201 and event json
    .then(weeklyAlbums => res.status(201).json({ weeklyAlbums: weeklyAlbums.toObject() }))
    // on error respond with 500 and error message
    .catch(next)
})

// Update: PATCH /events/:id delete the event
router.patch('/weeklyalbums/:id', requireToken, (req, res, next) => {
  // get id of event from params
  const id = req.params.id
  // get event data from request
  const albumData = req.body.weeklyAlbums
  // fetching event by its id
  WeeklyAlbums.findById(id)
    // handle 404 error if no event found
    .then(handle404)
    // update event
    .then(weeklyAlbums => {
      // updating event object
      // with eventData
      Object.assign(weeklyAlbums, albumData)
      // save event to mongodb
      return weeklyAlbums.save()
    })
    // if successful return 204
    .then(() => res.sendStatus(204))
    // on error go to next middleware
    .catch(next)
})
// Destroy: DELETE /events/:id delete the event
router.delete('/weeklyalbums/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  WeeklyAlbums.findById(id)
    // handle 404 error if no event found
    .then(handle404)
    // delete event from mongodb
    .then(weeklyAlbums => weeklyAlbums.deleteOne())
    // send 204 if successful
    .then(() => res.sendStatus(204))
    // on error go to next middleware
    .catch(next)
})

module.exports = router
