const {tyBot, bot3} = require('../config/users.json');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		let str = (client.user.id == tyBot) ? '🍻🍻🍻' : '🍇🌲';

		console.log(`Ready! Logged in as 🌲 ${client.user.tag} 🍻`);
        client.user.setActivity(str);

	},
};