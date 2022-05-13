
const { Integration } = require('discord.js');
const { payout, dubsCheck } = require('../util.js');



module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		console.log(`${interaction.user.tag} invoked /${interaction.commandName} in #${interaction.channel.name}.`);
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) return;
		try {
			digits = dubsCheck(interaction.id);
			digits = 420;
			if(digits > 0)
				payout(interaction.user, digits);
			command.execute(interaction);
			
		}
		catch (error) { console.error(error); }
	},
};