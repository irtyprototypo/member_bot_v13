const { SlashCommandBuilder } = require('@discordjs/builders');
const { MODE, botId, botId_alt } = require('../config/bot.json');
const { checkPoints, payout } = require('../util.js');
const BOT = (MODE == 'DEV') ? botId_alt : botId;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deathroll')
		.setDescription(`😈🎲☠`)
		.addUserOption(opt =>
			opt.setName('who')
			.setRequired(true)
			.setDescription('time to die'))
		.addNumberOption(opt =>
			opt.setName('amount')
			.setDescription(`default: max points`)),
	async execute(interaction) {
		let who = interaction.options.getUser('who');
		roller1 = checkPoints(interaction.user).user;
		roller2 = checkPoints(who).user;
		let amount = (interaction.options.getNumber('amount')) ? interaction.options.getNumber('amount') : roller1.points;
		let currMaxRoll = amount*10;
		let r1roll = Math.floor(Math.random() * 100)+1;
		let r2roll = Math.floor(Math.random() * 100)+1;
		let starter = (r1roll > r2roll) ? roller1 : roller2;
		let turn = starter;
		let rollCount = 0;

		if(amount > roller1.points){
			interaction.reply(`Insufficient funds.`);
			return;
		}


		let embDesc = `Roll down from ${currMaxRoll}.\n First to 1 loses ${amount} points.`;
		embededResponse = {
			title: `${interaction.user.username} has initiated a Death Roll.`,
			url: 'https://youtu.be/T92IaAZpcBw',
			description: embDesc,
			fields: [
				{
					name: `${roller1.username}`,
					value: `${roller1.points} points`,
					inline: true
				},
				{
					name: `${roller2.username}`,
					value: `${roller2.points} points`,
					inline: true
				}
			],
		};
	
		const filter = (reaction, user) => {
			return ['✅', '🚫', '🎲'].includes(reaction.emoji.name);
		};

		let message = await interaction.reply({ content: `<@${roller2.id}>, you tryin' to roll?`, embeds: [embededResponse], fetchReply: true});
		message.react(`✅`).then(_=> message.react('🚫'));
		const collector = message.createReactionCollector({ filter });
		
		collector.on('collect', (reaction, user) => {
			// console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);

			switch(reaction.emoji.name){
				case '✅':
					if(user.id === roller2.id){
						message.reactions.removeAll()
						message.reply(`☠ ${roller2.username} has accepted 🎲.\n ${roller1.username} rolled a ${r1roll} and ${roller2.username} rolled a ${r2roll}.\n ${starter.username} will be rolling first.`);
						message.react(`🎲`);
					}
					break;
				case '🚫':
					if(user.id === roller2.id){
						message.reply(`${roller2.username} has denied the death roll.`);
						message.reactions.removeAll()
					}
					break;
				case '🎲':

					if(user.username == turn.username){
						rollCount++;
						message.reactions.removeAll()
						let roll = Math.floor(Math.random() * currMaxRoll)+1;
						if(roll == 1){
							turn = (turn == roller1) ? roller2 : roller1;
							embededResponse.description = `${embDesc}\n Winner: ${turn.username}`;
							embededResponse.fields.push({
								name: `Roll ${rollCount}`,
								value: `${user.username} rolls a ${roll}. ${user.username} loses ${amount} points.`,
								inline: false
							})
							message.edit({embeds: [ embededResponse ]});
							
							payout(user, -parseInt(amount));
							payout(turn, parseInt(amount));
							break;
						}

						message.react(`🎲`);
						turn = (turn == roller1) ? roller2 : roller1;
						embededResponse.description = `${embDesc}\n Current Turn: ${turn.username}`;
						embededResponse.fields.push({
							name: `Roll ${rollCount}`,
							value: `${user.username} rolls ${roll} (1-${currMaxRoll}).`,
							inline: false
						})
						message.edit({embeds: [ embededResponse ]});
						currMaxRoll = roll;
					}
					break;
				default:
					break;
			}

		});
	},
};