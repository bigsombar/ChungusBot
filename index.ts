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

    commands?.create({name: 'ядро',
        description: 'кидает в тебя ядро, берегись',
    })

    commands?.create({name: 'кто_я',
        description: 'кто ты по жизни?',
        options: [
            {
                name: 'имя',
                description: 'первая буква имени на русском',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'день',
                description: 'число дня рождения',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            }
        ]
    })


})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const {commandName, options} = interaction 

    if(commandName === 'ядро') {
        let adminStatus = (await interaction.command?.guild?.members.fetch(interaction.user.id))?.permissions.has("ADMINISTRATOR")
        let nick = (await interaction.command?.guild?.members.fetch(interaction.user.id))?.nickname
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
        if(!adminStatus) {
            setTimeout(() => {
                interaction.channel?.send(`${nick} оглушило на ${rTime/1000} секунд`)
                interaction.command?.guild?.members.fetch(interaction.user.id).then((member)=> {member.timeout(rTime, 'вас оглушило ядром')})
            }, 4000);
        } else {
            setTimeout(() => {
                interaction.channel?.send(`${nick} блокирует весь урон`)
            }, 4000);
        }                                
    }

    if(commandName === 'кто_я') {
        let commandFunctions = require('./InternalFunctions.js');
        let adminStatus = (await interaction.command?.guild?.members.fetch(interaction.user.id))?.permissions.has("ADMINISTRATOR")
        let nick = (await interaction.command?.guild?.members.fetch(interaction.user.id))?.nickname
        let firstName = options.getString('имя')!.toLowerCase()
        let dayOfBirth = options.getNumber('день')!
        let you: string = commandFunctions.names(firstName, dayOfBirth)
        if (!(/^[а-я]+$/i.test(firstName))) {
            interaction.reply({
                content: `Неправильная буква имени, подходит от а до я`,
                ephemeral: true, 
            })
            return
        }
        if (!(dayOfBirth >= 1 && dayOfBirth <= 31)) {
            interaction.reply({
                content: `Неправильно выбран день, нужно от 1 до 31`,
                ephemeral: true, 
            })
            return
        }
        interaction.reply({
            content: `Ты ${you}`,
            ephemeral: true, 
        })
        setTimeout(() => {
            interaction.channel?.send(`${nick} заявляет, что он теперь ${you}`)
        }, 3000);
        if(!adminStatus) {
            interaction.command?.guild?.members.fetch(interaction.user.id).then((member)=> {member.setNickname(you)})
        }
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
