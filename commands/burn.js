const { payout, checkPoints } = require('../util.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('burn')
		.setDescription('🔥 someones points')
		.addUserOption(opt =>
			opt.setName('who')
			.setRequired(true)
			.setDescription('whos points will perish?'))
		.addNumberOption(opt =>
			opt.setName('amount')
			.setRequired(true)
			.setDescription('how many points? [2:1] ')),
	async execute(interaction) {
		let who = interaction.options.getUser('who');
		let amount = interaction.options.getNumber('amount');

		destroyerPoints = checkPoints(interaction.user).user.points;

		if(amount > destroyerPoints){
			interaction.reply(`Insufficient funds.`);
			return;
		}

		payout(interaction.user, -amount);
		payout(who, -amount/2);
		interaction.reply(`${interaction.user.username} burned ${amount/2} of <@${who.id}>'s points.`);
	},
};
