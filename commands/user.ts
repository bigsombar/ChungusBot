import DiscordJS, { MessageEmbed } from 'discord.js'
import { Pool } from 'pg'

module.exports = {
    execute: async function (interaction: DiscordJS.CommandInteraction<DiscordJS.CacheType>, pool: Pool, options: Omit<DiscordJS.CommandInteractionOptionResolver<DiscordJS.CacheType>, "getMessage" | "getFocused">) {
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
                setTimeout(() => msg.delete(), 12000)
            })
        }, 1000);
        setTimeout(() => {
            interaction.deleteReply()
        }, 7000);
    }
}