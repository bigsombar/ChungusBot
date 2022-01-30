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
    execute: function (interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let list = [];
            let members = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.fetch());
            members === null || members === void 0 ? void 0 : members.forEach(member => {
                list.push(`${member.user.username} | ${member.nickname}`);
            });
            interaction.reply({
                content: ` зачем тебе эта информация? (¬､¬) \nя удалю это через 15 секунд, записывай быстрее`,
                ephemeral: false,
            });
            setTimeout(() => {
                interaction.deleteReply();
            }, 7000);
            const embedUserList = new discord_js_1.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Список пользователей:')
                .setDescription(list.join("\n"))
                .setImage('https://c.tenor.com/UZmwl8vaGC0AAAAi/peepo-g.gif');
            (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.send({ embeds: [embedUserList] }).then(msg => {
                setTimeout(() => msg.delete(), 15000);
            });
        });
    }
};
