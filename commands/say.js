const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('say')
	.setDescription('no u')
	.addStringOption(opt =>
		opt.setName('statement')
		.setRequired(true)
		.setDescription('🗣'))
	.addBooleanOption(opt =>
		opt.setName('yell')
		.setDescription('🔊')),
	async execute(interaction) {
		let s = interaction.options.getString('statement');
		let y = interaction.options.getBoolean('yell');
		if (y == null) y = false;
		console.log(`${interaction.user.username} said ${s}.`);
		interaction.channel.send({ content: `${s}`, tts: y});
		interaction.reply({ content: `I have spoken`, ephemeral: true});
	},
};