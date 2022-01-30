import DiscordJS, { MessageActionRow, MessageButton, MessageEmbed, VoiceChannel } from 'discord.js'
import { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus } from '@discordjs/voice';

module.exports = {
    execute: async function(interaction: DiscordJS.CommandInteraction<DiscordJS.CacheType>, options: Omit<DiscordJS.CommandInteractionOptionResolver<DiscordJS.CacheType>, "getMessage" | "getFocused">) {
        const player = createAudioPlayer();
        async function connectToChannel(channel: VoiceChannel) { // Функция подключения к голосовому каналу
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
        
            try {
                await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
                return connection;
            } catch (error) {
                connection.destroy();
                throw error;
            }
        }
        let commandFunctions = require('../InternalFunctions.js');
        let votingName = options.getString('название')!
        let variants = options.getString('варианты')?.split(',')!
        variants = commandFunctions.uniq(variants)
        let timeOnVote = options.getNumber('время')! * 1000
        let messageId = ''

        if(variants?.length <= 1 || variants?.length > 5) {
            interaction.reply({
                content: `варианты указаны неверно`,
                ephemeral: true, 
            })
            return
        } else if (timeOnVote > 300000 || timeOnVote < 5000) {
            interaction.reply({
                content: `голосование не может длится больше 5 минут и меньше 5 секунд`,
                ephemeral: true, 
            })
            return
        }
        let votingRow = new MessageActionRow()
        
        let embedResult = new MessageEmbed()
            .setColor('PURPLE')
            .setTitle(`${votingName}`)
            .setDescription(`осталось: ${timeOnVote/1000} секунд`)
        variants.forEach(variant => {
            votingRow.addComponents(
                new MessageButton()
                    .setCustomId(`${variant}`)
                   .setLabel(`${variant}`)
                    .setStyle('PRIMARY'),
            );
            embedResult.addField(`${variant}`, '‎', false)
        })
        function Coundown() {   // Функция обратного отсчета
            if(timeOnVote > 1)
            {
                if (voiceChannel.members.size <= 1) {connection.disconnect()}
                timeOnVote = timeOnVote - 5000
                embedResult.description = `осталось: ${timeOnVote/1000} секунд`
                interaction.channel?.messages.fetch(messageId).then(m => m.edit({ content: '**голосование**', embeds: [embedResult], components: [votingRow] }))
            } else {                
                clearInterval(CountDown)
            }
            
        }
        function playGolosovanie() {   // Функция проигрывания голосования
            const resource = createAudioResource('https://eu.hitmotop.com/get/cuts/20/0d/200d4c87a3a4ad058768452b397bab90/65728625/Golosovanie_-_Golosovanie_b128f0d259.mp3', {
                inputType: StreamType.Arbitrary,
            });
        
            player.play(resource);
            return entersState(player, AudioPlayerStatus.Playing, 5e3);
        }
        
        await interaction.reply({
            content: `запуск`,
            ephemeral: false,                          
        })
        setTimeout(() => {
            interaction.deleteReply()
        }, 500);
        

        var voiceChannel = interaction.guild?.channels.cache.find(c => c.name === 'Другое') as VoiceChannel // проигрывание голосования в войс

        let connection = await connectToChannel(voiceChannel);
        connection.subscribe(player)
        
        await playGolosovanie()

        interaction.channel?.send({ // создание и удаление голосования через заданное время
        content: '**голосование**',
        embeds: [embedResult],
        components: [votingRow]
        })
        .then(msg => {  
            messageId = msg.id                    
            setTimeout(() => msg.delete(), timeOnVote + 500)
        })

        // connection.on('stateChange', (oldState, newState) => {                                   // Debug соединений
        //     console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
        // });
        
        // player.on('stateChange', (oldState, newState) => {
        //     console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
        // });

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            setTimeout(() => {
                if (connection.state.status == VoiceConnectionStatus.Disconnected) {
                    connection.destroy()
                }
            }, 5000);
        })

        const collector = interaction.channel?.createMessageComponentCollector({ time: timeOnVote })! // обработка голосования
        var CountDown = setInterval(Coundown, (5000)) //каждые 5 секунд
        let clickedUsers: string[] = []
        collector.on('collect', async i => { 
            if(clickedUsers.includes(i.user.id)) {
                let member = (await interaction.guild?.members.fetch(i.user.id))!
                i.reply({
                    content: `${member.nickname} самый умный тут? тебе потом эти сообщения удалять ( ͡° ͜ʖ ͡°)`,
                    ephemeral: true                   
                })
                return
            }
            let fieldIndex = embedResult.fields.findIndex(f => f.name === i.customId)  
            embedResult.fields[fieldIndex].value = embedResult.fields[fieldIndex].value + '█';
            await i.update({ content: '**голосование**', embeds: [embedResult], components: [votingRow] });
            clickedUsers.push(i.user.id)
        });
        setTimeout(() => {
            collector.on('end', async collected => { // вывод результатов голосования
                embedResult.description = ''            
                interaction.channel?.send({ 
                    content: 'результаты голосования',
                    embeds: [embedResult]
                })
                player.stop()
                if(connection.state.status !== VoiceConnectionStatus.Destroyed) {   // кикнуть бота если не был уничтожен до этого
                    connection.disconnect()
                }
            });
        }, 1000);

    }
}