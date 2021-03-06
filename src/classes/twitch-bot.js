const { Client } = require('tmi.js')
const { commands } = require('../commands/elijah')

class TwitchBot {
  constructor({ debug, oauth, channels, noticeChannel, server }) {
    this.server = server
    this.client = new Client({
      options: { debug },
      connection: {
        reconnect: true,
      },
      identity: {
        username: 'dankbot',
        password: oauth,
      },
      channels,
    })
    this.noticeChannel = noticeChannel

    this.client.connect()
    console.log('Twitch bot be twitchin')

    this.client.on('message', (channel, tags, message, self) => {
      const keyword = message.split(' ')[0]

      const username = tags['username']
      const userId = tags['user-id']
      const isSubscriber = tags.badges.subscriber

      // match keyword against commands
      console.log(channel, keyword)

      const command = commands[keyword]

      if (!command) return

      if (command.action) {
        const response = this.server.execChatCommand(command.action, keyword)
        // send response
        return
      }

      console.log(command)
      this.client.say(channel, command.reply)
    })
  }

  msg(body) {
    this.client.say(this.noticeChannel, body)
    // send message
  }
}

module.exports = { TwitchBot }
