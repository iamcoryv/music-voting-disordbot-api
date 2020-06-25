// require necessary NPM packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// require route files
const weeklyAlbumRoutes = require('./app/routes/weekly_album_routes')
const userRoutes = require('./app/routes/user_routes')
const weeklyVotesRoutes = require('./app/routes/weekly_votes')

// require middleware
const errorHandler = require('./lib/error_handler')
const replaceToken = require('./lib/replace_token')
const requestLogger = require('./lib/request_logger')

// require database configuration logic
// `db` will be the actual Mongo URI as a string
const db = require('./config/db')

// require configured passport authentication middleware
const auth = require('./lib/auth')

// define server and client ports
// used for cors and local port declaration
const serverDevPort = 4741
const clientDevPort = 7165

// establish database connection
// use new version of URL parser
// use createIndex instead of deprecated ensureIndex
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true
})

// instantiate express application object
const app = express()

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}` }))

// define port for API to run on
const port = process.env.PORT || serverDevPort

// this middleware makes it so the client can use the Rails convention
// of `Authorization: Token token=<token>` OR the Express convention of
// `Authorization: Bearer <token>`
app.use(replaceToken)

// register passport authentication middleware
app.use(auth)

// add `express.json` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(express.json())
// this parses requests sent by `$.ajax`, which use a different content type
app.use(express.urlencoded({ extended: true }))

// log each request as it comes in for debugging
app.use(requestLogger)

// register route files
app.use(userRoutes)
app.use(weeklyAlbumRoutes)
app.use(weeklyVotesRoutes)
// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(errorHandler)

const Discord = require('discord.js')
require('dotenv').config()
const axios = require('axios')
const client = new Discord.Client()
const discordToken = process.env.DISCORD_TOKEN

client.on('ready', () => {
  console.log('Connected as ' + client.user.tag)
  client.user.setActivity('with my bot friends')
})

client.on('message', (receivedMessage) => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author === client.user) {
    return
  }
  receivedMessage.react('👍')
  if (receivedMessage.content.startsWith('$')) {
    processCommand(receivedMessage)
  }
})

const processCommand = (receivedMessage) => {
  let fullCommand = receivedMessage.content.substr(1) // Remove the $
  let lowerCaseCommand = fullCommand.toLowerCase() // Makes it all lower case
  let splitCommand = lowerCaseCommand.split('-') // Split the message up by sapces
  let primaryCommand = splitCommand[0] // First value is commmand
  let allArguments = splitCommand.slice(1) // All other words are arguments for the command

  console.log('Command received: ' + primaryCommand)
  console.log('Arguments: ' + allArguments)

  //   if (primaryCommand === 'albums') {
  //     const getAlbums = async () => {
  //       let response = await axios.get('https://afternoon-sea-43422.herokuapp.com/weeklyalbums/active')
  //       let albums = response.data
  //       receivedMessage.reply(`This weeks albums: \n Week ${albums.week} \n ${albums.album1} by ${albums.album1Artist}`)
  //       console.log(albums)
  //     }
  //     await getAlbums()
  //   } // else if (primaryCommand === 'multiply') {
  //   //   multiplyCommand(allArguments, receivedMessage)}
  //   else {
  //     receivedMessage.reply("I don't understand that command. Try something else")
  //   }
  // }

  if (primaryCommand === 'albums') {
    const getAlbums = () => {
      // get the active album
      axios.get('https://afternoon-sea-43422.herokuapp.com/weeklyalbums/active')
        .then(data => {
          // reply with details about the album
          receivedMessage.reply(
            `This weeks albums: \n Week ${data.data.weeklyAlbums.week}:
          ${data.data.weeklyAlbums.album1} by ${data.data.weeklyAlbums.album1Artist}
          ${data.data.weeklyAlbums.album2} by ${data.data.weeklyAlbums.album2Artist}
          ${data.data.weeklyAlbums.album3} by ${data.data.weeklyAlbums.album3Artist}`)
        })
        // .then(data => console.log(data))
        .catch(console.error)
    }
    getAlbums()
  } else if (primaryCommand === 'vote') {
    const postVote = () => {
      // get the active album
      axios.get('https://afternoon-sea-43422.herokuapp.com/weeklyalbums/active')
      // make a post request using the week key from above request
        .then(data => axios.post('https://afternoon-sea-43422.herokuapp.com/votes', {
          weeklyVotes: {
            // username can be found from the person who made the request
            username: receivedMessage.author.username,
            week: data.data.weeklyAlbums.week,
            // these votes come from the arguments
            album1Vote: parseInt(allArguments[0]),
            album2Vote: parseInt(allArguments[1]),
            album3Vote: parseInt(allArguments[2])
          }
        }))
        .then(data => {
          // reply to the user the votes were posted
          receivedMessage.reply(`Album 1:${allArguments[0]} Album 2:${allArguments[1]} Album 3:${allArguments[2]}  votes are made!`)
        })
        // .then(data => console.log(data))
        .catch(console.error)
    }
    postVote()
  } else if (primaryCommand === 'standings') {
    const getStandings = () => {
      // get the active album (this weeks album)
      axios.get('https://afternoon-sea-43422.herokuapp.com/weeklyalbums/active')
        .then(data => {
          // pass the album down and get this weeks botes
          axios.get('https://afternoon-sea-43422.herokuapp.com/votes')
            .then(data2 => {
              // declare an empty array to store this week's votes
              let currWeeksVotes = []
              // console.log(data)
              // variable to get this week from the first request above
              let currentWeek = data.data.weeklyAlbums.week
              // loop through all of the votes an push the votes that match the week
              for (let i = 0; i < data2.data.weeklyVotes.length; i++) {
                if (data2.data.weeklyVotes[i].week === parseInt(currentWeek)) {
                  currWeeksVotes.push(data2.data.weeklyVotes[i])
                // console.log()
                }
              }
              return currWeeksVotes
            })
            .then(currWeeksVotes => {
              // go through all of the votes in the filtered array and get the sum
              const album1VoteTotal = (currWeeksVotes.reduce((accumulator, current) => accumulator + current.album1Vote, 0))
              // then find the average (tried to do this together but i had to make a new variable for some reason)
              const album1Votes = (album1VoteTotal / currWeeksVotes.length).toFixed()
              const album2VoteTotal = (currWeeksVotes.reduce((accumulator, current) => accumulator + current.album2Vote, 0))
              const album2Votes = (album2VoteTotal / currWeeksVotes.length).toFixed()
              const album3VoteTotal = (currWeeksVotes.reduce((accumulator, current) => accumulator + current.album3Vote, 0))
              const album3Votes = (album3VoteTotal / currWeeksVotes.length).toFixed()
              // console.log(album1Votes, album2Votes, album3Votes)
              // made an array to be able to pass these variable on as a return
              const allVotes = [album1Votes, album2Votes, album3Votes]
              return allVotes
            })
            // .then(allVotes => console.log('second one ' + allVotes[0], allVotes[1], allVotes[2]))
            .then(allVotes => {
              // generate a reply with the information from the multiple requests showing the current averages
              receivedMessage.reply(
                `This weeks albums: \n Week ${data.data.weeklyAlbums.week}:
              ${data.data.weeklyAlbums.album1} by ${data.data.weeklyAlbums.album1Artist} is at ${allVotes[0]}%
              ${data.data.weeklyAlbums.album2} by ${data.data.weeklyAlbums.album2Artist} is at ${allVotes[1]}%
              ${data.data.weeklyAlbums.album3} by ${data.data.weeklyAlbums.album3Artist} is at ${allVotes[2]}%`)
            })
        })
        .catch(console.error)
    }
    getStandings()
  } else if (receivedMessage.channel.id === '725702108250112121' && primaryCommand === 'newweek') {
    const postNewAlbums = () => {
      axios.patch('https://afternoon-sea-43422.herokuapp.com/weeklyalbums/active')
        .then(function (album) { album.weeklyAlbums.active = false })
        .catch(console.error)
      axios.post('https://afternoon-sea-43422.herokuapp.com/weeklyalbums', {
        weeklyAlbums: {
          week: parseInt(allArguments[0]),
          album1Artist: allArguments[1],
          album1: allArguments[2],
          album2Artist: allArguments[3],
          album2: allArguments[4],
          album3Artist: allArguments[5],
          album3: allArguments[6],
          active: true
        }
      }).then(albums => {
        receivedMessage.reply(`New Albums ${allArguments} posted`)
      })
        .catch(console.error)
    }
    postNewAlbums()
  } else if (primaryCommand === 'clear') {
    if (!allArguments[1]) return receivedMessage.reply('Specify how much to clear.')
    receivedMessage.channel.bulkDelete(allArguments[1])
  } else if (primaryCommand === 'creator') {
    const embed = new Discord.RichEmbed()
      .setTitle('Cory Vertentes')
      // .setDescription('I hope you enjoyed.')
      .addField('Check out the code!', 'Link to my repository! [Click here](https://github.com/iamcoryv/music-voting-disordbot-api)')
      .setColor(0xadd8e6)
      .setThumbnail('https://avatars2.githubusercontent.com/u/50142917?s=460&u=0c0be45f6f5760471b0477d565cd1593509a73d5&v=4')
    receivedMessage.reply(embed)
  } else if (primaryCommand === 'help') {
    receivedMessage.reply(` All commands start with '$'
  Arguments are broken up by "-"
  Commands:
    $albums / lists the albums to vote on this week
    $vote / submits votes (votes separated by "-")
    $standings / shows the current album vote averages
    $creator / tells you who made the bot
    `)
  } else if (primaryCommand === 'ga') {
    receivedMessage.reply(`Thank you GA instructors for always making feel confident we can do anything. You always refered to us as developers even when we struggled with for loops. Im gonna miss all of the instructors and classmates. When things clear up lets celebrate over a drink. I wish the best of luck to you all!`)
  } else {
    receivedMessage.reply("I don't understand that command. Try something else, or type $help for commands.")
  }
}

client.login(discordToken)

// run API on designated port (4741 in this case)
app.listen(port, () => {
  console.log('listening on port ' + port)
})

// needed for testing
module.exports = app
