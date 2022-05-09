
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
    csv.push({ id: user.id,  username: user.username, place: csv.length+1, points: BASE_POINTS, gambles: 0, dubs: 0, trips: 0, quads: 0, quints: 0 })
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
        [ item.id,  item.username, ++index,  item.points, item.gambles, item.dubs, item.trips, item.quads, item.quints])
    ].map(e => e.join(",")).join("\n");
        
    fs.writeFileSync(ledger_path, csvString, (err) => { if (err) console.log(err); });
}

module.exports = {
    gift,
    payout,
    checkPoints
}