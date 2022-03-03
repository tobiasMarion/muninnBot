const { SlashCommandBuilder } = require('@discordjs/builders')
const CommandsController = require('../controllers/CommandsController')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Display the 10 members with more XP on the server.'),

	async execute(interaction) {
		const serverId = interaction.guild.id

		const reply = await CommandsController.rank(serverId)

		return interaction.reply(reply)
	},
}