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
        let adminStatus = (await interaction.command?.guild?.members.fetch(interaction.user.id))?.permissions.has("ADMINISTRATOR")
        let nick = (await interaction.command?.guild?.members.fetch(interaction.user.id))?.nickname
        let firstName = options.getString('имя')!.toLowerCase()
        let dayOfBirth = options.getNumber('день')!
        let yourName: string
        let firstNames = new Map()
        let daysOfBirth = new Map()

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

        firstNames.set("а", "Сокрушитель"); daysOfBirth.set(1, "школьников")
        firstNames.set("б", "Любитель");    daysOfBirth.set(2, "арбузов")
        firstNames.set("в", "Ценитель");    daysOfBirth.set(3, "говнарей")
        firstNames.set("г", "Метатель");    daysOfBirth.set(4, "олдфагов")
        firstNames.set("д", "Гроза");       daysOfBirth.set(5, "вагин")
        firstNames.set("е", "Повелитель");  daysOfBirth.set(6, "демонов")
        firstNames.set("ж", "Пожинатель");  daysOfBirth.set(7, "депутатов")
        firstNames.set("з", "Победитель");  daysOfBirth.set(8, "котят")
        firstNames.set("и", "Опустошитель");daysOfBirth.set(9, "жнецов")
        firstNames.set("к", "Хейтер");      daysOfBirth.set(10, "жиров")
        firstNames.set("л", "Убийца");      daysOfBirth.set(11, "самок")
        firstNames.set("м", "Растворитель");daysOfBirth.set(12, "мужиков")
        firstNames.set("н", "Дрочитель");   daysOfBirth.set(13, "пухляшей")
        firstNames.set("о", "Предводитель");daysOfBirth.set(14, "трапов")
        firstNames.set("п", "Воин");        daysOfBirth.set(15, "говна")
        firstNames.set("р", "Адепт");       daysOfBirth.set(16, "света")
        firstNames.set("с", "Уборщик");     daysOfBirth.set(17, "троллей")
        firstNames.set("т", "Почитатель");  daysOfBirth.set(18, "орков")
        firstNames.set("у", "Создатель");   daysOfBirth.set(19, "наномашин")
        firstNames.set("ф", "Фанатик");     daysOfBirth.set(20, "дрыщей")
        firstNames.set("х", "Вождь");       daysOfBirth.set(21, "веганов")
        firstNames.set("ц", "Жрец");        daysOfBirth.set(22, "моралфагов")
        firstNames.set("ч", "Преслужник");  daysOfBirth.set(23, "душ")
        firstNames.set("ш", "Экзорцист");   daysOfBirth.set(24, "фемок")
        firstNames.set("э", "Владыка");     daysOfBirth.set(25, "торчков")
        firstNames.set("ю", "Священник");   daysOfBirth.set(26, "паладинов")
        firstNames.set("я", "Призыватель"); daysOfBirth.set(27, "сосисок")
                                            daysOfBirth.set(28, "качков")
                                            daysOfBirth.set(29, "админов")
                                            daysOfBirth.set(30, "ботов")
                                            daysOfBirth.set(31, "аниме")

        yourName = `${firstNames.get(firstName)} ${daysOfBirth.get(dayOfBirth)}`

        interaction.reply({
            content: `Ты ${yourName}`,
            ephemeral: true, 
        })
        
        setTimeout(() => {
            interaction.channel?.send(`${nick} заявляет, что он теперь ${yourName}`)
        }, 3000);

        if(!adminStatus) {
            interaction.command?.guild?.members.fetch(interaction.user.id).then((member)=> {member.setNickname(yourName)})
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
