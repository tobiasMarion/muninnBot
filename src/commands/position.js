const { SlashCommandBuilder } = require('@discordjs/builders')
const CommandsController = require('../controllers/CommandsController')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('position')
		.setDescription('Display info about yourself.')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The member to be searched')),

	async execute(interaction) {
		const serverId = interaction.guild.id
		let memberId = interaction.options._hoistedOptions[0]

		if (!memberId) {
			memberId = interaction.user.id
		} else {
			memberId = memberId.user.id
		}

		const reply = await CommandsController.position(memberId, serverId)
		
		return interaction.reply(reply)
	},
}