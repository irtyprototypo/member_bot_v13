const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('🏓 pong'),
	execute(interaction) {
		// console.log(interaction.client.ws.ping);
		let ping = interaction.client.ws.ping;
		let pad = '';
		for (i=0;i < ping/10; i++){
			pad+='🏓';
		}
		// pad+='.';
		// for (i=0;i < ping%10; i++){
		// 	pad+='🏓';
		// }
		interaction.reply(`${pad}`);
		// interaction.followUp(`Websocket heartbeat: ${interaction.client.ws.ping}ms.`);
	},
};