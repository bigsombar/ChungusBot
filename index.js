"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//npm run tsc - to auto compile to JS
//npm run dev - to rerun bot when saving ts file
//git add *, git commit -m "sampletext", git push
//botsync in cmd
const discord_js_1 = __importStar(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new discord_js_1.default.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
        discord_js_1.Intents.FLAGS.GUILD_BANS
    ]
});
client.on('ready', () => {
    var _a;
    console.log('Chungus is ready my ass!');
    const guildId = '709463991759536139';
    const guild = client.guilds.cache.get(guildId);
    let commands;
    if (guild) {
        commands = guild.commands;
    }
    else {
        commands = (_a = client.application) === null || _a === void 0 ? void 0 : _a.commands;
    }
    commands === null || commands === void 0 ? void 0 : commands.create({
        name: 'ядро',
        description: 'кидает в тебя ядро, берегись',
    });
});
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName, options } = interaction;
    let nick = (_c = (yield ((_b = (_a = interaction.command) === null || _a === void 0 ? void 0 : _a.guild) === null || _b === void 0 ? void 0 : _b.members.fetch(interaction.user.id)))) === null || _c === void 0 ? void 0 : _c.nickname;
    if (commandName === 'ядро') {
        let rTime = Math.floor((Math.random() * 15000) + 5000);
        interaction.reply({
            content: `Лови ядро!`,
            ephemeral: true,
        });
        setTimeout(() => {
            var _a;
            (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send(`༼つಠ益ಠ༽つ ─=≡🔴 ${nick}`);
        }, 1000);
        setTimeout(() => {
            var _a;
            (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send(`💥💥💥`);
        }, 3000);
        setTimeout(() => {
            var _a, _b, _c;
            (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send(`${nick} оглушило на ${rTime / 1000} секунд`);
            (_c = (_b = interaction.command) === null || _b === void 0 ? void 0 : _b.guild) === null || _c === void 0 ? void 0 : _c.members.fetch(interaction.user.id).then((member) => { member.timeout(rTime, 'вас оглушило ядром'); });
        }, 4000);
    }
}));
client.on('messageCreate', (message) => {
    if (message.content == 'ping') {
        message.reply({
            content: 'pong',
        });
    }
});
client.login(process.env.TOKEN);
