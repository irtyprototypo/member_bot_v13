
const { channel_bot_testing, channel_bot_testing_alt, channel_bot_spam, channel_bot_spam_alt } = require('../config/channels.json');
const { bryan, irtypo } = require('../config/users.json');
const { PogChamp, pog, gachiGasm, member, implying } = require('../config/emoji.json');
const WHAT = true;
const { DUBS_WINNINGS, TRIPS_WINNINGS, QUADS_WINNINGS, QUINTS_WINNINGS, STUN_CHANCE } = require('../config/gamba.json');
const { payout, dubsCheck } = require('../util.js');
const { MODE, guildId, guildId_alt } = require('../config/bot.json');
const CHANNEL_TEST = (MODE == 'DEV') ? channel_bot_testing_alt : channel_bot_testing;
const CHANNEL_YELL = (MODE == 'DEV') ? channel_bot_spam : channel_bot_spam_alt;
const { MessageAttachment } = require('discord.js');
const fs = require('fs');
const stoneColdGIFs = fs.readdirSync('./img/stonecold');


module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
		// console.log(message);
		// ignore other bot commands and other bots
		if(message.author.bot || message.content.substr(0, 1) == '!')
			return;


		// stunner
		let stunned = Math.random() * 256
		if(message.member.voice.channel && stunned > 255){
			message.member.voice.disconnect();
			message.reply({ 
				// content: `1/${STUN_CHANCE} chance to get stunned. 🍻 https://youtu.be/MOzjBO2dsmY 🍻`,
				files: [ new MessageAttachment(`./img/stonecold/${stoneColdGIFs[Math.floor((Math.random() * stoneColdGIFs.length) + 1)]}`)]
			});
		}
		

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

		// points singles
		single = parseInt(message.id.substr(message.id.length-1, 1))
		payout(message.author, single);

		// roll if in proper channel
		if(message.channelId == CHANNEL_TEST || message.channelId == CHANNEL_YELL) {

			await message.channel.send(`<@${message.author.id}> 👉 ${message.id}`)
			.then( response =>{
				dubsWinnings = dubsCheck(message.id);
				reactIfDubs(dubsWinnings, response);
				if (dubsWinnings > 0)
					payout(message.author, dubsWinnings)
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


function reactIfDubs(digits, response){

	if(MODE != "DEV"){
		switch(digits){
			case parseInt(DUBS_WINNINGS):
				response.react(PogChamp);
				break;
			case parseInt(TRIPS_WINNINGS):
				response.react(pog);
				break;
			case parseInt(QUADS_WINNINGS):
				response.react(gachiGasm);
				break;
			case parseInt(QUINTS_WINNINGS):
				response.react(`🙏`);
				response.react(`💣`);
				break;
			case -666666:
				response.react(`🔫`);
				break;
			case 420:
				response.react('🌲');
				response.react(PogChamp);
				break;
			case 69:
				response.react(PogChamp);
				response.react('🇳');
				response.react('🇮');
				response.react('🇨');
				response.react('🇪');
				break;
			default:
				break;
		}
	}
}