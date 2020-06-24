
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
  let splitCommand = lowerCaseCommand.split(' ') // Split the message up by sapces
  let primaryCommand = splitCommand[0] // First value is commmand
  let allArguments = splitCommand.slice(1) // All other words are arguments for the command

  console.log('Command received: ' + primaryCommand)
  console.log('Arguments: ' + allArguments)

  //   if (primaryCommand === 'albums') {
  //     const getAlbums = async () => {
  //       let response = await axios.get('http://localhost:4741/weeklyalbums/active')
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
      axios.get('http://localhost:4741/weeklyalbums/active')
        .then(data => {
          receivedMessage.reply(
            `This weeks albums: \n Week ${data.data.weeklyAlbums.week}:
          ${data.data.weeklyAlbums.album1} by ${data.data.weeklyAlbums.album1Artist}
          ${data.data.weeklyAlbums.album2} by ${data.data.weeklyAlbums.album2Artist}
          ${data.data.weeklyAlbums.album3} by ${data.data.weeklyAlbums.album3Artist}`)
        })
        .then(data => console.log(data))
        .catch(console.error)
    }
    getAlbums()
  } else if (primaryCommand === 'vote') {
    const postVote = () => {
      axios.get('http://localhost:4741/weeklyalbums/active')
        .then(data => axios.post('http://localhost:4741/votes', {
          weeklyVotes: {
            username: receivedMessage.author.username,
            week: data.data.weeklyAlbums.week,
            album1Vote: parseInt(allArguments[0]),
            album2Vote: parseInt(allArguments[1]),
            album3Vote: parseInt(allArguments[2])
          }
        }))
        .then(data => {
          receivedMessage.reply(`${allArguments} posted`)
        })
        .then(data => console.log(data))
        .catch(console.error)
    }
    postVote()
  } else if (primaryCommand === 'standings') {
    const getStandings = () => {
      axios.get('http://localhost:4741/weeklyalbums/active')
        .then(data => {
          receivedMessage.reply(
            `This weeks albums: \n Week ${data.data.weeklyAlbums.week}:
          ${data.data.weeklyAlbums.album1} by ${data.data.weeklyAlbums.album1Artist}
          ${data.data.weeklyAlbums.album2} by ${data.data.weeklyAlbums.album2Artist}
          ${data.data.weeklyAlbums.album3} by ${data.data.weeklyAlbums.album3Artist}`)
        })
        .then(data => console.log(data))
        .catch(console.error)
    }
    getStandings()
  } else {
    receivedMessage.reply("I don't understand that command. Try something else")
  }
}

client.login(discordToken)
