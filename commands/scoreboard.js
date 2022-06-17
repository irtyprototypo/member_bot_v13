const { SlashCommandBuilder } = require('@discordjs/builders');
const messageCreate = require('../events/messageCreate.js');
const { checkPoints } = require('../util.js');
const { MODE } = require('../config/bot.json');
// const CHANNEL_TEST = (MODE == 'DEV') ? channel_bot_testing_alt : channel_bot_testing;
// const CHANNEL_YELL = (MODE == 'DEV') ? channel_bot_spam : channel_bot_spam_alt;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('scoreboard')
		.setDescription(`👀`),
	execute(interaction) {
		let f = []
		csv = checkPoints(interaction.user).csv;
		csv.forEach((g, i) => {

			
			switch(parseInt(g.place)){
				case 1:
					str = `🥇 ${g.place}st: ${g.username} 🏆`;
					interaction.guild.members.fetch(g.id).then( e =>{
						// if(MODE != 'DEV')
							if(!e.nickname || !e.nickname.endsWith('🏆'))
								if(!e.nickname)
									e.setNickname(`${e.user.username} 🏆`)
								else
									e.setNickname(`${e.nickname} 🏆`);
					});
					break;
				case 2:
					str = `🥈 ${g.place}nd: ${g.username}`;
					break;

				case 3:
					str = `🥉 ${g.place}rd: ${g.username}`;
					break;
						
				default:
					str = `${g.place}th: ${g.username}`;
					break;
			}
			f[i] = {
				name: `${str}`,
				value: parseInt(g.points).toLocaleString("en-US")
			};
			
			interaction.guild.members.cache.forEach( m =>{
				if(g.place < 2)
					return;
				if(g.username == m.user.username && m.displayName.includes('🏆'))
					m.setNickname(m.displayName.substr(0, m.displayName.length-2));
			});

		});
		interaction.reply({ embeds: [{fields: f}] });

	},
};
