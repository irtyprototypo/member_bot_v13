const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sausage')
		.setDescription('🌭'),
	async execute(interaction) {
		let url = 'https://docs.google.com/spreadsheets/d/1wYVIE3mmkLpFhGdOraZ9lh14X5rP7lqg_SA3biV0YXA/edit?usp=sharing' 
		
		let butt = new MessageButton()
			.setLabel('🤚 HERE WE GO! ✋')
			.setStyle('LINK')
			.setURL(url);

		const row = new MessageActionRow()
			.addComponents(butt);

		await interaction.reply({ components: [row] });
		
	},
};