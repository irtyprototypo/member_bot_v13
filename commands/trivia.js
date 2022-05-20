const { SlashCommandBuilder } = require('@discordjs/builders');
const { TRIVIA_EASY_WINNINGS , TRIVIA_MEDIUM_WINNINGS , TRIVIA_HARD_WINNINGS } = require('../config/gamba.json');
const { channel_bot_spam, channel_bot_spam_alt } = require('../config/channels.json');
const { MODE, guildId, guildId_alt } = require('../config/bot.json');
const CHANNEL_YELL = (MODE == 'DEV') ? channel_bot_spam_alt : channel_bot_spam;
const { payout } = require('../util.js');
const Trivia = require('trivia-api');
const triv = new Trivia({ encoding: 'url3986' });
const GO_EMOJI = (MODE == 'DEV') ? '🌲' : '🍻';
const DIFF_CHOICES = ['👶', '🧒', '👴', GO_EMOJI];
const TYPE_CHOICES = ['✅', '🙏', GO_EMOJI];
const PAGE_CHOICES = ['0️⃣', '1️⃣', '2️⃣', GO_EMOJI];
const MULTI_CHOICES = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫'];
const BOOL_CHOICES = ['🇹', '🇫'];
let catg_choices = []; 
const num2emoji = require('number-to-emoji');
let answer_choices = BOOL_CHOICES;
const TRIVIA_DURATION = 10;	// minutes



