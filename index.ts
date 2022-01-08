//npm run tsc - to auto compile to JS
//npm run dev - to rerun bot when saving ts file
//git add *, git commit -m "sampletext", git push
//botsync in cmd
import DiscordJS, { Channel, Guild, Intents } from 'discord.js'
import { MembershipStates } from 'discord.js/typings/enums'
import dotevn from 'dotenv'
dotevn.config()

const client = new DiscordJS.Client({
    intents: [
       Intents.FLAGS.GUILDS,
       Intents.FLAGS.GUILD_MESSAGES,
       Intents.FLAGS.GUILD_MEMBERS,
       Intents.FLAGS.GUILD_BANS
    ]
})

client.on('ready', () => {
    console.log('Chungus is ready my ass!')

    const guildId = '709463991759536139'
    const guild = client.guilds.cache.get(guildId)
    let commands

    if(guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'ядро',
        description: 'кидает в тебя ядро, берегись',
    })
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const {commandName, options} = interaction
    let nick = (await interaction.command?.guild?.members.fetch(interaction.user.id))?.nickname
    if(commandName === 'ядро') {
        let rTime = Math.floor((Math.random() * 15000) + 5000)
        interaction.reply({
            content: `Лови ядро!`,
            ephemeral: true, 
        })       
        setTimeout(() => {
            interaction.channel?.send(`༼つಠ益ಠ༽つ ─=≡🔴 ${nick}`)
        }, 1000);
        setTimeout(() => {
            interaction.channel?.send(`💥💥💥`)
        }, 3000);  
        setTimeout(() => {
            interaction.channel?.send(`${nick} оглушило на ${rTime/1000} секунд`)
            interaction.command?.guild?.members.fetch(interaction.user.id).then((member)=> {member.timeout(rTime, 'вас оглушило ядром')})
        }, 4000);
                     
    }
})

client.on('messageCreate', (message) => {
    if (message.content == 'ping') {
        message.reply({
            content: 'pong',
        })
    }
})

client.login(process.env.TOKEN)
