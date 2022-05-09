const { SlashCommandBuilder } = require('@discordjs/builders');
const { WIN_THREASHOLD } = require('../config/gamba.json');
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
			.setDescription('default: max points')),
	async execute(interaction) {
		let who = interaction.options.getUser('who');
		let amount = (interaction.options.getNumber('amount')) ? interaction.options.getNumber('amount') : 100;
		roller1 = checkPoints(interaction.user).user;
		roller2 = checkPoints(who).user;
		let currMaxRoll = 100;
		let r1roll = Math.floor(Math.random() * currMaxRoll)+1;
		let r2roll = Math.floor(Math.random() * currMaxRoll)+1;
		let starter = (r1roll > r2roll) ? roller1 : roller2;

		embededResponse = {
			title: `${interaction.user.username} has initiated a Death Roll.`,
			url: 'https://youtu.be/T92IaAZpcBw',
			description: 'Roll down from 1000. First to 1 loses.',
			fields: [
				{
					name: `${roller1.username}`,
					value: `${roller1.points}`,
					inline: true
				},
				{
					name: `${roller2.username}`,
					value: `${roller2.points}`,
					inline: true
				}
			],
			// image: {
			// 	url: 'https://i.imgur.com/AfFp7pu.png',
			// },
		};
	

		
		const filter = (reaction, user) => {
			return ['✅', '🚫', '🎲'].includes(reaction.emoji.name);
		};

		let message = await interaction.reply({ content: `<@${roller2.id}>, you tryin' to roll?`, embeds: [embededResponse], fetchReply: true});
		message.react(`✅`).then(_=> message.react('🚫'));

		const collector = message.createReactionCollector({ filter });
		
		collector.on('collect', (reaction, user) => {
			console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);

			switch(reaction.emoji.name){
				case '✅':
					if(user.id === roller2.id){
						message.reactions.removeAll()
						message.reply(`${roller2.username} has accepted the death roll.\n ${roller1.username} rolled a ${r1roll} and ${roller2.username} rolled a ${r2roll}.\n ${starter.username} will be rolling first.`);
						message.react(`🎲`);
					}
					break;
				case '🚫':
					if(user.id === roller2.id)
						message.reply(`${roller2.username} has denied the death roll.`);
					break;
				case '🎲':
					// console.log(user);
					if(user.username == starter.username){
						message.reactions.removeAll()
						let roll = Math.floor(Math.random() * currMaxRoll)+1;
						message.reply(`${starter.username} has rolls ${roll}. (1-${currMaxRoll})`);
					}
					// message.reply(`${roller2.username} hdqqdqdq`);
					break;
				default:
					message.reply(`wat`);
					break;
			}

			// reaction.remove(user);
			// reaction.remove(BOT);
		});
		// console.log(message.reactions.removeAll());
		// a = message.reactions.removeAll();

		// message.reactions.resolve(a);
		
		// collector.on('end', collected => {
		// 	console.log(`Collected ${collected.size} items`);
		// });

	},
};


function whosStarting(message){

	

}