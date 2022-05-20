const fs = require('fs');
const { payout, dubsCheck } = require('../util.js');
const { MessageAttachment } = require('discord.js');
const stoneColdGIFs = fs.readdirSync('./img/stonecold');
const { STUN_CHANCE } = require('../config/gamba.json');



module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		console.log(`${interaction.user.tag} invoked /${interaction.commandName} in #${interaction.channel.name}.`);
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) return;

		// singles
		try {
			digits = dubsCheck(interaction.id);
			if(digits > 0)
				payout(interaction.user, digits);
			command.execute(interaction);
		}catch (error) { console.error(error); }

		
		// stunner
		let stunned = Math.random() * parseInt(STUN_CHANCE)
		if(message.member.voice.channel && stunned > parseInt(STUN_CHANCE)-1){
			message.member.voice.disconnect();
			message.reply({ 
				// content: `1/${STUN_CHANCE} chance to get stunned. 🍻 https://youtu.be/MOzjBO2dsmY 🍻`,
				files: [ new MessageAttachment(`./img/stonecold/${stoneColdGIFs[Math.floor((Math.random() * stoneColdGIFs.length) + 1)]}`)]
			});
		}
		
	},
};