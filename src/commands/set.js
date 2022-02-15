const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('Set the constants for XP earned by members')
		.addStringOption(option =>
			option.setName('bonus')
				.setDescription('The bonus category')
				.setRequired(true)
				.addChoice('Camera', 'Camera')
				.addChoice('Screen Sharing', 'Screen Sharing'))
		.addNumberOption(option => 
			option.setName('value')
			.setDescription('value')
			.setRequired(true)),

	async execute(interaction) {
		const [bonus, value] = interaction.options._hoistedOptions
		return interaction.reply({
			content: `The ${bonus.value} bonus was set to ${value.value}.`,
			ephemeral: true
		});
	},
};