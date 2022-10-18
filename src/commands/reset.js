const { SlashCommandBuilder } = require('@discordjs/builders')
const CommandsController = require('../controllers/CommandsController')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription("Reset members' XP"),

	async execute(interaction) {
		const serverId = interaction.guild.id

		const memberPermissions = interaction.member.permissions.toArray()

		if (memberPermissions.indexOf('Administrator') >= 0) {
			await CommandsController.reset(serverId)
			return interaction.reply(`The members' XP was reseted succefully.`)
		} else {
			return interaction.reply(`Unfortunately, you don't have permission to use this command.`)
		}
	},
}