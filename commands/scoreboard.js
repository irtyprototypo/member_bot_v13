const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkPoints } = require('../util.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('scoreboard')
		.setDescription(`👀`),
	async execute(interaction) {
		let f = []
		csv = checkPoints(interaction.user).csv;

		csv.forEach((g, i) => {
			
			switch(parseInt(g.place)){
				case 1:
					str = `🥇 ${g.place}st: ${g.username} 🏆`
					break;
				case 2:
					str = `🥈 ${g.place}nd: ${g.username}`
					break;

				case 3:
					str = `🥉 ${g.place}rd: ${g.username}`
					break;
						
				default:
					str = `${g.place}th: ${g.username}`
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
