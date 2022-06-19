const { channel_bot_spam, channel_bot_spam_alt } = require('../config/channels.json');
const { GURUBASHI_WINNINGS, BASE_POINTS, TRIVIA_EASY_WINNINGS, TRIVIA_MEDIUM_WINNINGS, TRIVIA_HARD_WINNINGS, TRIVIA_DURATION } = require('../config/gamba.json');
const { MODE, guildId, guildId_alt } = require('../config/bot.json');
const CHANNEL_YELL = (MODE == 'DEV') ? channel_bot_spam_alt : channel_bot_spam;
const GUILD = (MODE == 'DEV') ? guildId_alt : guildId;
const { payout, updateTimer, shuffle, escapeHtml } = require('../util.js');
const cron = require('node-cron');
const fs = require('fs');
const { MessageAttachment } = require('discord.js');
const imgDirectories = fs.readdirSync('./img').filter(file => { return fs.statSync('./img' + '/' + file).isDirectory() && file.endsWith('-memes') });
const Trivia = require('trivia-api');
const triv = new Trivia({ encoding: 'url3986' });
const MULTI_CHOICES = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫'];
const BOOL_CHOICES = ['🇹', '🇫'];

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		let str = (MODE == 'DEV') ? '🌲🌲' : '🍺🍺';
		let guruInterval = 1;
		let triviaInterval = 3;
		let memeInterval = 2;
		let minute = Math.floor(Math.random() * 59);

		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity(str);

		// console.log(`Gurubashi is up. ${GURUBASHI_WINNINGS}/${guruInterval}h`);
		// cron.schedule(`0 */${guruInterval} * * *`, _=>{ gurubashiPoints(client); });
		// cron.schedule('*/3 * * * * *', _=>{ gurubashiPoints(client); });

		console.log(`Trivia question ${minute} minutes past every ${triviaInterval} hours.`);
		cron.schedule(`${minute} */${triviaInterval} * * *`, _ => { triviaPost(client) });


		console.log(`Meme posted ${minute} minutes past every ${memeInterval} hours.`);
		cron.schedule(`${minute} */${memeInterval} * * *`, _ => { memPost(client) });
	},
};

// broken because of cron cache?
function gurubashiPoints(client) {
	// console.log('a');
	client.guilds.cache.forEach(g => {
		if (g.id == GUILD)		// only look in relevant server
			g.voiceStates.cache.forEach(vs => {
				if (vs.channel && vs.channel.id != vs.channel.guild.afkChannelId) {
					time = new Date();
					str = `${time.getHours()}:${time.getMinutes()}0 | ${vs.member.displayName} is in 🔊 ${vs.channel.name} and won ${BASE_POINTS} 💵.`;
					client.channels.cache.get(CHANNEL_YELL).send(str);
					console.log(str);
					paid = payout(vs.member.user, GURUBASHI_WINNINGS)
				}
			});
	});
}

function memPost(client) {

	let mehOffset = 2;
	let ranDirIndex = Math.floor((Math.random() * imgDirectories.length) + mehOffset);
	const memes = fs.readdirSync(`./img/${imgDirectories[ranDirIndex]}`);
	// console.log(`${memes.length} memes found in ${imgDirectories[ranDirIndex]}.`);
	let ranMemeIndex = Math.floor((Math.random() * memes.length));
	console.log(ranMemeIndex);

	let file = new MessageAttachment(`./img/${imgDirectories[ranDirIndex]}/${memes[ranMemeIndex]}`);
	client.channels.cache.get(CHANNEL_YELL).send({ content: `${imgDirectories[ranDirIndex]}: ${ranMemeIndex} / ${memes.length}`, files: [file] });
}


