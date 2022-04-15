const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sausage')
		.setDescription('🌭'),
	async execute(interaction) {
		let url = 'https://docs.google.com/spreadsheets/d/1wYVIE3mmkLpFhGdOraZ9lh14X5rP7lqg_SA3biV0YXA/edit?usp=sharing' 
		
		const emb = new MessageEmbed()
			.setURL(url)
			.setTitle('🤚 HERE WE GO! ✋')
		
		interaction.reply({ embeds: [emb] }).catch(console.error);
		
	},
};