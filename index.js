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
    commands === null || commands === void 0 ? void 0 : commands.create({ name: 'ядро',
        description: 'кидает в тебя ядро, берегись',
    });
    commands === null || commands === void 0 ? void 0 : commands.create({ name: 'юзеры',
        description: 'выводит список пользователей сервера',
    });
    commands === null || commands === void 0 ? void 0 : commands.create({ name: 'удалить_команду',
        description: 'удаляет указанную слэш команду с сервера',
        options: [
            {
                name: 'команда',
                description: 'введите название команды без /',
                required: true,
                type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    });
    commands === null || commands === void 0 ? void 0 : commands.create({ name: 'кто_я',
        description: 'кто ты по жизни?',
        options: [
            {
                name: 'имя',
                description: 'первая буква имени на русском',
                required: true,
                type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'день',
                description: 'число дня рождения',
                required: true,
                type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.NUMBER
            }
        ]
    });
});
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName, options } = interaction;
    if (commandName === 'ядро') {
        let adminStatus = (_c = (yield ((_b = (_a = interaction.command) === null || _a === void 0 ? void 0 : _a.guild) === null || _b === void 0 ? void 0 : _b.members.fetch(interaction.user.id)))) === null || _c === void 0 ? void 0 : _c.permissions.has("ADMINISTRATOR");
        let nick = (_f = (yield ((_e = (_d = interaction.command) === null || _d === void 0 ? void 0 : _d.guild) === null || _e === void 0 ? void 0 : _e.members.fetch(interaction.user.id)))) === null || _f === void 0 ? void 0 : _f.nickname;
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
        if (!adminStatus) {
            setTimeout(() => {
                var _a, _b, _c;
                (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send(`${nick} оглушило на ${rTime / 1000} секунд`);
                (_c = (_b = interaction.command) === null || _b === void 0 ? void 0 : _b.guild) === null || _c === void 0 ? void 0 : _c.members.fetch(interaction.user.id).then((member) => { member.timeout(rTime, 'вас оглушило ядром'); });
            }, 4000);
        }
        else {
            setTimeout(() => {
                var _a;
                (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send(`${nick} блокирует весь урон`);
            }, 4000);
        }
    }
    if (commandName === 'кто_я') {
        let commandFunctions = require('./InternalFunctions.js');
        let adminStatus = (_j = (yield ((_h = (_g = interaction.command) === null || _g === void 0 ? void 0 : _g.guild) === null || _h === void 0 ? void 0 : _h.members.fetch(interaction.user.id)))) === null || _j === void 0 ? void 0 : _j.permissions.has("ADMINISTRATOR");
        let nick = (_m = (yield ((_l = (_k = interaction.command) === null || _k === void 0 ? void 0 : _k.guild) === null || _l === void 0 ? void 0 : _l.members.fetch(interaction.user.id)))) === null || _m === void 0 ? void 0 : _m.nickname;
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
            (_p = (_o = interaction.command) === null || _o === void 0 ? void 0 : _o.guild) === null || _p === void 0 ? void 0 : _p.members.fetch(interaction.user.id).then((member) => { member.setNickname(you); });
        }
    }
    if (commandName === 'удалить_команду') {
        let cmdName = options.getString('команда');
        let adminStatus = (_s = (yield ((_r = (_q = interaction.command) === null || _q === void 0 ? void 0 : _q.guild) === null || _r === void 0 ? void 0 : _r.members.fetch(interaction.user.id)))) === null || _s === void 0 ? void 0 : _s.permissions.has("ADMINISTRATOR");
        if (adminStatus) {
            let foundCmdName = (_u = (_t = interaction.guild) === null || _t === void 0 ? void 0 : _t.commands.cache.find(c => c.name === cmdName)) === null || _u === void 0 ? void 0 : _u.name;
            if (foundCmdName !== undefined) {
                (_w = (_v = interaction.guild) === null || _v === void 0 ? void 0 : _v.commands.cache.find(c => c.name === cmdName)) === null || _w === void 0 ? void 0 : _w.delete();
                interaction.reply({
                    content: `команда ${foundCmdName} удалена`,
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
    }
    if (commandName === 'юзеры') {
        let list = [];
        yield ((_x = interaction.guild) === null || _x === void 0 ? void 0 : _x.members.fetch().then((members) => members.forEach((member) => {
            list.push(`${member.user.username} | ${member.nickname}`);
        })));
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
        (_y = interaction.channel) === null || _y === void 0 ? void 0 : _y.send({ embeds: [embedUserList] }).then(msg => {
            setTimeout(() => msg.delete(), 15000);
        });
    }
}));
client.login(process.env.TOKEN);
