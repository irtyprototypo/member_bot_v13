const { SlashCommandBuilder } = require('@discordjs/builders');
const { WIN_THREASHOLD } = require('../config/gamba.json');
const { checkPoints, payout } = require('../util.js');
const FIRE_THREASHOLD = 3;
let critMultiplier = 10;
let consecutiveCount = 0;
const { takemymoney } = require('../config/emoji.json');
const { MODE } = require('../config/bot.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('gamble')
		.setDescription(`🎲 > ${WIN_THREASHOLD} = 💰`)
		.addNumberOption(opt =>
			opt.setName('bet')
			.setDescription('my pleasure')),
	async execute(interaction) {
		let win = false;
		let bet = interaction.options.getNumber('bet');
		bet = (bet) ? bet : 20;
		let roll = Math.floor(Math.random() * 101);
		
		if(bet > checkPoints(interaction.user).user.points){
			interaction.reply(`Transaction failed. Insufficient funds.`);
			return;
		}

		if(roll == 100){
			paid = bet*critMultiplier;
			str = `won ${(bet*critMultiplier).toLocaleString("en-US")} points.`;
			consecutiveCount++;
			win = true;
		} else if (roll >= WIN_THREASHOLD){
			paid = bet;
			str = `won ${bet.toLocaleString("en-US")} points.`;
			consecutiveCount++;
			win = true;
		} else if (roll == 0){
			paid = -6000000000000;
			str = `lost it all!`;
			consecutiveCount = 0;
		}else{
			paid = -bet;
			str = `lost ${bet.toLocaleString("en-US")} points.`;
			consecutiveCount = 0;
		}

		if(consecutiveCount >= FIRE_THREASHOLD)
			paid = bet*FIRE_THREASHOLD;

		payout(interaction.user, paid);
		emoj = (roll >= WIN_THREASHOLD) ? '📈' : '📉';
		respStr = `You bet **${bet.toLocaleString("en-US")}** and rolled a ${roll} ${emoj}.\n You ${str}`;
		console.log(`${interaction.user.username} rolled a ${roll} and ${str}`);


		let message = await interaction.reply({ content: respStr, fetchReply: true });
		if(win) message.react(`💵`)
		if (consecutiveCount >= 3)
			if(MODE != "DEV")
				message.react(`${takemymoney}`)
			else
				message.react(`🔥`)
	},
};
