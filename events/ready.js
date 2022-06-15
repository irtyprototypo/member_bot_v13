const { channel_bot_spam, channel_bot_spam_alt } = require('../config/channels.json');
const { GURUBASHI_WINNINGS, BASE_POINTS } = require('../config/gamba.json');
const { MODE, guildId, guildId_alt } = require('../config/bot.json');
const CHANNEL_YELL = (MODE == 'DEV') ? channel_bot_spam_alt : channel_bot_spam;
const GUILD = (MODE == 'DEV') ? guildId_alt : guildId;
const { payout } = require('../util.js');
const cron = require('node-cron');
const fs = require('fs');
const { MessageAttachment } = require('discord.js');
const imgDirectories = fs.readdirSync('./img').filter(file => { return fs.statSync('./img'+'/'+file).isDirectory() && file.endsWith('-memes')});

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		let str = (MODE == 'DEV') ? '🌲🌲' : '🍺🍺';
		let guruInterval = 1;
		let triviaInterval = 8;

		console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setActivity(str);
		
		// console.log(`Gurubashi is up. ${GURUBASHI_WINNINGS}/${guruInterval}h`);
		// cron.schedule(`0 */${guruInterval} * * *`, _=>{ gurubashiPoints(client); });
		// cron.schedule('*/3 * * * * *', _=>{ gurubashiPoints(client); });
		
		// console.log(`Trivia question every ${triviaInterval} hours.`);
		// cron.schedule(`${Math.random()*59} */${triviaInterval} * * *`, _=>{ client.commands.get('trivia').execute(client) });

		let when = Math.floor(Math.random()*59);
		console.log(`Meme posted ${when} minutes past every 3 hour.`);
		cron.schedule(`${Math.random()*59} */3 * * *`, _=>{ memPost(client) });
	},
};

// broken because of cron cache?
function gurubashiPoints(client){
	// console.log('a');
	client.guilds.cache.forEach(g => {
		if(g.id == GUILD)		// only look in relevant server
			g.voiceStates.cache.forEach(vs => {
				if(vs.channel && vs.channel.id != vs.channel.guild.afkChannelId){
					time = new Date();
					str = `${time.getHours()}:${time.getMinutes()}0 | ${vs.member.displayName} is in 🔊 ${vs.channel.name} and won ${BASE_POINTS} 💵.`;
					client.channels.cache.get(CHANNEL_YELL).send(str);
					console.log(str);
					paid = payout(vs.member.user, GURUBASHI_WINNINGS)
				}
			});
	});
}

function memPost(client){
	
	let mehOffset = 2;
	let ranDirIndex = Math.floor((Math.random() * imgDirectories.length)+mehOffset);
	const memes = fs.readdirSync(`./img/${imgDirectories[ranDirIndex]}`);
	// console.log(`${memes.length} memes found in ${imgDirectories[ranDirIndex]}.`);
	let ranMemeIndex = Math.floor((Math.random() * memes.length));
	console.log(ranMemeIndex);

	let file = new MessageAttachment(`./img/${imgDirectories[ranDirIndex]}/${memes[ranMemeIndex]}`);
	client.channels.cache.get(CHANNEL_YELL).send({ content: `${imgDirectories[ranDirIndex]}: ${ranMemeIndex} / ${memes.length}`, files: [file] });
}