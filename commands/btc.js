const { SlashCommandBuilder } = require('@discordjs/builders');
let fetch = require("node-fetch");
let api_url = "https://blockchain.info/ticker";
let currency = "USD";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('btc')
		.setDescription('📈'),
	async execute(interaction) {
			
		fetch(api_url)
		.then( (response) => {
			return response.json();
		})
		.then( (data) => {
			// console.log(data);

			let denomination = data[currency];
			let formattedResult = (denomination.buy).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

			// console.log("Current price per bitcoin: $" + formattedResult + " (" + currency + ").");
			interaction.reply("Current price per bitcoin: $" + formattedResult + " (" + currency + ").");
		})
		.catch( console.error );
	},
};