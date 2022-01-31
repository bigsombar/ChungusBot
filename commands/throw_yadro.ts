import DiscordJS, { MessageEmbed } from 'discord.js'
import { Pool } from 'pg'

module.exports = {
    execute: async function(interaction: DiscordJS.CommandInteraction<DiscordJS.CacheType>, pool: Pool, options: Omit<DiscordJS.CommandInteractionOptionResolver<DiscordJS.CacheType>, "getMessage" | "getFocused">) {
        let currentMember = (await interaction.guild?.members.fetch(interaction.user.id))!
        let enemyMember = (await interaction.guild?.members.fetch(options.getUser('юзер')!.id))!
        let adminStatus = enemyMember.permissions.has("ADMINISTRATOR")
        let stunTime = Math.floor((Math.random() * 15000) + 5000)
        var hitChance = Math.random()
        var catchChance = Math.random()
        var currentMemberMoney = 0

        const client = await pool.connect()
        try {
            const res = await client.query(`
            select user_money from users
            where user_id = '${currentMember.id}';
            `)
            currentMemberMoney = res.rows[0].user_money
        } finally {
            client.release()
        }

        if(currentMemberMoney <= 0) { //Checking money is available
            interaction.reply({
                content: `${currentMember?.nickname} у вас недостаточно ядер`,
                ephemeral: true, 
            })
            return
        } else {
            interaction.reply({
                content: `${currentMember?.nickname} Кидает ядро в ${enemyMember?.nickname}!`,
                ephemeral: false, 
            })
            setTimeout(() => {
                interaction.deleteReply()
            }, 5000);
        }
        function stunned() {
            const embedStuned = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${enemyMember.nickname}`)
            .setDescription(`оглушило на ${Math.round(stunTime/1000)} секунд`)
            .setImage('https://c.tenor.com/m3dTQ35dchIAAAAC/teletubbies-tired.gif')
            interaction.channel?.send({ embeds: [embedStuned] })
            .then(msg => {
                setTimeout(() => msg.delete(), stunTime)
            })
            enemyMember.timeout(stunTime, 'вас оглушило ядром')
        }
        function catched() {
            const embedCatch = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`${enemyMember.nickname}`)
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
                    where user_id = '${enemyMember.user.id}';
                    `)
                } finally {
                    client.release()
                }
            })().catch(err => console.log(err.stack))
        }
        function missed() {
            const embedMiss = new MessageEmbed()
            .setColor('DARK_BLUE')
            .setTitle(`${currentMember.nickname}`)
            .setDescription(`не попал в цель, в другой раз повезет`)
            .setImage('https://c.tenor.com/ArzW85faMkgAAAAd/fail-basketball.gif')
            interaction.channel?.send({ embeds: [embedMiss] })
            .then(msg => {
                setTimeout(() => msg.delete(), 7000)
            })
        }
        setTimeout(() => { //уменьшает ядра на 1
            ;(async () => {
                const client = await pool.connect()
                try {
                    const res = await client.query(`
                    update users
                    set user_money = user_money - 1
                    where user_id = '${currentMember.user.id}';
                    `)
                } finally {
                    client.release()
                }
            })().catch(err => console.log(err.stack))
        }, 1000);
        setTimeout(() => { //Casino roll
            if (hitChance < 0.8) {
                // 80% chance of being hit
                if(!adminStatus) {
                    if (catchChance < 0.7) {
                        // 56% chance of being stunned
                        stunned()
                    } else {
                        // 24% chance of catch cannon ball
                        catched() 
                    }
                } else {
                    catched() //admin always catches
                }
            } else {
                // 20% chance of miss
                missed()
            }
        }, 2000);
    }
}