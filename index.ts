//npm run tsc - to auto compile to JS
//npm run dev - to rerun bot when saving ts file
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
    //REPEAT FUNCTIONS
    function TestPost() {
        let channel = guild?.channels.cache.find(c => c.name === 'bot-test')
        if (channel?.isText()) {
            channel.send('POG')
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
    // COMMANDS DECLARATION
    commands?.create({name: 'ядро',
        description: 'кидает в тебя ядро, берегись',
    })
    commands?.create({name: 'юзеры',
    description: 'выводит список пользователей сервера',
    })
    commands?.create({name: 'юзер',
    description: 'выводит информацию о пользователе',
    options: [
        {
            name: 'имя',
            description: 'имя пользователя до #',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
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
    //var TestPostInterval = setInterval(BDSync, (20000))
    var TestPostInterval = setInterval(BDSync, (60000*60)) //выполняется каждый час
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
        let userName = options.getString('имя')!
        let m = await interaction.guild?.members.fetch()
        let user_id = m?.find(m => m.user.username === userName)?.id
        let user_nick
        let user_avatar
        let roles: string[] = []
        await interaction.guild?.members.fetch(user_id!)?.then((member)=> {
            user_nick = member.nickname
            user_avatar = member.user.avatarURL()
            member.roles.cache.each(role => {
                roles.push(`<@&${role.id}>`)
            })
        })
        interaction.reply({
            content: `Хотел подробностей, да?\nно я не могу долго такое показывать`,
            ephemeral: false,
        })
        setTimeout(() => {
            interaction.deleteReply()
        }, 7000); 
        const embedUserInfo = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(userName)
        .setDescription(`${user_nick}`)
        .setImage(`${user_avatar}`)
        .addField('Роли:', roles.join('\n'), true)       
        interaction.channel?.send({ embeds: [embedUserInfo] })
        .then(msg => {
            setTimeout(() => msg.delete(), 20000)
        })

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
