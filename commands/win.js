const { checkPoints, payout } = require('../util.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('win')
		.setDescription('🍺'),
	async execute(interaction) {

		checkPoints(interaction.user);
		let paid = payout(interaction.user, 100);
		interaction.reply(`You have ${paid.str}`);

	},
};
