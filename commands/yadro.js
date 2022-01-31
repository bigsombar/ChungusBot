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
module.exports = {
    execute: function (interaction, pool) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let adminStatus = (_b = (yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(interaction.user.id)))) === null || _b === void 0 ? void 0 : _b.permissions.has("ADMINISTRATOR");
            let nick = (_d = (yield ((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.members.fetch(interaction.user.id)))) === null || _d === void 0 ? void 0 : _d.nickname;
            let rTime = Math.floor((Math.random() * 15000) + 5000);
            var catchChance = Math.random(); // from 0 to 1
            function stunned() {
                var _a, _b;
                const embedStuned = new discord_js_1.MessageEmbed()
                    .setColor('RED')
                    .setTitle(`${nick}`)
                    .setDescription(`выпало ${catchChance}, оглушило на ${Math.round(rTime / 1000)} секунд`)
                    .setImage('https://c.tenor.com/m3dTQ35dchIAAAAC/teletubbies-tired.gif');
                (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({ embeds: [embedStuned] }).then(msg => {
                    setTimeout(() => msg.delete(), rTime);
                });
                (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.fetch(interaction.user.id).then((member) => { member.timeout(rTime, 'вас оглушило ядром'); });
            }
            function catched() {
                var _a;
                const embedCatch = new discord_js_1.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`${nick}`)
                    .setDescription(`выпало ${catchChance}, поймал ядро 🎉`)
                    .setImage('https://c.tenor.com/s7hF0AVkmAoAAAAd/%D0%BC%D1%8E%D0%BD%D1%85%D0%B0%D1%83%D0%B7%D0%B5%D0%BD-%D0%BC%D1%8E%D0%BD%D0%B3%D1%85%D0%B0%D1%83%D0%B7%D0%B5%D0%BD.gif');
                (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({ embeds: [embedCatch] }).then(msg => {
                    setTimeout(() => msg.delete(), 7000);
                });
                (() => __awaiter(this, void 0, void 0, function* () {
                    const client = yield pool.connect();
                    try {
                        const res = yield client.query(`
                    update users
                    set user_money = user_money + 1
                    where user_id = '${interaction.user.id}';
                    `);
                    }
                    finally {
                        client.release();
                    }
                }))().catch(err => console.log(err.stack));
            }
            interaction.reply({
                content: `Лови ядро!`,
                ephemeral: false,
            });
            setTimeout(() => {
                interaction.deleteReply();
            }, 5000);
            setTimeout(() => {
                if (!adminStatus) {
                    if (catchChance < 0.2) {
                        // 20% chance of being stunned
                        stunned();
                    }
                    else {
                        // 80% chance of catch cannon ball
                        catched();
                    }
                }
                else {
                    catched(); //admin always catches
                }
            }, 2000);
        });
    }
};
