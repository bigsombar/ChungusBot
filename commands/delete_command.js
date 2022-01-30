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
            let cmdName = options.getString('команда');
            let adminStatus = (_c = (yield ((_b = (_a = interaction.command) === null || _a === void 0 ? void 0 : _a.guild) === null || _b === void 0 ? void 0 : _b.members.fetch(interaction.user.id)))) === null || _c === void 0 ? void 0 : _c.permissions.has("ADMINISTRATOR");
            if (adminStatus) {
                let c = yield ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.commands.fetch());
                let foundCmdId = (_e = c === null || c === void 0 ? void 0 : c.find(c => c.name === cmdName)) === null || _e === void 0 ? void 0 : _e.id;
                if (foundCmdId !== undefined) {
                    (_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.commands.fetch(foundCmdId).then((com) => { com.delete(); });
                    interaction.reply({
                        content: `команда ${cmdName} удалена`,
                        ephemeral: true,
                    });
                }
                else {
                    interaction.reply({
                        content: `команда ${cmdName} не найдена`,
                        ephemeral: true,
                    });
                }
            }
            else {
                interaction.reply({
                    content: `у вас недостаточно прав`,
                    ephemeral: true,
                });
            }
        });
    }
};
