const {tyBot, bot3} = require('../config/users.json');
const cron = require('node-cron');
const { channel_bot_spam, channel_bot_spam_alt } = require('../config/channels.json');
const { payout } = require('../util.js');
const { GURUBASHI_WINNINGS, BASE_POINTS } = require('../config/gamba.json');
const { MODE, guildId, guildId_alt } = require('../config/bot.json');
const GUILD = (MODE == 'DEV') ? guildId_alt : guildId;
const CHANNEL_YELL = (MODE == 'DEV') ? channel_bot_spam : channel_bot_spam_alt;

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		let str = (MODE == 'DEV') ? '🌲🌲' : '🍺🍺';
		let guruInterval = 1;

		console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setActivity(str);
		
		// console.log(`Gurubashi is up. ${GURUBASHI_WINNINGS}/${guruInterval}h`);
		// cron.schedule(`0 */${guruInterval} * * *`, _=>{ gurubashiPoints(client); });
		// cron.schedule('*/3 * * * * *', _=>{ gurubashiPoints(client); });


	},
};

// broken
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