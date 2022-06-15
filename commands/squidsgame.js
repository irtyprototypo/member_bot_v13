const { SlashCommandBuilder } = require('@discordjs/builders');
const BOOL_CHOICES = ['🇹', '🇫'];
const MULTI_CHOICES = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫'];
let interval = 1;
let startingTimer = 20;
let timer = startingTimer;
let outOfTime = false;
let r, answer;
let choices = [];
let embededResponse = {};
const { payout } = require('../util.js');
const { SQUID_GAME_WINNINGS } = require('../config/gamba.json');



module.exports = {
	data: new SlashCommandBuilder()
	.setName('squidsgame')
	.setDescription('riddle me this, squidman')
	.addStringOption(opt =>
		opt.setName('riddle')
		.setRequired(true)
		.setDescription('me this!'))
	.addStringOption(opt =>
		opt.setName('1')
		.setDescription('🇦'))
	.addStringOption(opt =>
		opt.setName('2')
		.setDescription('🇧'))
	.addStringOption(opt =>
		opt.setName('3')
		.setDescription('🇨'))
	.addStringOption(opt =>
		opt.setName('4')
		.setDescription('🇩'))
	.addStringOption(opt =>
		opt.setName('5')
		.setDescription('🇪'))
	.addNumberOption(opt =>
		opt.setName('corret')
		.setDescription('✅'))
	, async execute(interaction) {
		r = interaction.options.getString('riddle');
		let a = interaction.options.getString('1');
		let b = interaction.options.getString('2');
		let c = interaction.options.getString('3');
		let d = interaction.options.getString('4');
		let e = interaction.options.getString('5');
		choices = [];
		if (a) choices.push(a);
		if (b) choices.push(b);
		if (c) choices.push(c);
		if (d) choices.push(d);
		if (e) choices.push(e);

		answer = interaction.options.getNumber('corret');
		let answerEmoji = MULTI_CHOICES[answer-1];
		if(!answerEmoji){
			interaction.reply({content: `You must provide a valid answer.`, ephemeral: true})
			return;
		}
		console.log(`sg key: ${answerEmoji}`);
		interaction.reply({content: `Correct answer: ${answerEmoji}`, ephemeral: true})
		embededResponse = {};
		embededResponse.title = ` 🦑 Squids Game! 🧠`;
		embededResponse.description = ``;
		interaction.channel.send(`@here`); 
		post = await interaction.channel.send({ embeds: [embededResponse], fetchReply: true }); 

		const collection = post.createReactionCollector({
			filter: reaction => { return MULTI_CHOICES.includes(reaction.emoji.name) || BOOL_CHOICES.includes(reaction.emoji.name)},
			time: 10*60*1000
		});

		collection.on('collect', (reaction, user) => {
			if(!user.bot && reaction.emoji.name == answerEmoji){
				console.log(`${user.username} is the winner`);
				post.reactions.removeAll();
				embededResponse.fields.push({
					name: `\n\nThe correct answer was ${answerEmoji}`,
					value: `${user.username} wins ${SQUID_GAME_WINNINGS}!`,
				})
				
				post.edit({embeds: [embededResponse]});
				payout(user, SQUID_GAME_WINNINGS);
			}
		});

		updateTimer(interaction.user, post);
	},
};


async function displayQuestion(){
	embededResponse.title = `❓\t\t${r}\t\t❔`;
	embededResponse.description = ``;
	choices.forEach((e, i) => {
		embededResponse.fields.push({
			name: `‎`,
			value: `${MULTI_CHOICES[i]}\t ${e}`,
		})
	});

	post.edit({embeds: [embededResponse]});
	setTimeout(_=>{
		choices.forEach( (c, i) =>{ post.react(MULTI_CHOICES[i]) })
	}, 3000)
}

async function updateTimer(user, post){
	embededResponse = {
		title: ` 🦑 Squids Game! 🧠`,
		description: `Game started by ${user.username}
		
		I will ask a question in ${timer} seconds.
		First to answer the question correctly wins ${SQUID_GAME_WINNINGS} points!`,
		fields: []
	};

	post.edit({embeds: [embededResponse]});
	timer -= interval;

	if (timer <= 0){
		await displayQuestion();
		outOfTime = true;
		timer = startingTimer;
		if (outOfTime) return;
	}

	setTimeout(_=>{
		updateTimer(user, post)
	}, interval * 1000)
}
