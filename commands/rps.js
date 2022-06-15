const { SlashCommandBuilder } = require('@discordjs/builders');
const { RPS_WINNINGS } = require('../config/gamba.json');
const { MODE, botId, botId_alt } = require('../config/bot.json');
const { irtypo } = require('../config/users.json');
const { checkPoints, payout } = require('../util.js');
const BOT = (MODE == 'DEV') ? botId_alt : botId;
const OPTIONS = ['🏀', '📄', '✂'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription(`${OPTIONS.toString()}`),
	async execute(interaction) {

		const filter = (reaction, user) => {
			return OPTIONS.includes(reaction.emoji.name) && user.id == interaction.user.id;
		};
		checkPoints(interaction.user);
		let message = await interaction.reply({ content: `Choose your weapon: ${OPTIONS.toString()}`, fetchReply: true});
		message.react(OPTIONS[0]).then(_=> message.react(OPTIONS[1])).then(_=> message.react(OPTIONS[2]));

		const collector = message.createReactionCollector({ filter });
		
		collector.on('collect', (reaction, user) => {

			switch(reaction.emoji.name){
				case OPTIONS[0]:
					userChoice = 0;
					break;
				case OPTIONS[1]:
					userChoice = 1;
					break;
				case OPTIONS[2]:
					userChoice = 2;
					break;
				default:
					break;
			}

			let cpuChoice = Math.floor(Math.random() * 100) % 3;
			// console.log(interaction.user.id, irtypo);
			outcome = (userChoice > cpuChoice || (userChoice == 0 && cpuChoice == 2)) ? `win ${RPS_WINNINGS} points!`: 'lose.';
			if(interaction.user.id == irtypo){
				userChoice = (cpuChoice+1)%3;
				outcome = `win ${RPS_WINNINGS} points!`;
			}


			message.edit(`You threw ${reaction.emoji.name}. I threw ${OPTIONS[cpuChoice]}. You ${outcome}`);
			message.reactions.removeAll();

			if(outcome.includes('win'))
				payout(interaction.user, parseInt(RPS_WINNINGS))


		});
		

	},
};