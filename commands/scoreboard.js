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
	async execute(interaction) {
		let f = []
		csv = checkPoints(interaction.user).csv;

		csv.forEach((g, i) => {
			interaction.guild.members.cache.forEach( m =>{
				if(m.user.username.endsWith('🏆'))
					m.user.username.slice(0, -1);
			});

			switch(parseInt(g.place)){
				case 1:
					str = `🥇 ${g.place}st: ${g.username} 🏆`;
					interaction.guild.members.fetch(g.id).then( e =>{
							if(!e.nickname.endsWith('🏆'))
								if(MODE != 'DEV')
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
				value: g.points
			};
		});
		interaction.reply({ embeds: [{fields: f}] });

	},
};
