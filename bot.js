const fs = require('node:fs');
const { Client, Intents, Collection } = require('discord.js');
const {token} = require('./config/bot.json');

const myIntents = new Intents();

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
		// Intents.FLAGS.GUILD_MEMBER
		// Intents.FLAGS.DIRECT_MESSAGES
	]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
    console.log(`Loaded command: /${command.data.name}`);
}


const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once)
		client.once(event.name, (...args) => event.execute(...args));
	else
		client.on(event.name, (...args) => event.execute(...args));
}


client.login(token);