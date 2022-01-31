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
//ts-node index.ts - for manual start
//git add *, git commit -m "sampletext", git push
//botsync in cmd
//добавляй await к запросам требующим времени
const discord_js_1 = __importStar(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const client = new discord_js_1.default.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
        discord_js_1.Intents.FLAGS.GUILD_BANS,
        discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES
    ]
});
// VARIABLES
let jstsPostfix;
let pool = new pg_1.Pool();
let lastVoteDate = +new Date();
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log('Chungus is ready my ass!');
    if (process.platform == 'win32') { // Определяет систему 
        pool = new pg_1.Pool({
            user: 'bigsombar',
            host: '192.168.0.180',
            database: 'bigsombar',
            password: '7015',
            port: 5432,
        });
        (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity("за разработкой📝", {
            type: "WATCHING"
        });
        jstsPostfix = 'ts';
    }
    else {
        pool = new pg_1.Pool({
            user: 'bigsombar',
            host: '127.0.0.1',
            database: 'bigsombar',
            password: '7015',
            port: 5432,
        });
        (_b = client.user) === null || _b === void 0 ? void 0 : _b.setActivity("за ядрами", {
            type: "WATCHING"
        });
        jstsPostfix = 'js';
    }
    const guildId = '493027607424663562';
    let guilFind;
    yield client.guilds.fetch(guildId).then(g => {
        guilFind = g;
    });
    const guild = guilFind;
    let commands;
    if (guild) {
        commands = guild.commands;
    }
    else {
        commands = (_c = client.application) === null || _c === void 0 ? void 0 : _c.commands;
    }
    // FUNCTIONS
    function sendToChat(channelName, importantlText) {
        let channel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.find(c => c.name === channelName);
        if (channel === null || channel === void 0 ? void 0 : channel.isText()) {
            channel.send(importantlText);
        }
    }
    function BDSync() {
        return __awaiter(this, void 0, void 0, function* () {
            let dUsers = [
                {
                    id: "id",
                    username: "username",
                    nickname: "nickname",
                    avatar_url: "url"
                }
            ];
            yield (guild === null || guild === void 0 ? void 0 : guild.members.fetch().then((members) => members.forEach(member => {
                let memberNick = member.nickname;
                if (memberNick == null) {
                    memberNick = "отсутствует";
                }
                dUsers.push({
                    id: member.id,
                    username: member.user.username,
                    nickname: memberNick,
                    avatar_url: member.user.avatarURL()
                });
            })));
            dUsers.shift();
            (() => __awaiter(this, void 0, void 0, function* () {
                const client = yield pool.connect();
                try {
                    dUsers.forEach((d) => __awaiter(this, void 0, void 0, function* () {
                        const res = yield client.query(`
                    INSERT INTO users (user_id, user_name, user_nickname, user_avatarurl) 
                    VALUES (${d.id}, '${d.username}', '${d.nickname}', '${d.avatar_url}')  
                    ON CONFLICT (user_id) DO UPDATE SET (user_name, user_nickname, user_avatarurl) = (EXCLUDED.user_name, EXCLUDED.user_nickname, EXCLUDED.user_avatarurl)`);
                    }));
                }
                finally {
                    client.release();
                }
            }))().catch(err => console.log(err.stack));
        });
    }
    function exitSignalHandler() {
        var Da = new Date();
        var datetime = `${Da.getHours()}:${Da.getMinutes()}  ${Da.getDate()}-${Da.getMonth() + 1}-${Da.getFullYear()}`;
        sendToChat('👾bot-logs📃', `About to exit in ${datetime}`);
        console.log(`About to exit in ${datetime}`);
        clearInterval(TestPostInterval);
        pool.end();
        setTimeout(() => {
            process.exit();
        }, 1000);
    }
    // COMMANDS DECLARATION
    commands === null || commands === void 0 ? void 0 : commands.create({ name: 'ядро',
        description: 'кидает в тебя ядро, берегись',
    });
    commands === null || commands === void 0 ? void 0 : commands.create({ name: 'кинуть_ядро_в',
        description: 'попросить кинуть ядро в невинного юзера',
        options: [
            {
                name: 'юзер',
                description: 'укажите юзера',
                required: true,
                type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.USER
            }
        ]
    });
    commands === null || commands === void 0 ? void 0 : commands.create({ name: 'юзеры',
        description: 'выводит список пользователей сервера',
    });
    commands === null || commands === void 0 ? void 0 : commands.create({ name: 'юзер',
        description: 'выводит информацию о себе или о другом юзере',
        options: [
            {
                name: 'юзер',
                description: 'укажите юзера',
                required: false,
                type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.USER
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
    commands === null || commands === void 0 ? void 0 : commands.create({ name: 'голосование',
        description: 'проводит голосование',
        options: [
            {
                name: 'название',
                description: 'за что голосуем?',
                required: true,
                type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'варианты',
                description: 'введите варианты через запятую',
                required: true,
                type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'время',
                description: 'сколько секунд на голосование',
                required: true,
                type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.NUMBER
            }
        ]
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
    // REPETAT VARIABLES CLEAN THEM IN !!!exitSignalHandler!!!
    var TestPostInterval = setInterval(BDSync, (60000 * 60)); //every hour
    // EXIT HANDLER
    process.on('SIGINT', exitSignalHandler);
    //BDSync() // синкануть первый раз, потом удалить
}));
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName, options } = interaction;
    if (commandName === 'ядро') {
        let command = require(`./commands/yadro.${jstsPostfix}`);
        command.execute(interaction, pool);
    }
    if (commandName === 'кинуть_ядро_в') {
        let command = require(`./commands/throw_yadro.${jstsPostfix}`);
        command.execute(interaction, pool, options);
    }
    if (commandName === 'юзеры') {
        let command = require(`./commands/users.${jstsPostfix}`);
        command.execute(interaction);
    }
    if (commandName === 'юзер') {
        let command = require(`./commands/user.${jstsPostfix}`);
        command.execute(interaction, pool, options);
    }
    if (commandName === 'кто_я') {
        let command = require(`./commands/who.${jstsPostfix}`);
        command.execute(interaction, options);
    }
    if (commandName === 'голосование') {
        var msMinute = 60 * 1000;
        var msDay = 60 * 60 * 24 * 1000;
        var currentDate = +new Date();
        var differenceMinutes = Math.floor(((currentDate - lastVoteDate) % msDay) / msMinute);
        if (differenceMinutes < 5) {
            interaction.reply({
                content: `голосование не может быть использовано чаще чем раз в 5 минут, прошло только ${differenceMinutes} минут`,
                ephemeral: true,
            });
        }
        else {
            lastVoteDate = +new Date();
            let command = require(`./commands/vote.${jstsPostfix}`);
            command.execute(interaction, options);
        }
    }
    if (commandName === 'удалить_команду') {
        let command = require(`./commands/delete_command.${jstsPostfix}`);
        command.execute(interaction, options);
    }
}));
client.login(process.env.TOKEN);
