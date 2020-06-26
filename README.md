### Music Voting Back-End API && Discord Bot

This api stores weekly album choices set by an admin and votes made by users. Along with the API there is a bot that can make requests via commands to the api. The bot is used for setting weekly ablums and accepting votes from users to be stored and a winner is found at the end of the week.

## Repositories
Client: [Client](https://github.com/iamcoryv/music-voting-admin-client)
API: [API](https://github.com/iamcoryv/music-voting-disordbot-api)


## Deployed Sites
Client: [Client](https://iamcoryv.github.io/music-voting-admin-client/)
API: [API](https://afternoon-sea-43422.herokuapp.com/)


## List of technologies used
HTML, CSS, MongoDB, Mongoose, Express, React, Node, Axios, Bootstrap, discord.js, discord


## List unsolved problems which would be fixed in future iterations.

#### Bot reply styling
I want to play around with discord embeds to make the styling of but replies a bit cleaner and more visually appealing.
#### Bot Commands
I want to add additional commands and a patch route for editing votes if someone changes their mind.

## Document your planning, process and problem-solving strategy
I was talking to a friend about how I was building an API and client for a final project and after I
explained how it worked he mentioned how that would useful for the discord music channel we are a part of. I layed out the models and what routes would be needed and went from there. It was a learning process as the project went on, I took what I knew about making server requests and my knowledge of JavaScript and applied it to what I learned from the Discord Docs.

## API Routes

### User

| Method      | Path | Function |
| ----------- | ----------- | ----------- |
| Post      | /sign-up      | Sign up a new user |
| Post   | /sign-in     | Sign in an existing user |
| Patch   |  /change-password | Change password of existing user |
| Delete   |  /sign-out | Sign out existing user |

### Weekly Albums
| Method      | Path | Function |
| ----------- | ----------- | ----------- |
| Get      | /weeklyalbums      | Get all albums that were made by users |
| Get      | /weeklyalbums/active      | Get the active album for the week |
| Post   |  /weeklyalbums | post a new week of albums for voting |
| Patch   | /weeklyalbums/:id  |   update the active weekly album |
| Delete   | /weeklyAlbums/:id  | delete the current weeks albums  |

### Weekly Albums
| Method      | Path | Function |
| ----------- | ----------- | ----------- |
| Get      | /votes      | Get all the votes made by users |
| Post      | /votes      | Post a new vote on current albums |
| Delete   |  /votes/:id  |  Delte a vote |
