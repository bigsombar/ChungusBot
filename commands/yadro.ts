import DiscordJS, { MessageEmbed } from 'discord.js'
import { Pool } from 'pg'

module.exports = {
    execute: async function(interaction: DiscordJS.CommandInteraction<DiscordJS.CacheType>, pool: Pool) {

        let adminStatus = (await interaction.guild?.members.fetch(interaction.user.id))?.permissions.has("ADMINISTRATOR")
        let nick = (await interaction.guild?.members.fetch(interaction.user.id))?.nickname
        let rTime = Math.floor((Math.random() * 15000) + 5000)
        var catchChance = Math.random() // from 0 to 1
        function stunned() {
            const embedStuned = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`${nick}`)
            .setDescription(`оглушило на ${Math.round(rTime/1000)} секунд`)
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
                setTimeout(() => msg.delete(), 7000)
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
                if (catchChance < 0.7) {
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
}