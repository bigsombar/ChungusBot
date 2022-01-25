//npm run tsc - to auto compile to JS
//npm run dev - to rerun bot when saving ts file
//ts-node index.ts - for manual start
//git add *, git commit -m "sampletext", git push
//botsync in cmd
//добавляй await к запросам требующим время идиот
import { Utils } from 'discord-api-types'
import DiscordJS, { Channel, Guild, Intents, Message, MessageEmbed } from 'discord.js'
import { MembershipStates } from 'discord.js/typings/enums'
import dotevn from 'dotenv'
import { Pool, Client } from 'pg'

dotevn.config()

let pool = new Pool()
if(process.platform == 'win32') {
    pool = new Pool({         
        user: 'bigsombar',
        host: '192.168.0.180',
        database: 'bigsombar',
        password: '7015',
        port: 5432,
    })
} else {
    pool = new Pool({          
        user: 'bigsombar',
        host: '127.0.0.1',
        database: 'bigsombar',
        password: '7015',
        port: 5432,
    }) 
}

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
        description: 'кидает ядро в невинного юзера',
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
    // REPEAT VARIABLES CLEAN THEM IN !!!exitSignalHandler!!!
    var TestPostInterval = setInterval(BDSync, (60000*60)) //выполняется каждый час
    // EXIT HANDLER
    process.on('SIGINT', exitSignalHandler)
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
        var randomResult = Math.random() // from 0 to 1
        function stunned() {
            const embedStuned = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`${nick}`)
            .setDescription(`оглушило на ${rTime/1000} секунд`)
            .setImage('https://c.tenor.com/m3dTQ35dchIAAAAC/teletubbies-tired.gif')
            interaction.channel?.send({ embeds: [embedStuned] })
            .then(msg => {
                setTimeout(() => msg.delete(), rTime)
            })
            interaction.guild?.members.fetch(interaction.user.id).then((member)=> {member.timeout(rTime, 'вас оглушило ядром')})
        }
        function catched() {
            const embedCatch = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`${nick}`)
            .setDescription(`поймал ядро 🎉`)
            .setImage('https://c.tenor.com/s7hF0AVkmAoAAAAd/%D0%BC%D1%8E%D0%BD%D1%85%D0%B0%D1%83%D0%B7%D0%B5%D0%BD-%D0%BC%D1%8E%D0%BD%D0%B3%D1%85%D0%B0%D1%83%D0%B7%D0%B5%D0%BD.gif')
            interaction.channel?.send({ embeds: [embedCatch] })
            .then(msg => {
                setTimeout(() => msg.delete(), 10000)
            })
            ;(async () => {
                const client = await pool.connect()
                try {
                    const res = await client.query(`
                    update users
                    set user_money = user_money + 1
                    where user_id = '${interaction.user.id}';
                    `)
                } finally {
                    client.release()
                }
              })().catch(err => console.log(err.stack))
        }
        interaction.reply({
            content: `Лови ядро!`,
            ephemeral: false, 
        })   
        setTimeout(() => {
            interaction.deleteReply()
        }, 5000); 
        setTimeout(() => {
            if(!adminStatus) {
                if (randomResult < 0.7) {
                    // 70% chance of being stunned
                    stunned();
                }  else {
                    // 30% chance of catch cannon ball
                    catched(); 
                }
            } else {
                catched(); //admin always catches
            }
        }, 2000);                                    
    }
    if(commandName === 'юзеры') {
        let list: string[] = []
        await interaction.guild?.members
        .fetch()
        .then((members) =>
            members.forEach((member) => {
                list.push(`${member.user.username} | ${member.nickname}`)
            }),
        );
        interaction.reply({
            content: ` зачем тебе эта информация? (¬､¬) \nя удалю это через 15 секунд, записывай быстрее`,
            ephemeral: false,
        })
        setTimeout(() => {
            interaction.deleteReply()
        }, 7000);  
        const embedUserList = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('Список пользователей:')
        .setDescription(list.join("\n"))
        .setImage('https://c.tenor.com/UZmwl8vaGC0AAAAi/peepo-g.gif')
        interaction.channel?.send({ embeds: [embedUserList] })
        .then(msg => {
            setTimeout(() => msg.delete(), 15000)
        })
    }
    if(commandName === 'юзер') {
        let user = interaction.user
        if(options.getUser('юзер')?.username !== undefined) {
            user = options.getUser('юзер')!
        }
        let m = await interaction.guild?.members.fetch()
        let user_id = m?.find(m => m.user.id === user?.id)?.id
        let user_nick: string
        let user_name: string
        let user_avatar: string
        let user_money: string
        let roles: string[] = []
        await interaction.guild?.members.fetch(user_id!)?.then((member)=> {
            user_name = member.user.username
            user_nick = member.nickname!
            user_avatar = member.user.avatarURL()!
            member.roles.cache.each(role => {
                roles.push(`<@&${role.id}>`)
            })
        })

        ;(async () => {
            const client = await pool.connect()
            try {
                const res = await client.query(`
                select user_money from users
                where user_id = '${user_id}';
                `)
                user_money = res.rows[0].user_money
            } finally {
                client.release()
            }
        })().catch(err => console.log(err.stack))
        
        setTimeout(() => {
            interaction.reply({
                content: `Хотел подробностей, да?\nно я не могу долго такое показывать`,
                ephemeral: false,
            })
            const embedUserInfo = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`${user_name}`)
            .setDescription(`${user_nick}`)
            .setImage(`${user_avatar}`)
            .addField('Роли:', roles.join('\n'), true) 
            .addField('Ядра:', `${user_money}`, true)      
            interaction.channel?.send({ embeds: [embedUserInfo] })
            .then(msg => {
                setTimeout(() => msg.delete(), 15000)
            })
        }, 1000);
        setTimeout(() => {
            interaction.deleteReply()
        }, 7000);
        

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
    if(commandName === 'удалить_команду') {
        let cmdName = options.getString('команда')!
        let adminStatus = (await interaction.command?.guild?.members.fetch(interaction.user.id))?.permissions.has("ADMINISTRATOR")
        if(adminStatus){
            let c = await interaction.guild?.commands.fetch()
            let foundCmdId = c?.find(c => c.name === cmdName)?.id
            if (foundCmdId !== undefined) {
                interaction.guild?.commands.fetch(foundCmdId).then((com)=> {com.delete()})
                interaction.reply({
                    content: `команда ${cmdName} удалена`,
                    ephemeral: true,     
                }) 
            } else {
                interaction.reply({
                    content: `команда ${cmdName} не найдена`,
                    ephemeral: true,     
                })
            }                  
        } else {
            interaction.reply({
                content: `у вас недостаточно прав`,
                ephemeral: true, 
            })
        }
    }
    
})




client.login(process.env.TOKEN)
