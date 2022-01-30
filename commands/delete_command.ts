import DiscordJS, { } from 'discord.js'

module.exports = {
    execute: async function (interaction: DiscordJS.CommandInteraction<DiscordJS.CacheType>, options: Omit<DiscordJS.CommandInteractionOptionResolver<DiscordJS.CacheType>, "getMessage" | "getFocused">) {
        let cmdName = options.getString('команда')!
        let adminStatus = (await interaction.command?.guild?.members.fetch(interaction.user.id))?.permissions.has("ADMINISTRATOR")
        if (adminStatus) {
            let c = await interaction.guild?.commands.fetch()
            let foundCmdId = c?.find(c => c.name === cmdName)?.id
            if (foundCmdId !== undefined) {
                interaction.guild?.commands.fetch(foundCmdId).then((com) => { com.delete() })
                interaction.reply({
                    content: `команда ${cmdName} удалена`,
                    ephemeral: true,
                })
            } else {
                interaction.reply({
                    content: `команда ${cmdName} не найдена`,
                    ephemeral: true,
                })
            }
        } else {
            interaction.reply({
                content: `у вас недостаточно прав`,
                ephemeral: true,
            })
        }
    }
}