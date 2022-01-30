//npm run tsc - to auto compile to JS
//npm run dev - to rerun bot when saving ts file
//ts-node index.ts - for manual start
//git add *, git commit -m "sampletext", git push
//botsync in cmd
//добавляй await к запросам требующим время идиот
import DiscordJS, { Intents } from 'discord.js'
import dotevn from 'dotenv'
import { Pool } from 'pg'
dotevn.config()
const client = new DiscordJS.Client({
    intents: [
       Intents.FLAGS.GUILDS,
       Intents.FLAGS.GUILD_MESSAGES,
       Intents.FLAGS.GUILD_MEMBERS,
       Intents.FLAGS.GUILD_BANS,
       Intents.FLAGS.GUILD_VOICE_STATES
    ]
})

// VARIABLES
let jstsPostfix: string
let pool = new Pool()

client.on('ready', () => {
    console.log('Chungus is ready my ass!')
    if(process.platform == 'win32') {   // Определяет систему 
        pool = new Pool({         
            user: 'bigsombar',
            host: '192.168.0.180',
            database: 'bigsombar',
            password: '7015',
            port: 5432,
        })
        client.user?.setActivity("за разработкой📝", {
            type: "WATCHING"
        })
        jstsPostfix = 'ts'
    } else {
        pool = new Pool({          
            user: 'bigsombar',
            host: '127.0.0.1',
            database: 'bigsombar',
            password: '7015',
            port: 5432,
        }) 
        client.user?.setActivity("за ядрами", {
            type: "WATCHING"
        })
        jstsPostfix = 'js'
    }
    const guildId = '709463991759536139'
    const guild = client.guilds.cache.get(guildId)
    let commands
    if(guild) { commands = guild.commands } else { commands = client.application?.commands }
    // FUNCTIONS
    function sendToChat(channelName: string, importantlText: string) {
        let channel = guild?.channels.cache.find(c => c.name === channelName)
        if (channel?.isText()) {
            channel.send(importantlText)
        }
    }
    async function BDSync() {
        let dUsers = [
            {
                id: "id",
                username: "username",
                nickname: "nickname",
                avatar_url: "url"
            }
        ];
        await guild?.members
        .fetch()
        .then((members) =>
            members.forEach(member => {
                let memberNick = member.nickname
                if(memberNick == null){memberNick = "отсутствует"}
                dUsers.push({
                    id: member.id,
                    username: member.user.username,
                    nickname: memberNick,
                    avatar_url: member.user.avatarURL()!
                })
            }),
        );
        dUsers.shift()
        ;(async () => {
            const client = await pool.connect()
            try {
                dUsers.forEach(async d => {
                    const res = await client.query(`
                    INSERT INTO users (user_id, user_name, user_nickname, user_avatarurl) 
                    VALUES (${d.id}, '${d.username}', '${d.nickname}', '${d.avatar_url}')  
                    ON CONFLICT (user_id) DO UPDATE SET (user_name, user_nickname, user_avatarurl) = (EXCLUDED.user_name, EXCLUDED.user_nickname, EXCLUDED.user_avatarurl)`
                    )
                })
            } finally {
                client.release()
            }
          })().catch(err => console.log(err.stack))  
    }
    function exitSignalHandler() {
        var Da = new Date();
        var datetime = `${Da.getHours()}:${Da.getMinutes()}  ${Da.getDate()}-${Da.getMonth()+1}-${Da.getFullYear()}`
        sendToChat('bot-logs',`About to exit in ${datetime}`)
        console.log(`About to exit in ${datetime}`)
        clearInterval(TestPostInterval)      
        pool.end()
        setTimeout(() => {
            process.exit()
        }, 1000) 
    }
    // COMMANDS DECLARATION
    commands?.create({name: 'ядро',
        description: 'кидает в тебя ядро, берегись',
    })
    commands?.create({name: 'кинуть_ядро_в',
        description: 'попросить кинуть ядро в невинного юзера',
        options: [
            {
                name: 'юзер',
                description: 'укажите юзера',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
            }
        ]
    })
    commands?.create({name: 'юзеры',
    description: 'выводит список пользователей сервера',
    })
    commands?.create({name: 'юзер',
    description: 'выводит информацию о себе или о другом юзере',
    options: [
        {
            name: 'юзер',
            description: 'укажите юзера',
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
        }
    ]
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
    commands?.create({name: 'голосование',
    description: 'проводит голосование',
    options: [
        {
            name: 'название',
            description: 'за что голосуем?',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'варианты',
            description: 'введите варианты через запятую',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'время',
            description: 'сколько секунд на голосование',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ]
    })
    commands?.create({name: 'удалить_команду',
    description: 'удаляет указанную слэш команду с сервера',
    options: [
        {
            name: 'команда',
            description: 'введите название команды без /',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING 
        }
    ]
    }) 
    //  REPETAT VARIABLES CLEAN THEM IN !!!exitSignalHandler!!!
    var TestPostInterval = setInterval(BDSync, (60000*60))//every hour
    // EXIT HANDLER
    process.on('SIGINT', exitSignalHandler)
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {return}
    const {commandName, options} = interaction 

    if(commandName === 'ядро') {
        let command = require(`./commands/yadro.${jstsPostfix}`)
        command.execute(interaction,pool)                                                   
    }
    if(commandName === 'кинуть_ядро_в') {
        let command = require(`./commands/throw_yadro.${jstsPostfix}`)
        command.execute(interaction,pool,options)    
    }
    if(commandName === 'юзеры') {
        let command = require(`./commands/users.${jstsPostfix}`)
        command.execute(interaction)
    }
    if(commandName === 'юзер') {
        let command = require(`./commands/user.${jstsPostfix}`)
        command.execute(interaction,pool,options)     
    }
    if(commandName === 'кто_я') {
        let command = require(`./commands/who.${jstsPostfix}`)
        command.execute(interaction,options)   
    }
    if(commandName === 'голосование') {
        let command = require(`./commands/vote.${jstsPostfix}`)
        command.execute(interaction,options)
    }
    if(commandName === 'удалить_команду') {
        let command = require(`./commands/delete_command.${jstsPostfix}`)
        command.execute(interaction,options)
    }

})



client.login(process.env.TOKEN)
