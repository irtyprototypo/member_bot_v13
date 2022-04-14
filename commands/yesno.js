const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('yesno')
	.setDescription('👍/👎 yes or no. its a simple question')
	.addStringOption(opt =>
		opt.setName('question')
		.setDescription('what does ye ask?')),
	async execute(interaction) {
		let q = interaction.options.getString('question');

		if(Math.floor((Math.random() * 100) + 0) % 2 == 0)
			interaction.reply(`👍👍   ${q}   👍👍`);
		else
			interaction.reply(`👎👎   ${q}   👎👎`);
	},
};