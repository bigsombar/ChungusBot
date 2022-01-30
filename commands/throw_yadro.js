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
    execute: function (interaction, pool, options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let currentMember = (yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(interaction.user.id)));
            let enemyMember = (yield ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.fetch(options.getUser('юзер').id)));
            let adminStatus = enemyMember.permissions.has("ADMINISTRATOR");
            let stunTime = Math.floor((Math.random() * 15000) + 5000);
            var hitChance = Math.random();
            var catchChance = Math.random();
            var currentMemberMoney = 0;
            const client = yield pool.connect();
            try {
                const res = yield client.query(`
            select user_money from users
            where user_id = '${currentMember.id}';
            `);
                currentMemberMoney = res.rows[0].user_money;
            }
            finally {
                client.release();
            }
            if (currentMemberMoney <= 0) { //Checking money is available
                interaction.reply({
                    content: `${currentMember === null || currentMember === void 0 ? void 0 : currentMember.nickname} у вас недостаточно ядер`,
                    ephemeral: true,
                });
                return;
            }
            else {
                interaction.reply({
                    content: `${currentMember === null || currentMember === void 0 ? void 0 : currentMember.nickname} Кидает ядро в ${enemyMember === null || enemyMember === void 0 ? void 0 : enemyMember.nickname}!`,
                    ephemeral: false,
                });
                setTimeout(() => {
                    interaction.deleteReply();
                }, 5000);
            }
            function stunned() {
                var _a;
                const embedStuned = new discord_js_1.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`${enemyMember.nickname}`)
                    .setDescription(`оглушило на ${Math.round(stunTime / 1000)} секунд`)
                    .setImage('https://c.tenor.com/m3dTQ35dchIAAAAC/teletubbies-tired.gif');
                (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({ embeds: [embedStuned] }).then(msg => {
                    setTimeout(() => msg.delete(), stunTime);
                });
                enemyMember.timeout(stunTime, 'вас оглушило ядром');
            }
            function catched() {
                var _a;
                const embedCatch = new discord_js_1.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`${enemyMember.nickname}`)
                    .setDescription(`поймал ядро 🎉`)
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
                    where user_id = '${enemyMember.user.id}';
                    `);
                    }
                    finally {
                        client.release();
                    }
                }))().catch(err => console.log(err.stack));
            }
            function missed() {
                var _a;
                const embedMiss = new discord_js_1.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`${currentMember.nickname}`)
                    .setDescription(`не попал в цель, в другой раз повезет`)
                    .setImage('https://c.tenor.com/ArzW85faMkgAAAAd/fail-basketball.gif');
                (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({ embeds: [embedMiss] }).then(msg => {
                    setTimeout(() => msg.delete(), 7000);
                });
            }
            setTimeout(() => {
                ;
                (() => __awaiter(this, void 0, void 0, function* () {
                    const client = yield pool.connect();
                    try {
                        const res = yield client.query(`
                    update users
                    set user_money = user_money - 1
                    where user_id = '${currentMember.user.id}';
                    `);
                    }
                    finally {
                        client.release();
                    }
                }))().catch(err => console.log(err.stack));
            }, 1000);
            setTimeout(() => {
                if (hitChance < 0.8) {
                    // 80% chance of being hit
                    if (!adminStatus) {
                        if (catchChance < 0.7) {
                            // 56% chance of being stunned
                            stunned();
                        }
                        else {
                            // 24% chance of catch cannon ball
                            catched();
                        }
                    }
                    else {
                        catched(); //admin always catches
                    }
                }
                else {
                    // 20% chance of miss
                    missed();
                }
            }, 2000);
        });
    }
};
