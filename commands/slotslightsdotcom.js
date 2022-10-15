const { SlashCommandBuilder } = require('@discordjs/builders');
let interval = 1;
let startingTimer = 5;
let timer = startingTimer;
let outOfTime = false;
let embededResponse = {};
let kangz = [];
const { payout } = require('../util.js');
const embedTitle = `🎰⠀⠀SlotsLights.com⠀⠀🎰`;
const points = require('../config/gamba.json');


module.exports = {
	data: new SlashCommandBuilder()
	.setName('slotslightsdotcom')
	.setDescription('a skilled mans game.')
	.addBooleanOption(opt =>
		opt.setName('help')
		.setRequired(false)
		.setDescription('5 points to play'))
	, async execute(interaction) {
		
		interaction.guild.emojis.cache.forEach(e =>{
			if (e.name.includes('slotslights'))
				kangz.push(e.id)
		});

		helpFlag = interaction.options.getBoolean('help');
		if (helpFlag){
			interaction.reply({content: `Slotslights.com`, ephemeral: true, files: ['img/slots_help.png']});
			return;
		}

		interaction.reply({content: `You have been charged 5 points`, ephemeral: true});
		payout(interaction.user, -5);

		embededResponse = {
			title: `${embedTitle}`,
			fields: []
		};
		post = await interaction.channel.send({ embeds: [embededResponse], fetchReply: true }); 

		updateTimer(interaction, post);
	},
};


async function stopSpinning(interaction){
	let winOutcome = '';
	let paid = 0;


	embededResponse = {
		title: `${embedTitle}`,
		description: `${interaction.user.username} has pulled the lever.
		-----------------------------------
		|⠀⠀${reelMatrix[0][0]}⠀⠀|⠀⠀${reelMatrix[0][1]}⠀⠀|⠀⠀${reelMatrix[0][2]}⠀⠀|
		|⠀⠀${reelMatrix[1][0]}⠀⠀|⠀⠀${reelMatrix[1][1]}⠀⠀|⠀⠀${reelMatrix[1][2]}⠀⠀|
		|⠀⠀${reelMatrix[2][0]}⠀⠀|⠀⠀${reelMatrix[2][1]}⠀⠀|⠀⠀${reelMatrix[2][2]}⠀⠀|
		-----------------------------------`,
		fields: []
	};

	partialRowOutcome = [
		(reelMatrix[0][0] == reelMatrix[0][1] || reelMatrix[0][1] == reelMatrix[0][2]), 
		(reelMatrix[1][0] == reelMatrix[1][1] || reelMatrix[1][1] == reelMatrix[1][2]),
		(reelMatrix[2][0] == reelMatrix[2][1] || reelMatrix[2][1] == reelMatrix[2][2]),
		(reelMatrix[2][0] == reelMatrix[1][1] || reelMatrix[1][1] == reelMatrix[0][2]),
		(reelMatrix[0][0] == reelMatrix[1][1] || reelMatrix[1][1] == reelMatrix[2][2])
	];

	fullRowOutcome = [
		(reelMatrix[0][0] == reelMatrix[0][1] && reelMatrix[0][1] == reelMatrix[0][2] && reelMatrix[0][0] == reelMatrix[0][2]), 
		(reelMatrix[1][0] == reelMatrix[1][1] && reelMatrix[1][1] == reelMatrix[1][2] && reelMatrix[1][0] == reelMatrix[1][2]),
		(reelMatrix[2][0] == reelMatrix[2][1] && reelMatrix[2][1] == reelMatrix[2][2] && reelMatrix[2][0] == reelMatrix[2][2]),
		(reelMatrix[2][0] == reelMatrix[1][1] && reelMatrix[1][1] == reelMatrix[0][2] && reelMatrix[2][0] == reelMatrix[0][2]),
		(reelMatrix[0][0] == reelMatrix[1][1] && reelMatrix[1][1] == reelMatrix[2][2] && reelMatrix[0][0] == reelMatrix[2][2])
	];

	fullRowBonus = 3;
	fullRowOutcome.forEach((r, i) =>{
		row = (i > 2) ? 1 : i;
		winningEmojiId = interaction.guild.emojis.cache.get(reelMatrix[row][1].id);
		if (!r){
			if (partialRowOutcome[i]){
				winOutcome += `\n${winningEmojiId} Partial winner on row ${i+1}. ${winningEmojiId}`;
				paid += points[`SLOTS_${reelMatrix[row][1].name.split("_")[0].toUpperCase()}`];
			}
		}else{
			winOutcome += `\n🤴🏾 Full winner on row ${i+1}. ${winningEmojiId} * ${fullRowBonus}`;
			paid += points[`SLOTS_${reelMatrix[row][1].name.split("_")[0].toUpperCase()}`] * fullRowBonus;
		}
	});


	if (!winOutcome)
		winOutcome = '❌ Try again.';
	
	embededResponse.fields.push({
		name: `⠀`,
		value: `${winOutcome}`
	});

	
	if (paid > 0){
		payout(interaction.user, paid)
		embededResponse.fields.push({
			name: `Winnings`,
			value: `You have won ${paid} points!`
		});
	}
	
	post.edit({embeds: [embededResponse]});
}