async function triviaPost(client) {
	difs = ['easy', 'medium', 'hard'];
	difColors = ['#fffeb3', '#6fcb9f', '#fb2e01'];
	type = ['boolean', 'multiple'];
	possiblePrizes = [TRIVIA_EASY_WINNINGS, TRIVIA_MEDIUM_WINNINGS, TRIVIA_HARD_WINNINGS];

	categories = await triv.getCategories().then(r => { return r.trivia_categories; });
	difficultyLevel = Math.floor(Math.random() * difs.length);
	let questionOptions = {
		category: categories[Math.floor(Math.random() * categories.length)].id,	// general knowledge
		type: type[Math.floor(Math.random() * type.length)],
		difficulty: difs[difficultyLevel],
	};
	prize = parseInt(possiblePrizes[difficultyLevel]) * parseInt((type.indexOf(questionOptions.type)) + 1);

	embededResponse = {
		title: ` ⭐ Trivia Time! 🍄`,
		description: `Select the correct answer! ${TRIVIA_DURATION} seconds remaining`,
		fields: []
	};
	embededResponse.fields.push({ name: `Question type`, value: `${questionOptions.type}`, inline: true })
	embededResponse.fields.push({ name: `Difficulty`, value: `${questionOptions.difficulty}`, inline: true })
	embededResponse.fields.push({ name: `Category`, value: `${categories.find(c => { return c.id === questionOptions.category; }).name}`, inline: true })
	embededResponse.color = difColors[difficultyLevel];

	await triv.getQuestions(questionOptions)
		.then(r => {
			if(!r.results[0]){
				console.log('API error?');
				return;
			}
			console.log(r.results[0]);
			client.channels.cache.get(CHANNEL_YELL).send('@here')
			client.channels.cache.get(CHANNEL_YELL).send({ embeds: [embededResponse], fetchReply: true })
				.then(p => {

					winners = ['😴'];
					losers = [];
					answers = [];
					answer = '';
					answerId = '';
					embededResponse.fields.push({ name: `Question`, value: `${escapeHtml(r.results[0].question)}`, inline: false })

					answers = r.results[0].incorrect_answers;
					answer = r.results[0].correct_answer;
					answers.push(answer);
					answers = shuffle(answers);
					answerId = answers.indexOf(answer);
					answer_choices = MULTI_CHOICES;
					answers.forEach((c, i) => { p.react(answer_choices[i]) })

					answers.forEach((a, i) => { answers[i] = answer_choices[i] + ' ' + a + '\n' })
					embededResponse.fields.push({ name: `Choices`, value: `${escapeHtml(answers.join(''))}`, inline: true })
					p.edit({ embeds: [embededResponse] });


					const collector = p.createReactionCollector({
						filter: reaction => { return MULTI_CHOICES.includes(reaction.emoji.name) || BOOL_CHOICES.includes(reaction.emoji.name) },
						time: (TRIVIA_DURATION * 1000) + 1
					});

					collector.on('end', collected => {

						collected.forEach(c => {
							if (c.count > 1) {
								users = c.users.cache.map(u => u)
									.filter(u => !u.bot);
								users.forEach(u => {
									if (c.emoji.name != answer_choices[answerId])
										losers.push(u.username);
								})
							}
						});

						collected.forEach(c => {
							if (c.count > 1) {
								users = c.users.cache.map(u => u)
									.filter(u => !u.bot);
								users.forEach(u => {
									if (!losers.includes(u.username) && c.emoji.name == answer_choices[answerId]) {
										winners.push(`${c.emoji.name} ${u.username}`);
										payout(u, prize);
									}
								})
							}
						});
						if (winners.length > 1)
							winners.shift();

						embededResponse.fields.push({ name: `Winners`, value: `${winners.toString().replaceAll(',', '\n')}`, inline: true })
						p.reactions.removeAll()
						console.log(`Trivia question expired.`)
						embededResponse.footer = { text: `Correct Answer:\t\t${answer_choices[answerId]}\t${escapeHtml(answer)}` };
						p.edit({ embeds: [embededResponse] });
					});

					updateTimer(p);
				})
		})
}

