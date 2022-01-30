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
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            let user = interaction.user;
            if (((_a = options.getUser('юзер')) === null || _a === void 0 ? void 0 : _a.username) !== undefined) {
                user = options.getUser('юзер');
            }
            let m = yield ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.fetch());
            let user_id = (_c = m === null || m === void 0 ? void 0 : m.find(m => m.user.id === (user === null || user === void 0 ? void 0 : user.id))) === null || _c === void 0 ? void 0 : _c.id;
            let user_nick;
            let user_name;
            let user_avatar;
            let user_money;
            let roles = [];
            yield ((_e = (_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.members.fetch(user_id)) === null || _e === void 0 ? void 0 : _e.then((member) => {
                user_name = member.user.username;
                user_nick = member.nickname;
                user_avatar = member.user.avatarURL();
                member.roles.cache.each(role => {
                    roles.push(`<@&${role.id}>`);
                });
            }));
            (() => __awaiter(this, void 0, void 0, function* () {
                const client = yield pool.connect();
                try {
                    const res = yield client.query(`
                select user_money from users
                where user_id = '${user_id}';
                `);
                    user_money = res.rows[0].user_money;
                }
                finally {
                    client.release();
                }
            }))().catch(err => console.log(err.stack));
            setTimeout(() => {
                var _a;
                interaction.reply({
                    content: `Хотел подробностей, да?\nно я не могу долго такое показывать`,
                    ephemeral: false,
                });
                const embedUserInfo = new discord_js_1.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`${user_name}`)
                    .setDescription(`${user_nick}`)
                    .setImage(`${user_avatar}`)
                    .addField('Роли:', roles.join('\n'), true)
                    .addField('Ядра:', `${user_money}`, true);
                (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({ embeds: [embedUserInfo] }).then(msg => {
                    setTimeout(() => msg.delete(), 12000);
                });
            }, 1000);
            setTimeout(() => {
                interaction.deleteReply();
            }, 7000);
        });
    }
};
