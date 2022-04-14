// const {sandW} = require('../config/emoji.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const fs = require('node:fs');


const stoneColdGIFs = fs.readdirSync('./img/stonecold');
const thinkGIFs = fs.readdirSync('./img/think');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('guess')
		.addStringOption(opt =>
			opt.setName('who')
			.setDescription('🍻🍻🦵🤔')),
	async execute(interaction) {
		let who = interaction.options.getString('who');

		switch(who){
			case 'think':
				who = 'think'
				imagePool = thinkGIFs;
				break;
			default:
				who = 'stonecold'
				imagePool = stoneColdGIFs;
				break;
		}


		let randImgIndex = Math.floor((Math.random() * imagePool.length) + 1);
		var file = new MessageAttachment(`./img/${who}/${imagePool[randImgIndex]}`);
		interaction.reply({ files: [file] });
	},
};