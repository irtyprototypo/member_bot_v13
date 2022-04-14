const {wut} = require('../config/emoji.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
let min = 1;
let max = 4;
let missCount = 0;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('shoot')
		.setDescription('🔫 mad? sad? ...bad?')
		.addMentionableOption(opt =>
			opt.setName('who')
			.setDescription('rly tho?')),
	async execute(interaction) {
		let who = interaction.options.getMentionable('who');
		who = (who) ? who : interaction.user;
		roll = Math.floor((Math.random() * max) + min)
		
		if (missCount > max)
			if(Math.floor((Math.random() * 2) + 1) % 2 == 1)
				roll = max;

		switch(roll){
			case min:
				msg = `lel ${interaction.user.username} 🔫 missed ${who}, and shot himself `;
				missCount = 0;
				break;
			case max:
				msg = `${interaction.user.username} shot ${who} 🔫`;
				missCount = 0;
				break;
			default:
				msg = `🔫 ${interaction.user.username} missed ${who} `;
				missCount++;
				break;
		}

		interaction.reply(msg)
			.then( _ => {
				console.log(`${msg}:`, interaction.user.username);
				let role = interaction.guild.roles.cache.find(role => role.name === 'ded');

				switch(roll){
					case min:
							interaction.member.roles.add(role);
							interaction.member.edit({mute : true});
							interaction.member.edit({deaf  : true});
							interaction.channel.send(`${wut}`);
						break;
					case max:
							who.roles.add(role);
							who.edit({mute : true});
							who.edit({deaf  : true});
						break;
					default:
						break;
				}

			})
			.catch(console.error);
	},
};