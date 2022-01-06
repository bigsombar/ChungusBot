//npm run tsc - to auto compile to JS

import DiscordJS, { Intents } from 'discord.js'
import dotevn from 'dotenv'
dotevn.config()

const client = new DiscordJS.Client({
    intents: [
       Intents.FLAGS.GUILDS,
       Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log('Chungus is ready my ass!')
})

client.on('messageCreate', (message) => {
    if (message.content === 'ping') {
        message.reply({
            content: 'pong!!',
        })
    }
})

client.login(process.env.TOKEN)
