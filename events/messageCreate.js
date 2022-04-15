
const {channel_bot_testing, channel_bot_testing_2, channel_bot_spam} = require('../config/channels.json');
const {bryan, irtypo} = require('../config/users.json');
const {PogChamp, pog, gachiGasm, member, implying} = require('../config/emoji.json');
let what = true;
module.exports = {
	name: 'messageCreate',
	once: false,
	execute(message) {
		
		// ignore other bot commands and other bots
		if(message.author.bot || message.content.substr(0, 1) == '!')
			return;

		// reactions
		message.channel.sendTyping()
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
		if(message.channelId == channel_bot_testing ||
			message.channelId == channel_bot_testing_2 ||
			message.channelId == channel_bot_spam) {

			message.channel.send(`<@${message.author.id}> 👉 ${message.id}`)
			.then( response =>{
				dubsCheck(message, response);
			})
			.then( _=> {	// what bryan
				if(what && (message.author.id == bryan)){
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
	let tenThours = message.id.substr(len-4, 1);
	let hundThours = message.id.substr(len-5, 1);
	let mills = message.id.substr(len-6, 1);
	let n420 = message.id.substr(len-3);
	let n69 = message.id.substr(len-2, 2);


	// let myMessage
	if(ones == tens)
		response.react(PogChamp);

	if(	ones == tens &&
		tens == thous)
		response.react(pog);
	
	//quads
	if(	ones == tens &&
		tens == thous &&
		thous == tenThours)
		response.react(gachiGasm);

	// quints
	if(	ones == tens &&
		tens == thous &&
		thous == tenThours &&
		tenThours == hundThours){
		response.react(`🙏`);
		response.react(`💣`);
	}

	if(	ones == tens &&
		tens == thous &&
		thous == tenThours &&
		tenThours == hundThours &&
		hundThours == mills)
		response.react(`🔫`);

	if(n420 == `420`)
		response.react('🌲');

	if(n69 == `69`){
		response.react('🇳');
		response.react('🇮');
		response.react('🇨');
		response.react('🇪');
	}

	// console.log(`${message.author.username} rolled a ...${mills}${hundThours}${tenThours}${thous}${tens}${ones}`);
}