// 	[00, 01, 02]
// 	[10, 11, 12]
// 	[20, 21, 22]
async function updateTimer(interaction, post){
	reelMatrix = []
	for (i=0;i<3;i++){
		// [interaction.guild.emojis.cache.get(kangz[1]), interaction.guild.emojis.cache.get(kangz[1]), interaction.guild.emojis.cache.get(kangz[1])],
		reel = [interaction.guild.emojis.cache.get(kangz[Math.floor(Math.random() * kangz.length)]),
				interaction.guild.emojis.cache.get(kangz[Math.floor(Math.random() * kangz.length)]),
				interaction.guild.emojis.cache.get(kangz[Math.floor(Math.random() * kangz.length)])];
		reelMatrix.push(reel)	
	}
	
	// reelMatrix = [
	// 	[interaction.guild.emojis.cache.get(kangz[Math.floor(Math.random() * kangz.length)]),
	// 	interaction.guild.emojis.cache.get(kangz[Math.floor(Math.random() * kangz.length)]),
	// 	interaction.guild.emojis.cache.get(kangz[1])],
		
	// 	[interaction.guild.emojis.cache.get(kangz[Math.floor(Math.random() * kangz.length)]),
	// 	interaction.guild.emojis.cache.get(kangz[1]),
	// 	interaction.guild.emojis.cache.get(kangz[Math.floor(Math.random() * kangz.length)])],
		
	// 	[interaction.guild.emojis.cache.get(kangz[1]),
	// 	interaction.guild.emojis.cache.get(kangz[Math.floor(Math.random() * kangz.length)]),
	// 	interaction.guild.emojis.cache.get(kangz[Math.floor(Math.random() * kangz.length)])]
	// ]
	
	embededResponse = {
		title: `${embedTitle}`,
		description: `${interaction.user.username} has pulled the lever.
		-----------------------------------
		|⠀⠀${reelMatrix[0][0]}⠀⠀|⠀⠀${reelMatrix[0][1]}⠀⠀|⠀⠀${reelMatrix[0][2]}⠀⠀|
		|⠀⠀${reelMatrix[1][0]}⠀⠀|⠀⠀${reelMatrix[1][1]}⠀⠀|⠀⠀${reelMatrix[1][2]}⠀⠀|⠀⠀⠀${timer}
		|⠀⠀${reelMatrix[2][0]}⠀⠀|⠀⠀${reelMatrix[2][1]}⠀⠀|⠀⠀${reelMatrix[2][2]}⠀⠀|
		-----------------------------------`,
	};

	post.edit({embeds: [embededResponse]});
	timer -= interval;

	if (timer <= 0){
		await stopSpinning(interaction);
		outOfTime = true;
		timer = startingTimer;
		if (outOfTime) return;
	}

	setTimeout(_=>{
		updateTimer(interaction, post)
	}, interval * 1000)
}