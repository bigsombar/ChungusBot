import DiscordJS, {} from 'discord.js'

module.exports = {
    execute: async function(interaction: DiscordJS.CommandInteraction<DiscordJS.CacheType>, options: Omit<DiscordJS.CommandInteractionOptionResolver<DiscordJS.CacheType>, "getMessage" | "getFocused">) {
        let commandFunctions = require('../InternalFunctions.js');
        let adminStatus = (await interaction.guild?.members.fetch(interaction.user.id))?.permissions.has("ADMINISTRATOR")
        let nick = (await interaction.guild?.members.fetch(interaction.user.id))?.nickname
        let firstName = options.getString('имя')!.toLowerCase()
        let dayOfBirth = options.getNumber('день')!
        let you: string = commandFunctions.names(firstName, dayOfBirth)
        if (!(/^[а-я]+$/i.test(firstName))) {
            interaction.reply({
                content: `Неправильная буква имени, подходит от а до я`,
                ephemeral: true, 
            })
            return
        }
        if (!(dayOfBirth >= 1 && dayOfBirth <= 31)) {
            interaction.reply({
                content: `Неправильно выбран день, нужно от 1 до 31`,
                ephemeral: true, 
            })
            return
        }
        interaction.reply({
            content: `${nick} заявляет, что он теперь ${you}`,
            ephemeral: false, 
        })
        setTimeout(() => {
            interaction.deleteReply()
        }, 7000); 
        if(!adminStatus) {
            interaction.command?.guild?.members.fetch(interaction.user.id).then((member)=> {member.setNickname(you)})
        }
    }
}