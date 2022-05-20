const { BASE_POINTS, DUBS_WINNINGS, TRIPS_WINNINGS, QUADS_WINNINGS, QUINTS_WINNINGS } = require('./config/gamba.json');
const ledger_path = './data/ledger.csv';
const fs = require('fs');
const { PogChamp, pog, gachiGasm, member, implying } = require('./config/emoji.json');
let newGambler = true;
const { load } = require('csv-load-sync');
const CSV_HEADERS = ['id', 'username', 'place', 'points'];
const { MODE, guildId, guildId_alt } = require('./config/bot.json');


function checkPoints(user) {
    let csv = loadAndValidateCSV(ledger_path);
    let userIndex = 0;
    newGambler = true;
    // console.log(csv);
    csv.forEach( (gambler, index) =>{
        if(gambler.id == user.id){
            userIndex = index;
            newGambler = false;
        }
    });

    if(newGambler)
        csv = newLedgerEntry(csv, user);
    
    writeCSV(csv);
    str = `#${csv[userIndex].place} with ${csv[userIndex].points} points.`;
    console.log(`${user.username} is ${str}`);
    return { 'csv': csv, 'str': str , 'user': csv[userIndex]};
}


function loadAndValidateCSV(csv_path){
    let fileHeader = fs.readFileSync(csv_path, 'UTF-8').split(/\r?\n/)[0];
    if(fileHeader != CSV_HEADERS.toString()){
        console.log('Writing Headers...');
        fs.writeFileSync(csv_path, CSV_HEADERS.toString())
    }
    csv = load(csv_path);
    csv = makeUniqueAndSort(csv);
    return csv;
}

function newLedgerEntry(csv, user){
    csv.push({ id: user.id,  username: user.username, place: csv.length+1, points: BASE_POINTS})
    newGambler = false;
    console.log(`${user.username} was added to the ledger with ${BASE_POINTS} points.`);

    return csv;
}

function payout(user, amount) {
    let csv = loadAndValidateCSV(ledger_path);
    let userIndex = 0;
    let prev = 0;

    csv.forEach( (gambler, index) =>{

        if(gambler.id == user.id){
            userIndex = index;
                prev = gambler.points;
                gambler.points = ((parseInt(gambler.points) + amount) < 0) ? 0 : parseInt(gambler.points) + amount;
                newGambler = false;
        }
    });

    if(newGambler)
        csv = newLedgerEntry(csv, user);
    
    str = `${((amount > 0)  ? 'won' : 'lost' )} ${Math.abs(amount)} points and are now at ${csv[userIndex].points} points.`;
    console.log(`${user.username} has ${str}`);

    writeCSV(csv);
    return {'csv': csv, 'str': str, 'user': csv[userIndex]};
}

function gift(gifter, recipient, amount){
    let csv = loadAndValidateCSV(ledger_path);
    // console.log(csv);

    let gifterPoints, gifterIndex, reciPoints, reciIndex;
    amount = Math.abs(amount);

    csv.forEach( (gambler, index) =>{
        if(gambler.id == gifter.id){
            gifterIndex = index;
            gifterPoints = gambler.points;
        }

        if(gambler.id == recipient.id){
            reciPoints = gambler.points;
            reciIndex = index;
        }
    });

        
    if(!csv[gifterIndex]){
        csv = newLedgerEntry(csv, gifter)
        gifterIndex = csv.length-1;
    }

    if(!csv[reciIndex]){
        csv = newLedgerEntry(csv, recipient)
        reciIndex = csv.length-1;
    }

    if(amount >  csv[gifterIndex].points)
        return {'csv': csv, 'str': `Gift failed. Insufficient funds.`};


    csv[gifterIndex].points = parseInt(csv[gifterIndex].points) -  parseInt(amount);
    csv[reciIndex].points = parseInt(csv[reciIndex].points) +  parseInt(amount);

    str = `${csv[gifterIndex].username} gifted ${amount} points to ${csv[reciIndex].username}.`;
    writeCSV(csv);
    return {'csv': csv, 'str': str};
}

function makeUniqueAndSort(csv){
    csv = csv.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i)
    csv.sort((a,b) => b.points - a.points);
    return csv;
}


function writeCSV(csv){
    csv = makeUniqueAndSort(csv);

    var fil = fs.readFileSync(ledger_path).toString().split("\n");
    if(fil[0] != CSV_HEADERS.toString())
        fs.writeFileSync(ledger_path, CSV_HEADERS.toString());


    let csvString = [
        CSV_HEADERS, ...csv.map((item, index) =>
        [ item.id,  item.username, ++index,  item.points])
    ].map(e => e.join(",")).join("\n");
        
    fs.writeFileSync(ledger_path, csvString, (err) => { if (err) console.log(err); });
}


function dubsCheck(messageId){

	let len = messageId.length;
	let ones = messageId.substr(len-1, 1);
	let tens = messageId.substr(len-2, 1);
	let thous = messageId.substr(len-3, 1);
	let tenThous = messageId.substr(len-4, 1);
	let hundThous = messageId.substr(len-5, 1);
	let mills = messageId.substr(len-6, 1);
	let n420 = messageId.substr(len-3);
	let n69 = messageId.substr(len-2, 2);

    if(ones == tens && tens == thous && thous == tenThous && tenThous == hundThous && hundThous == mills)
        return -666666
    else if(ones == tens && tens == thous && thous == tenThous && tenThous == hundThous)
        return QUINTS_WINNINGS
    else if(ones == tens && tens == thous && thous == tenThous)
        return QUADS_WINNINGS
    else if(n420 == `420`)
        return 420
    else if(n69 == `69`)
        return 69
    else if(ones == tens && tens == thous)
        return TRIPS_WINNINGS
    else if(ones == tens)
        return DUBS_WINNINGS
    else 
		return 0

	// console.log(`${message.author.username} rolled a ...${mills}${hundThous}${tenThous}${thous}${tens}${ones}`);
}

function reactIfDubs(winnings, response){
    let dubsEmoji = PogChamp;
    let tripsEmoji = pog;
    let quadsEmoji = gachiGasm;

    if(MODE == 'DEV'){
        dubsEmoji = '🙂';
        tripsEmoji = '😃';
        quadsEmoji = '😎';
    }


    if(winnings >= DUBS_WINNINGS)
        response.react(dubsEmoji);

    if(winnings >= TRIPS_WINNINGS)
        response.react(tripsEmoji);

    if(winnings >= QUADS_WINNINGS)
        response.react(quadsEmoji);

    if(winnings >= QUINTS_WINNINGS){
        response.react(`🙏`);
        response.react(`💣`);
    }
    if(winnings == -666666)
        response.react('🔫');

    if(winnings == 420)
        response.react('🌲');

    if(winnings == 69){
        response.react('🇳');
        response.react('🇮');
        response.react('🇨');
        response.react('🇪');
    }
}

module.exports = {
    gift,
    payout,
    checkPoints,
    dubsCheck,
    reactIfDubs
}