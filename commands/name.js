const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('name')
		.setDescription('📝 rename another user')
		.addMentionableOption(opt =>
			opt.setName('who')
			.setRequired(true)
			.setDescription('who shall be renamed?'))
		.addStringOption(opt =>
			opt.setName('to')
			.setRequired(true)
			.setDescription('what shall they be called?'))
		.addBooleanOption(opt =>
			opt.setName('announce')
			.setDescription('announce')),
	async execute(interaction) {
		// console.log(interaction);
		let who = interaction.options.getMentionable('who');
		let to = interaction.options.getString('to');
		let anounce = interaction.options.getBoolean('shh');
		interaction.options.getMentionable('who').setNickname(to);
		if(anounce)
			interaction.reply(`${interaction.user.username} renamed ${who} to ${to}`);
		
		console.log(`${interaction.user.username} renamed ${who.user.username} to ${to}`);
	},
};