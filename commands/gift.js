const { gift } = require('../util.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gift')
		.setDescription('🎁')
		.addUserOption(opt =>
			opt.setName('who')
			.setRequired(true)
			.setDescription('who will recieve the points?'))
		.addNumberOption(opt =>
			opt.setName('amount')
			.setRequired(true)
			.setDescription('how many points?')),
	async execute(interaction) {
		let who = interaction.options.getUser('who');
		let amount = interaction.options.getNumber('amount');

		resp = gift(interaction.user, who, amount);
		// console.log(resp.str)
		interaction.reply(resp.str)

	},
};
