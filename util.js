
const ledger_path = './data/ledger.csv';
const fs = require('fs');
const { BASE_POINTS } = require('./config/gamba.json');
let newGambler = true;
const { load } = require('csv-load-sync');
const CSV_HEADERS = ['id', 'username', 'place', 'points', 'gambles', 'dubs', 'trips', 'quads', 'quints', ];

function checkPoints(user) {
    let csv = loadAndValidateCSV(ledger_path);
    let userIndex = 0;
    newGambler = true;
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
    return { 'csv': csv, 'str': str };
}


function loadAndValidateCSV(csv_path){
    let csv = [];
    try{
        csv = load(csv_path);
        csv = makeUnique(csv);
    } catch(e){
        fs.writeFileSync(csv_path, CSV_HEADERS.toString())
        csv = load(csv_path);
        csv = makeUnique(csv);
    }


    return csv;
}

function newLedgerEntry(csv, user){
    csv.push({ id: user.id,  username: user.username, place: 'free', points: BASE_POINTS, gambles: 0, dubs: 0, trips: 0, quads: 0, quints: 0 })
    newGambler = false;
    console.log(`${user.username} was added to the ledger with ${BASE_POINTS} points.`);

    return csv;
}

function payout(user, amount) {
    let csv = loadAndValidateCSV(ledger_path);
    let currentPoints = 0;
    let userIndex = 0;

    csv.forEach( (gambler, index) =>{
        if(gambler.id == user.id){
            userIndex = index;
            currentPoints = ((parseInt(gambler.points) + amount) < 0) ? 0 : parseInt(gambler.points) + amount;
            gambler.points = currentPoints;
            newGambler = false;
        }
    });

    if(newGambler)
        csv = newLedgerEntry(csv, user);

    if (Math.abs(amount) > currentPoints)
        return {'csv': csv, 'str': `Transaction failed. Insufficient funds.`};


    str = `${((amount > 0)  ? 'won' : 'lost' )} ${Math.abs(amount)} points and are now at ${currentPoints} points.`;
    console.log(`${user.username} has ${str}`);

    writeCSV(csv);
    return {'csv': csv, 'str': str };
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

function makeUnique(csv){
    const uniqueIds = [];
    const unique = csv.filter(element => {
      const isDuplicate = uniqueIds.includes(element.id);
    
      if (!isDuplicate) {
        uniqueIds.push(element.id);
    
        return true;
      }
    
      return false;
    });
    
    // console.log(unique);

    unique.sort((a,b) => b.points - a.points);
    return unique;
}


function writeCSV(csv){
    csv = makeUnique(csv);

    var fil = fs.readFileSync(ledger_path).toString().split("\n");
    if(fil[0] != CSV_HEADERS.toString())
        fs.writeFileSync(ledger_path, CSV_HEADERS.toString());


    let csvString = [
        CSV_HEADERS, ...csv.map((item, index) =>
        [ item.id,  item.username, ++index,  item.points, item.gambles, item.dubs, item.trips, item.quads, item.quints])
    ].map(e => e.join(",")).join("\n");
        
    fs.writeFile(ledger_path, csvString, (err) => { if (err) console.log(err); });
}

module.exports = {
    gift,
    payout,
    checkPoints
}