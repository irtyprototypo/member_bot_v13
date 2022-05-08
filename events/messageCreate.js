
const { channel_bot_testing, channel_bot_testing_alt, channel_bot_spam, channel_bot_spam_alt } = require('../config/channels.json');
const { bryan, irtypo } = require('../config/users.json');
const { PogChamp, pog, gachiGasm, member, implying } = require('../config/emoji.json');
const WHAT = true;
const { DUBS_WINNINGS, TRIPS_WINNINGS, QUADS_WINNINGS, QUINTS_WINNINGS } = require('../config/gamba.json');
const { payout } = require('../util.js');
const { MODE, guildId, guildId_alt } = require('../config/bot.json');
const CHANNEL_TEST = (MODE == 'DEV') ? channel_bot_testing_alt : channel_bot_testing;
const CHANNEL_YELL = (MODE == 'DEV') ? channel_bot_spam : channel_bot_spam_alt;


module.exports = {
	name: 'messageCreate',
	once: false,
	execute(message) {
		// console.log(message);
		// ignore other bot commands and other bots
		if(message.author.bot || message.content.substr(0, 1) == '!')
			return;

		// reactions
		message.channel.fetch()		// async 
		.then( _=> {	// member 🍇
			if(message.content.toLowerCase().includes('member'))
				message.react(member);
		})
		.then( _=> {	// think
			if(message.content.toLowerCase().includes('think'))
				message.react('🤔');
		})
		.then( _=> {	// george ⚾
			if(message.content.toLowerCase().includes('imply') || message.content.startsWith('>') )
				message.react(`${implying}`);
		})
		.then( _=> {	// 🍺
			if(message.content.toLowerCase().includes('hell y'))
				message.react(`🍻`);
		})


		// roll if in proper channel
		if(message.channelId == CHANNEL_TEST || message.channelId == CHANNEL_YELL) {

			message.channel.send(`<@${message.author.id}> 👉 ${message.id}`)
			.then( response =>{
				dubsCheck(message, response);
			})
			.then( _=> {	// what bryan
				if(WHAT && (message.author.id == bryan)){
					message.react('🇼');
					message.react('🇭');
					message.react('🇦');
					message.react('🇹');
				}
			})
			.catch(console.error);
		}

	},
};


function dubsCheck(message, response){

	let len = message.id.length;
	let ones = message.id.substr(len-1, 1);
	let tens = message.id.substr(len-2, 1);
	let thous = message.id.substr(len-3, 1);
	let tenThous = message.id.substr(len-4, 1);
	let hundThous = message.id.substr(len-5, 1);
	let mills = message.id.substr(len-6, 1);
	let n420 = message.id.substr(len-3);
	let n69 = message.id.substr(len-2, 2);


	// dubs
	if(ones == tens){
		if(MODE != "DEV")
			response.react(PogChamp);
		payout(message.author, parseInt(DUBS_WINNINGS));
	}
		
	// trips
	if(	ones == tens && tens == thous){
		if(MODE != "DEV")
			response.react(pog);
		payout(message.author, parseInt(TRIPS_WINNINGS));
	}
	
	// quads
	if(	ones == tens && tens == thous && thous == tenThous){
		if(MODE != "DEV")
			response.react(gachiGasm);
		payout(message.author, parseInt(QUADS_WINNINGS));
	}

	// quints
	if(	ones == tens && tens == thous && thous == tenThous && tenThous == hundThous){
		response.react(`🙏`);
		response.react(`💣`);
		payout(message.author, parseInt(QUINTS_WINNINGS));
	}

	// no sex. go touch grass.
	if(	ones == tens && tens == thous && thous == tenThous && tenThous == hundThous && hundThous == mills){
		response.react(`🔫`);
		payout(message.author, -666666);
	}

	if(n420 == `420`){
		response.react('🌲');
		payout(message.author, 420);
	}

	if(n69 == `69`){
		response.react('🇳');
		response.react('🇮');
		response.react('🇨');
		response.react('🇪');
		payout(message.author, 690);
	}

	// console.log(`${message.author.username} rolled a ...${mills}${hundThous}${tenThous}${thous}${tens}${ones}`);
}