module.exports = {
	data: new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('🤓'),
	async execute(interaction) {

		// please select difficulty
		// please select question type
		// please selct category
		// display question
		// start timer
		// display vhoivces
		// capture response
		// determine results
		// say correct answer
		// payout
		// this is ass. plz dont look. ill refactor it later

		phase = 'difficulty';
		qty = 1;
		dif = ['easy', 'medium', 'hard'];
		cat = 'General Knowledge';
		type = ['boolean', 'multiple'];
		page = 0;
		answers = [];
		answer = '';
		answerId = '';
		winners = [];
		counts = [];
		prize = 0;
		possiblePrizes = [TRIVIA_EASY_WINNINGS, TRIVIA_MEDIUM_WINNINGS, TRIVIA_HARD_WINNINGS];
		cats = await triv.getCategories().then( r => { return r.trivia_categories; });
		let questionOptions = {
			category: cat,
			type: type[1],
			difficulty: dif[0],
			amount: qty
		};
		
		embededResponse = {
			title: ` ⭐ Trivia Time! 🍄`,
			description: `(press ${GO_EMOJI} to submit votes)`,
			fields: [
				{
					name: `Select a ${phase}!`,
					value: `Easy | Medium | Hard`,
					inline: true
				}
			]
		};

		let post;
		try{
			post = interaction.reply({ embeds: [embededResponse], fetchReply: true })
		}catch(e){
			post = interaction.channels.cache.get(CHANNEL_YELL).send(`@here`); 
			post = interaction.channels.cache.get(CHANNEL_YELL).send({ embeds: [embededResponse], fetchReply: true }); 
		}
	
		Promise.resolve(post)
			.then(p =>{
				DIFF_CHOICES.forEach( c =>{ p.react(c) })
				const collection = p.createReactionCollector({
					filter: reaction => { return DIFF_CHOICES.includes(reaction.emoji.name)
												|| TYPE_CHOICES.includes(reaction.emoji.name)
												|| PAGE_CHOICES.includes(reaction.emoji.name)
												|| MULTI_CHOICES.includes(reaction.emoji.name)
												|| BOOL_CHOICES.includes(reaction.emoji.name)
												|| catg_choices.includes(reaction.emoji.name) },
					time: TRIVIA_DURATION*60*1000
				});
				collection.on('collect', (reaction, user) => {
					if(!user.bot && reaction.emoji.name == GO_EMOJI){
						switch(phase){
							case 'difficulty':
		
								choice = letsGoBrandon(collection);
								questionOptions.difficulty = dif[DIFF_CHOICES.indexOf(choice)];
								prize = possiblePrizes[DIFF_CHOICES.indexOf(choice)];
								if(choice.includes(GO_EMOJI))
									break;
								p.reactions.removeAll()
								embededResponse.fields.pop();
								embededResponse.fields.push({ name: `Difficulty [${user.username.split(' ')[0]}]`, value: `${dif[DIFF_CHOICES.indexOf(choice)]}`, inline: true })
								embededResponse.fields.push({ name: `Select a question type!`, value: `True/False | Multiple Choice`, inline: false })
		
								phase = `qusetion type`;
								p.edit({embeds: [embededResponse]});
								TYPE_CHOICES.forEach( c =>{ p.react(c) })
								break;
		
							case 'qusetion type':
		
								choice = letsGoBrandon(collection);
								questionOptions.type = type[TYPE_CHOICES.indexOf(choice)];
		
								if(choice.includes(GO_EMOJI))
									break;
								p.reactions.removeAll()
								embededResponse.fields.pop();
								embededResponse.fields.push({ name: `Question type [${user.username.split(' ')[0]}]`, value: `${type[TYPE_CHOICES.indexOf(choice)]}`, inline: true })
								PAGE_CHOICES.forEach( c =>{ p.react(c) })
		
								phase = `category`;
								str = '';
								cats.forEach( c =>{ str+= `\n${c.id}\t${c.name}` })
								embededResponse.fields.push({ name: `Select a category page!`, value: `${str}`, inline: false })
								p.edit({embeds: [embededResponse]});
								break;
		
							case 'category':
		
								choice = letsGoBrandon(collection);
								if(choice.includes(GO_EMOJI))
									break;
								p.reactions.removeAll()
								embededResponse.fields.pop();
								page = num2emoji.fromEmoji(choice);
		
								phase = `question`;
								str = '';
								catg_choices = [];
		
								cats.forEach( c =>{
									if(!(c.id >= (page*10) && c.id < (page*10)+10))
										return;
									str+= `\n${c.id}\t${c.name}`
									id = c.id%10
									catg_choices.push(num2emoji.toEmoji(id));
									page = (page == 0) ? 3 : page;
								})
								catg_choices.push(GO_EMOJI);
								embededResponse.fields.push({ name: `Select a category!`, value: `${str}`, inline: false })
								catg_choices.forEach( c =>{ p.react(c) })
								p.edit({embeds: [embededResponse]});
								break;
		
							case 'question':
		
								choice = letsGoBrandon(collection);
								if(choice.includes(GO_EMOJI))
									break;
								p.reactions.removeAll()
								embededResponse.fields.pop();
								catID = parseInt(num2emoji.fromEmoji(choice))+page*10;
								if (catID == 39) catID = 9;
								selection = cats.find( c =>{ return c.id === catID; });
								// console.log(selection);
								questionOptions.category = selection.id;
		
								phase = `answer`;
								embededResponse.fields.push({ name: `Category [${user.username.split(' ')[0]}]`, value: `${selection.name}`, inline: true })
								
								// console.log(questionOptions);
								triv.getQuestions(questionOptions)
									.then(r => {
										embededResponse.fields.push({ name: `Question [${user.username.split(' ')[0]}]`, value: `${format(r.results[0].question)}`, inline: false })
		
										console.log(r.results[0]);
										answers = r.results[0].incorrect_answers;
										answer = r.results[0].correct_answer;
										answers.push(answer);
										answers = shuffle(answers);
										answerId = answers.indexOf(answer);
										// answer_choices = (r.results[0].type.includes('boolean')) ? BOOL_CHOICES : MULTI_CHOICES;
										// shuffle bug
										answer_choices = MULTI_CHOICES;
										answers.forEach( (c, i) =>{ p.react(answer_choices[i]) })
										
										p.react(GO_EMOJI)
										answers.forEach((a, i) =>{ answers[i] = answer_choices[i] + ' ' + a })
										embededResponse.fields.push({ name: `Choices`, value: `${format(answers.toString()).replaceAll(',', '\n')}`, inline: true })
										p.edit({embeds: [embededResponse]});
		
		
									}).catch(console.error);
								break;
		
							case 'answer':
		
								choice = letsGoBrandon(collection);
								if(choice.includes(GO_EMOJI))
									break;
		
		
								res = [];
								res2 = '';
								userReactList = [];
								collection.collected.forEach(c =>{
									count = c.count;
									if(!c.emoji.name.includes(GO_EMOJI)){
										// res += `\n${c.emoji.name} ${count-1} votes`;
										res.push(`${c.emoji.name} ${count-1} votes`);
										counts.push(count-1);
									}
									
									whoReacted = c.users.fetch();
									Promise.resolve(whoReacted).then(reactions =>{
		
										// console.log(u);
										reactions.forEach( u =>{
											if(userReactList.includes(u.username))
												return;
											if(!u.bot && c.emoji.name != GO_EMOJI)
												userReactList.push(u.username);
											if(!u.bot && c.emoji.name == answer_choices[answerId])
												winners.push(u)
										})
										if(c.emoji.name != GO_EMOJI && count > 0)
											res2 += `\n${c.emoji.name} ${count-1} votes (${userReactList.toString()})`;
									});
		
		
								});
		
		
								p.reactions.removeAll()
								embededResponse.fields.push({ name: `Results [${user.username.split(' ')[0]}]`, value: `${res.toString().replaceAll(',','\n')}`, inline: true })
								embededResponse.footer = { text: `Correct Answer:\t\t${answer_choices[answerId]}\t${format(answer)}` };
								p.edit({embeds: [embededResponse]});
		
								setTimeout(() => {		// lol shut up
									if (winners.length > 0){
										embededResponse.fields.push({ name: `Winner (${prize} points)`, value: `${winners.toString()}`, inline: false })
										embededResponse.color = '#57F287';
									}
									p.edit({embeds: [embededResponse]});
									
									winners.forEach(w =>{ payout(w, parseInt(prize)) })
		
								}, 1000);
								break;
							default:
								break;
						}
		
		
					}
				});
		
				collection.on('end', collected => {
					p.reactions.removeAll()
					console.log(`ended`)
				});
		
			})
	},
};


function letsGoBrandon(collection){
let max = 0;
let winner = GO_EMOJI;
collection.collected.forEach(c =>{
	count = c.count;
	if (!c.emoji.name.includes(GO_EMOJI) && max < --count){
		winner = c.emoji.name;
		max = --count;
	}
});
// if(!winner.includes(GO_EMOJI))
// 	console.log(`${phase}: ${winner}`)
return winner;
}

function shuffle(array) {
let currentIndex = array.length,  randomIndex;

// While there remain elements to shuffle.
while (currentIndex != 0) {

  // Pick a remaining element.
  randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex--;

  // And swap it with the current element.
  [array[currentIndex], array[randomIndex]] = [
	array[randomIndex], array[currentIndex]];
}

return array;
}

function format(str){
str = str.replaceAll(/&quot;/g,`"`);
str = str.replaceAll(/&amp;/g,`&`);
str = str.replaceAll(/&#039;/g,`'`);

return str
}