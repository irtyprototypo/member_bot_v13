const {bot3} = require('../config/users.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
let bac = '';
let start = new Date();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('drink')
		.setDescription('🍺'),
	async execute(interaction) {

		// interaction.reply(`🍺`)
			// .then( _=> {
			// 	let now = new Date();
			// 	bac += '🍺🍺';
			// 	interaction.client.user.setActivity(bac)
			// 	console.log('drank');
			// })
			// .then(_=>{
			// 	setTimeout(() => {
			// 		if(bac[0]){
			// 			bac = bac.slice(1)
			// 			console.log('sober');
			// 			interaction.client.user.setActivity(bac);
		
			// 		}
			// 	}, (6000));
			// })
			// .then(_=>{
				bac += '🍺';
				interaction.client.user.setActivity(bac)
				// console.log(bac);
				// setTimeout(() => {
				// 	bac = bac.slice(1)
				// 	interaction.client.user.setActivity(bac)
					console.log(bac.split(''));
				// }, (6000));
			// })
			// .catch(console.error);



	},
};