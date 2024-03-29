const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { botId, guildId, token, guildId_alt} = require('./config/bot.json');

const commands = [];
// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// const commandFiles =[];

// for (const file of commandFiles) {
// 	const command = require(`./commands/${file}`);
// 	commands.push(command.data.toJSON());
// }

// commands.push(require(`./commands/trivs`).data.toJSON());
commands.push(require(`./commands/meme`).data.toJSON());




const rest = new REST({ version: '9' }).setToken(token);
rest.put(Routes.applicationGuildCommands(botId, guildId_alt), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

