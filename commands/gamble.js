const { SlashCommandBuilder } = require('@discordjs/builders');
const { WIN_THREASHOLD } = require('../config/gamba.json');
const { payout } = require('../util.js');
let critMultiplier = 3;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('gamble')
		.setDescription(`💰💸💸: 🎲 > ${WIN_THREASHOLD}`)
		.addNumberOption(opt =>
			opt.setName('bet')
			.setDescription('my pleasure')),
	async execute(interaction) {
		let win = false;
		let bet = interaction.options.getNumber('bet');
		bet = (bet) ? bet : 20;
		let roll = Math.floor(Math.random() * 100);

		if(roll == 100){
			paid = payout(interaction.user, bet*critMultiplier);
			str = `won ${bet*critMultiplier} points.`
			win = true;
		} else if (roll >= WIN_THREASHOLD){
			paid = payout(interaction.user, bet);
			str = `won ${bet} points.`
			win = true;
		} else if (roll == 0){
			paid = payout(interaction.user, -6000000000000);
			str = `lost it all!`;
		}else{
			paid = payout(interaction.user, -bet);
			str = `lost ${bet} points.`
		}

		if(paid.str.includes('Transaction failed')){
			respStr = `${paid.str}`;
			win = false;
		} else{
			respStr = `You bet ${bet} and rolled a ${roll}.\n You ${paid.str}`;
			console.log(`${interaction.user.username} rolled a ${roll} and ${str}`);
		}


		let message = await interaction.reply({ content: respStr, fetchReply: true });
		if(win) message.react(`💵`)


	},
};
