const { GatewayIntentBits } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const CommandsController = require('../controllers/CommandsController')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('Set the constants for XP earned by members')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('The bonus category')
				.setRequired(true)
				.addChoices(
					{ name: 'Video', value: 'video' },
					{ name: 'Streaming', value: 'streaming' },
					{ name: 'Crowd', value: 'crowd' },
					{ name: 'Min members to crowd', value: 'minMembersToCrowd'}

				))
		.addNumberOption(option =>
			option.setName('value')
				.setDescription('The xp earned will be multiplied by this constant (We recommend values >= 1)')
				.setRequired(true))
		.setDefaultMemberPermissions(GatewayIntentBits.Guilds),

	async execute(interaction) {
		const serverId = interaction.guild.id
		const type = interaction.options._hoistedOptions.find(option => option.name == 'type').value
		const value = interaction.options._hoistedOptions.find(option => option.name == 'value').value

		const memberPermissions = interaction.member.permissions.toArray()

		if (memberPermissions.indexOf('Administrator') >= 0) {
			await CommandsController.set(type, value, serverId)
			return interaction.reply(`The ${type} bonus was set to ${value} succefully.`)
		} else {
			return interaction.reply(`Unfortunately, you don't have permission to use this command.`)
		}
	},
}