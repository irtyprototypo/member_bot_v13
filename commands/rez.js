const {sandW} = require('../config/emoji.json');
const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('rez')
		.setDescription(':)')
		.addMentionableOption(opt =>
			opt.setName('who')
			.setRequired(true)
			.setDescription('tyvm')),
	async execute(interaction) {
		let who = interaction.options.getMentionable('who');

		interaction.reply(`🙏 Praise Jesus! ${who} has risen! ${sandW}`)
			.then( _=> {
				let role = interaction.guild.roles.cache.find(role => role.name === 'ded')
				who.roles.remove(role);
				who.edit({mute : false});
				who.edit({deaf : false});
			})
			.catch(console.error);
	},
};