"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
module.exports = {
    execute: function (interaction, options) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const player = (0, voice_1.createAudioPlayer)();
            function connectToChannel(channel) {
                return __awaiter(this, void 0, void 0, function* () {
                    const connection = (0, voice_1.joinVoiceChannel)({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                    });
                    try {
                        yield (0, voice_1.entersState)(connection, voice_1.VoiceConnectionStatus.Ready, 30e3);
                        return connection;
                    }
                    catch (error) {
                        connection.destroy();
                        throw error;
                    }
                });
            }
            let commandFunctions = require('../InternalFunctions.js');
            let votingName = options.getString('название');
            let variants = (_a = options.getString('варианты')) === null || _a === void 0 ? void 0 : _a.split(',');
            variants = commandFunctions.uniq(variants);
            let timeOnVote = options.getNumber('время') * 1000;
            let messageId = '';
            if ((variants === null || variants === void 0 ? void 0 : variants.length) <= 1 || (variants === null || variants === void 0 ? void 0 : variants.length) > 5) {
                interaction.reply({
                    content: `варианты указаны неверно`,
                    ephemeral: true,
                });
                return;
            }
            else if (timeOnVote > 300000 || timeOnVote < 5000) {
                interaction.reply({
                    content: `голосование не может длится больше 5 минут и меньше 5 секунд`,
                    ephemeral: true,
                });
                return;
            }
            // process.on('unhandledRejection', error => {
            //     console.error('Unhandled promise rejection:', error);
            // });
            let votingRow = new discord_js_1.MessageActionRow();
            let embedResult = new discord_js_1.MessageEmbed()
                .setColor('PURPLE')
                .setTitle(`${votingName}`)
                .setDescription(`осталось: ${timeOnVote / 1000} секунд`);
            variants.forEach(variant => {
                votingRow.addComponents(new discord_js_1.MessageButton()
                    .setCustomId(`${variant}`)
                    .setLabel(`${variant}`)
                    .setStyle('PRIMARY'));
                embedResult.addField(`${variant}`, '‎', false);
            });
            function Coundown() {
                var _a;
                if (timeOnVote > 5001) {
                    if (voiceChannel.members.size <= 1) {
                        connection.disconnect();
                    }
                    timeOnVote = timeOnVote - 5000;
                    embedResult.description = `осталось: ${timeOnVote / 1000} секунд`;
                    (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.messages.fetch(messageId).then(m => m.edit({ content: '**голосование**', embeds: [embedResult], components: [votingRow] }));
                }
                else {
                    clearInterval(CountDown);
                }
            }
            function playGolosovanie() {
                const resource = (0, voice_1.createAudioResource)('https://eu.hitmotop.com/get/cuts/20/0d/200d4c87a3a4ad058768452b397bab90/65728625/Golosovanie_-_Golosovanie_b128f0d259.mp3', {
                    inputType: voice_1.StreamType.Arbitrary,
                });
                player.play(resource);
                return (0, voice_1.entersState)(player, voice_1.AudioPlayerStatus.Playing, 5e3);
            }
            yield interaction.reply({
                content: `запуск`,
                ephemeral: false,
            });
            setTimeout(() => {
                interaction.deleteReply();
            }, 500);
            var voiceChannel;
            yield ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.channels.fetch('493027607915266081').then(channel => {
                voiceChannel = channel;
            }));
            let connection = yield connectToChannel(voiceChannel); // проигрывание голосования в войс
            connection.subscribe(player);
            yield playGolosovanie();
            (_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.send({
                content: '**голосование**',
                embeds: [embedResult],
                components: [votingRow]
            }).then(msg => {
                messageId = msg.id;
                setTimeout(() => msg.delete(), timeOnVote + 500);
            });
            connection.on('stateChange', (oldState, newState) => {
                console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
            });
            player.on('stateChange', (oldState, newState) => {
                console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
            });
            connection.on(voice_1.VoiceConnectionStatus.Disconnected, () => __awaiter(this, void 0, void 0, function* () {
                setTimeout(() => {
                    if (connection.state.status == voice_1.VoiceConnectionStatus.Disconnected) {
                        connection.destroy();
                    }
                }, 5000);
            }));
            const collector = (_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.createMessageComponentCollector({ time: timeOnVote }); // обработка голосования
            var CountDown = setInterval(Coundown, (5000)); // раз в 5 секунд
            let clickedUsers = [];
            collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                var _e;
                if (clickedUsers.includes(i.user.id)) {
                    let member = (yield ((_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.members.fetch(i.user.id)));
                    i.reply({
                        content: `${member.nickname} самый умный тут? тебе потом эти сообщения удалять ( ͡° ͜ʖ ͡°)`,
                        ephemeral: true
                    });
                    return;
                }
                let fieldIndex = embedResult.fields.findIndex(f => f.name === i.customId);
                embedResult.fields[fieldIndex].value = embedResult.fields[fieldIndex].value + '█';
                yield i.update({ content: '**голосование**', embeds: [embedResult], components: [votingRow] });
                clickedUsers.push(i.user.id);
            }));
            setTimeout(() => {
                collector.on('end', (collected) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    embedResult.description = '';
                    (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({
                        content: 'результаты голосования',
                        embeds: [embedResult]
                    });
                    player.stop();
                    if (connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) { // кикнуть бота если не был уничтожен до этого
                        connection.disconnect();
                    }
                }));
            }, 1000);
        });
    }
};
