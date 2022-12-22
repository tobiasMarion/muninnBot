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
		let voiceState

		if (memberId) {
			memberId = memberId.user.id
			voiceState = interaction.options._hoistedOptions[0].member.voice
		} else {
			memberId = interaction.user.id
			voiceState = interaction.member.voice
		}

		const reply = await CommandsController.position(memberId, serverId, voiceState)

		return interaction.reply(reply)
	},
}