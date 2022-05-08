const { checkPoints, scoreboard } = require('../util.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('🤑'),
	async execute(interaction) {
		let who = checkPoints(interaction.user);
		interaction.reply(`You are ${who.str}`);
	},
};
