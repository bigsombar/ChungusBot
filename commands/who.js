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
module.exports = {
    execute: function (interaction, options) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            let commandFunctions = require('../InternalFunctions.js');
            let adminStatus = (_b = (yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(interaction.user.id)))) === null || _b === void 0 ? void 0 : _b.permissions.has("ADMINISTRATOR");
            let nick = (_d = (yield ((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.members.fetch(interaction.user.id)))) === null || _d === void 0 ? void 0 : _d.nickname;
            let firstName = options.getString('имя').toLowerCase();
            let dayOfBirth = options.getNumber('день');
            let you = commandFunctions.names(firstName, dayOfBirth);
            if (!(/^[а-я]+$/i.test(firstName))) {
                interaction.reply({
                    content: `Неправильная буква имени, подходит от а до я`,
                    ephemeral: true,
                });
                return;
            }
            if (!(dayOfBirth >= 1 && dayOfBirth <= 31)) {
                interaction.reply({
                    content: `Неправильно выбран день, нужно от 1 до 31`,
                    ephemeral: true,
                });
                return;
            }
            interaction.reply({
                content: `Ты ${you}`,
                ephemeral: true,
            });
            setTimeout(() => {
                var _a;
                (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send(`${nick} заявляет, что он теперь ${you}`);
            }, 3000);
            if (!adminStatus) {
                (_f = (_e = interaction.command) === null || _e === void 0 ? void 0 : _e.guild) === null || _f === void 0 ? void 0 : _f.members.fetch(interaction.user.id).then((member) => { member.setNickname(you); });
            }
        });
    }
};
