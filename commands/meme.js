const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const imgDirectories = fs.readdirSync('./img').filter(file => { return fs.statSync('./img'+'/'+file).isDirectory() && file.endsWith('-memes')});
const num2emoji = require('number-to-emoji');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('🐸')
		.addBooleanOption(opt =>
			opt.setName('showme')
			.setRequired(false)
			.setDescription('👌')),
	async execute(interaction) {
		let viewing = interaction.options.getBoolean('showme');
		str = 'Choose a meme category'
		if (viewing){
				imgDirectories.forEach( (dir, i) =>{
					const memes = fs.readdirSync(`./img/${dir}`);
					str += `\n ${num2emoji.toEmoji(i)}\t${dir.split('-')[0]} (${memes.length})`;
				});
				
				let choices = []
				let message = interaction.reply({ content: str, fetchReply: true });
					Promise.resolve(message).then(m =>{
						for(i=0;i<imgDirectories.length;i++){
							choices.push(num2emoji.toEmoji(i))
							try{
								m.react(num2emoji.toEmoji(i))
							}catch(e){ console.log(e) }
						}

					const collection = m.createReactionCollector({
						filter: reaction => { return choices.includes(reaction.emoji.name) },
						time: 5*60*1000
					});
					collection.on('collect', (reaction, user) => {
						if(!user.bot && user.username == interaction.user.username)
							if (choices.includes(reaction.emoji.name)) {
								const memes = fs.readdirSync(`./img/${imgDirectories[num2emoji.fromEmoji(reaction.emoji.name)]}`);
								let ranMemeIndex = Math.floor((Math.random() * memes.length));
								let file = new MessageAttachment(`./img/${imgDirectories[num2emoji.fromEmoji(reaction.emoji.name)]}/${memes[ranMemeIndex]}`);

								interaction.channel.send({
									content: `${imgDirectories[num2emoji.fromEmoji(reaction.emoji.name)]}: ${ranMemeIndex} / ${memes.length}`,
									files: [file]
								});
								m.delete()
							}
					});
				});	
		} else{
			let ranDirIndex = Math.floor((Math.random() * imgDirectories.length));
			const memes = fs.readdirSync(`./img/${imgDirectories[ranDirIndex]}`);
			console.log(`${memes.length} memes found in ${imgDirectories[ranDirIndex]}.`);
			let ranMemeIndex = Math.floor((Math.random() * memes.length));
			console.log(memes[ranMemeIndex]);
			
	
			let file = new MessageAttachment(`./img/${imgDirectories[ranDirIndex]}/${memes[ranMemeIndex]}`);
			interaction.reply({ content: `${imgDirectories[ranDirIndex]}: ${ranMemeIndex} / ${memes.length}`, files: [file] });
		}
	},
};
