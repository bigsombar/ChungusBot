import DiscordJS, { MessageEmbed } from 'discord.js'

module.exports = {
    execute: async function(interaction: DiscordJS.CommandInteraction<DiscordJS.CacheType>) {
        let list: string[] = []
        let members = await interaction.guild?.members.fetch()
        members?.forEach(member => {
            list.push(`${member.user.username} | ${member.nickname}`)
        })
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
}