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
const voice_1 = require("@discordjs/voice");
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
let pool = new pg_1.Pool();
let lastVote = 0;
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
client.on('ready', () => {
    var _a, _b, _c;
    console.log('Chungus is ready my ass!');
    if (process.platform == 'win32') {
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
    }
    const guildId = '709463991759536139';
    const guild = client.guilds.cache.get(guildId);
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
        sendToChat('bot-logs', `About to exit in ${datetime}`);
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
    //  REPETAT VARIABLES CLEAN THEM IN !!!exitSignalHandler!!!
    var TestPostInterval = setInterval(BDSync, (60000 * 60)); //every hour
    // EXIT HANDLER
    process.on('SIGINT', exitSignalHandler);
});
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName, options } = interaction;
    if (commandName === 'ядро') {
        let adminStatus = (_c = (yield ((_b = (_a = interaction.command) === null || _a === void 0 ? void 0 : _a.guild) === null || _b === void 0 ? void 0 : _b.members.fetch(interaction.user.id)))) === null || _c === void 0 ? void 0 : _c.permissions.has("ADMINISTRATOR");
        let nick = (_f = (yield ((_e = (_d = interaction.command) === null || _d === void 0 ? void 0 : _d.guild) === null || _e === void 0 ? void 0 : _e.members.fetch(interaction.user.id)))) === null || _f === void 0 ? void 0 : _f.nickname;
        let rTime = Math.floor((Math.random() * 15000) + 5000);
        var catchChance = Math.random(); // from 0 to 1
        function stunned() {
            var _a, _b;
            const embedStuned = new discord_js_1.MessageEmbed()
                .setColor('GREEN')
                .setTitle(`${nick}`)
                .setDescription(`оглушило на ${Math.round(rTime / 1000)} секунд`)
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
                if (catchChance < 0.7) {
                    // 70% chance of being stunned
                    stunned();
                }
                else {
                    // 30% chance of catch cannon ball
                    catched();
                }
            }
            else {
                catched(); //admin always catches
            }
        }, 2000);
    }
    if (commandName === 'кинуть_ядро_в') {
        let currentMember = (yield ((_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.members.fetch(interaction.user.id)));
        let enemyMember = (yield ((_h = interaction.guild) === null || _h === void 0 ? void 0 : _h.members.fetch(options.getUser('юзер').id)));
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
                setTimeout(() => msg.delete(), 10000);
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
                setTimeout(() => msg.delete(), 10000);
            });
        }
        setTimeout(() => {
            ;
            (() => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    if (commandName === 'юзеры') {
        let list = [];
        yield ((_j = interaction.guild) === null || _j === void 0 ? void 0 : _j.members.fetch().then((members) => members.forEach((member) => {
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
        (_k = interaction.channel) === null || _k === void 0 ? void 0 : _k.send({ embeds: [embedUserList] }).then(msg => {
            setTimeout(() => msg.delete(), 15000);
        });
    }
    if (commandName === 'юзер') {
        let user = interaction.user;
        if (((_l = options.getUser('юзер')) === null || _l === void 0 ? void 0 : _l.username) !== undefined) {
            user = options.getUser('юзер');
        }
        let m = yield ((_m = interaction.guild) === null || _m === void 0 ? void 0 : _m.members.fetch());
        let user_id = (_o = m === null || m === void 0 ? void 0 : m.find(m => m.user.id === (user === null || user === void 0 ? void 0 : user.id))) === null || _o === void 0 ? void 0 : _o.id;
        let user_nick;
        let user_name;
        let user_avatar;
        let user_money;
        let roles = [];
        yield ((_q = (_p = interaction.guild) === null || _p === void 0 ? void 0 : _p.members.fetch(user_id)) === null || _q === void 0 ? void 0 : _q.then((member) => {
            user_name = member.user.username;
            user_nick = member.nickname;
            user_avatar = member.user.avatarURL();
            member.roles.cache.each(role => {
                roles.push(`<@&${role.id}>`);
            });
        }));
        (() => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    if (commandName === 'кто_я') {
        let commandFunctions = require('./InternalFunctions.js');
        let adminStatus = (_t = (yield ((_s = (_r = interaction.command) === null || _r === void 0 ? void 0 : _r.guild) === null || _s === void 0 ? void 0 : _s.members.fetch(interaction.user.id)))) === null || _t === void 0 ? void 0 : _t.permissions.has("ADMINISTRATOR");
        let nick = (_w = (yield ((_v = (_u = interaction.command) === null || _u === void 0 ? void 0 : _u.guild) === null || _v === void 0 ? void 0 : _v.members.fetch(interaction.user.id)))) === null || _w === void 0 ? void 0 : _w.nickname;
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
            (_y = (_x = interaction.command) === null || _x === void 0 ? void 0 : _x.guild) === null || _y === void 0 ? void 0 : _y.members.fetch(interaction.user.id).then((member) => { member.setNickname(you); });
        }
    }
    if (commandName === 'голосование') {
        let commandFunctions = require('./InternalFunctions.js');
        let votingName = options.getString('название');
        let variants = (_z = options.getString('варианты')) === null || _z === void 0 ? void 0 : _z.split(',');
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
            if (timeOnVote > 1) {
                timeOnVote = timeOnVote - 5000;
                embedResult.description = `осталось: ${timeOnVote / 1000} секунд`;
                (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.messages.fetch(messageId).then(m => m.edit({ content: 'голосование', embeds: [embedResult], components: [votingRow] }));
            }
            else {
                clearInterval(CountDown);
            }
        }
        function playGolosovanie() {
            const resource = (0, voice_1.createAudioResource)('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', {
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
        let voiceChannel = (_0 = interaction.guild) === null || _0 === void 0 ? void 0 : _0.channels.cache.find(c => c.name === 'Звук'); // проигрывание голосования в войс
        let connection = yield connectToChannel(voiceChannel);
        connection.subscribe(player);
        yield playGolosovanie();
        connection.on(voice_1.VoiceConnectionStatus.Disconnected, (oldState, newState) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield Promise.race([
                    (0, voice_1.entersState)(connection, voice_1.VoiceConnectionStatus.Signalling, 5000),
                    (0, voice_1.entersState)(connection, voice_1.VoiceConnectionStatus.Connecting, 5000),
                ]);
                // Seems to be reconnecting to a new channel - ignore disconnect
            }
            catch (error) {
                // Seems to be a real disconnect which SHOULDN'T be recovered from
                player.stop();
                connection.destroy();
            }
        }));
        (_1 = interaction.channel) === null || _1 === void 0 ? void 0 : _1.send({
            content: '**голосование**',
            embeds: [embedResult],
            components: [votingRow]
        }).then(msg => {
            messageId = msg.id;
            setTimeout(() => msg.delete(), timeOnVote + 500);
        });
        const collector = (_2 = interaction.channel) === null || _2 === void 0 ? void 0 : _2.createMessageComponentCollector({ time: timeOnVote }); // обработка голосования
        var CountDown = setInterval(Coundown, (5000)); //каждые 5 секунд
        let clickedUsers = [];
        collector.on('collect', (i) => __awaiter(void 0, void 0, void 0, function* () {
            var _9;
            if (clickedUsers.includes(i.user.id)) {
                let member = (yield ((_9 = interaction.guild) === null || _9 === void 0 ? void 0 : _9.members.fetch(i.user.id)));
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
            collector.on('end', (collected) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                embedResult.description = '';
                (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({
                    content: 'результаты голосования',
                    embeds: [embedResult]
                });
                if (connection.state.status != voice_1.VoiceConnectionStatus.Destroyed) { // проверка на кикнутого бота из войса
                    player.stop();
                    connection.destroy();
                }
            }));
        }, 1000);
    }
    if (commandName === 'удалить_команду') {
        let cmdName = options.getString('команда');
        let adminStatus = (_5 = (yield ((_4 = (_3 = interaction.command) === null || _3 === void 0 ? void 0 : _3.guild) === null || _4 === void 0 ? void 0 : _4.members.fetch(interaction.user.id)))) === null || _5 === void 0 ? void 0 : _5.permissions.has("ADMINISTRATOR");
        if (adminStatus) {
            let c = yield ((_6 = interaction.guild) === null || _6 === void 0 ? void 0 : _6.commands.fetch());
            let foundCmdId = (_7 = c === null || c === void 0 ? void 0 : c.find(c => c.name === cmdName)) === null || _7 === void 0 ? void 0 : _7.id;
            if (foundCmdId !== undefined) {
                (_8 = interaction.guild) === null || _8 === void 0 ? void 0 : _8.commands.fetch(foundCmdId).then((com) => { com.delete(); });
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
    }
}));
client.login(process.env.TOKEN);
