let team1 = '';
let team2 = '';
let tosswinner = '';
let tossdecision = '';
let totalovers = '';
let currentinnings=1;
let freehit=false;
let commentarylist=[];
let actionHistory = [];
let innings1 = {
    teambatting: '',
    runs: 0,
    wickets: 0,
    balls: 0,
    batters: [],
    bowlers: []
};
let innings2 = {
    teambatting: '',
    runs: 0,
    wickets: 0,
    balls: 0,
    batters: [],
    bowlers: []
};
function getcurrentpage(){
    let currentPage = window.location.pathname.split("/").pop();
    return currentPage;
}
function savetolocal() {
    localStorage.setItem('team1', team1);
    localStorage.setItem('team2', team2);
    localStorage.setItem('tosswinner', tosswinner);
    localStorage.setItem('tossdecision', tossdecision);
    localStorage.setItem('totalovers', totalovers);
    localStorage.setItem('currentinnings', currentinnings);
    updatecurrentplayerstats();
    localStorage.setItem('strikebatter', JSON.stringify(strikebatter));
    localStorage.setItem('nonstrikebatter', JSON.stringify(nonstrikebatter));
    localStorage.setItem('bowler', JSON.stringify((bowler)));
    localStorage.setItem('freehit', freehit);
    localStorage.setItem('actionHistory', JSON.stringify(actionHistory));

    localStorage.setItem('innings1', JSON.stringify(innings1));
    localStorage.setItem('innings2', JSON.stringify(innings2));
}
function getfromlocal() {
    team1 = localStorage.getItem('team1');
    team2 = localStorage.getItem('team2');
    tosswinner = localStorage.getItem('tosswinner');
    tossdecision = localStorage.getItem('tossdecision');
    totalovers = parseInt(localStorage.getItem('totalovers'));
    currentinnings = parseInt(localStorage.getItem('currentinnings'));
    freehit = localStorage.getItem('freehit') === 'true';
    const historyData = localStorage.getItem('actionHistory');
    if (historyData) {
        actionHistory = JSON.parse(historyData);
    } else {
        actionHistory = [];
    }
    innings1 = JSON.parse(localStorage.getItem('innings1'));
    innings2 = JSON.parse(localStorage.getItem('innings2'));
    if (innings1.batters && innings1.batters.length) {
        innings1.batters = innings1.batters.map(b => {
            let newBatter = new batters(b.name, b.runs, b.balls);
            newBatter.outby = b.outby || '';
            newBatter.fours = b.fours || 0;
            newBatter.sixes = b.sixes || 0;
            return newBatter;
        });
    }
    if (innings1.bowlers && innings1.bowlers.length) {
        innings1.bowlers = innings1.bowlers.map(b => {
            let newBowler = new bowlers(b.name, b.runs, b.wickets);
            newBowler.maidens = b.maidens || 0;
            newBowler.balls = b.balls || 0;
            return newBowler;
        });
    }
    if (innings2.batters && innings2.batters.length) {
        innings2.batters = innings2.batters.map(b => {
            let newBatter = new batters(b.name, b.runs, b.balls);
            newBatter.outby = b.outby || '';
            newBatter.fours = b.fours || 0;
            newBatter.sixes = b.sixes || 0;
            return newBatter;
        });
    }
    if (innings2.bowlers && innings2.bowlers.length) {
        innings2.bowlers = innings2.bowlers.map(b => {
            let newBowler = new bowlers(b.name, b.runs, b.wickets);
            newBowler.maidens = b.maidens || 0;
            newBowler.balls = b.balls || 0;
            return newBowler;
        });
    }
    let sbData = JSON.parse(localStorage.getItem("strikebatter"));
    let nsbData = JSON.parse(localStorage.getItem("nonstrikebatter"));
    let bData = JSON.parse(localStorage.getItem("bowler"));
    
    let currInnings = currentinnings === 1 ? innings1 : innings2;
    
    let foundSB = currInnings.batters.find(b => b.name === sbData.name);
    if (foundSB) {
        strikebatter = foundSB;
    } else {
        strikebatter = new batters(sbData.name, sbData.runs, sbData.balls);
        strikebatter.fours = sbData.fours || 0;
        strikebatter.sixes = sbData.sixes || 0;
    }
    let foundNSB = currInnings.batters.find(b => b.name === nsbData.name);
    if (foundNSB) {
        nonstrikebatter = foundNSB;
    } else {
        nonstrikebatter = new batters(nsbData.name, nsbData.runs, nsbData.balls);
        nonstrikebatter.fours = nsbData.fours || 0;
        nonstrikebatter.sixes = nsbData.sixes || 0;
    }
    let foundBowler = currInnings.bowlers.find(b => b.name === bData.name);
    if (foundBowler) {
        bowler = foundBowler;
    } else {
        bowler = new bowlers(bData.name, bData.runs, bData.wickets);
        bowler.balls = bData.balls || 0;
        bowler.maidens = bData.maidens || 0;
    }
}
const startMatchBtn=document.getElementById("startmatchbutton");
if (startMatchBtn)
{   
    startMatchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    team1 = document.getElementById("TEAM1").value;
    team2 = document.getElementById("TEAM2").value;
    tosswinner = document.getElementById("teamSelect").value;
    tossdecision = document.getElementById("teamdecision").value;
    if (tosswinner === 'team1') {
        if (tossdecision === 'bat') {
            innings1.teambatting = team1;
            innings2.teambatting = team2;
        } else {
            innings1.teambatting = team2;
            innings2.teambatting = team1;
        }
    } else {
        if (tossdecision === 'bat') {
            innings1.teambatting = team2;
            innings2.teambatting = team1;
        } else {
            innings1.teambatting = team1;
            innings2.teambatting = team2;
        }
    }
    totalovers = Number(prompt("Enter the number of overs for each innings:")) || 2;
    takeInitialBatters();
    savetolocal();
    window.location.href = 'live.html';
});
}
function takeInitialBatters() {
    strikebatter = new batters (prompt("Enter the name of the strike batter:"),0,0);
    nonstrikebatter = new batters (prompt("Enter the name of the non-strike batter:"),0,0);
    bowler = new bowlers (prompt("Enter the name of the bowler:"),0,0);
    let currenti= currentinnings === 1 ? innings1 : innings2;
    currenti.batters.push(strikebatter, nonstrikebatter);
    currenti.bowlers.push(bowler);
    if (currentinnings == 1) {
        addline(`First Innings Starts! ${team1} vs ${team2}`);
        addline(`${strikebatter.name} and ${nonstrikebatter.name} to open. ${bowler.name} to bowl the first over.`);
    }
    else if (currentinnings == 2) {
        addline(`Second Innings Starts! ${team2} vs ${team1}`);
        addline(`${strikebatter.name} and ${nonstrikebatter.name} to open. ${bowler.name} to bowl the first over.`);
    }
}
function displaylivescore() {
    let inningsExist = document.getElementById("innings");
    let scoreExist = document.getElementById("overallscore");

    if (!inningsExist || !scoreExist) return;

    let score = "";
    if (currentinnings == 1) {
        inningsExist.innerText = "First Innings";
        score = `${innings1.teambatting} ${innings1.runs}/${innings1.wickets} (${Math.floor(innings1.balls / 6)}.${innings1.balls % 6}) vs. ${innings2.teambatting}`;
        score+= `<br><small><i>Current Run Rate: ${((innings1.runs) / ((innings1.balls) / 6)).toFixed(2)}</i></small>`;
    } else {
        inningsExist.innerText = "Second Innings";
        score = `${innings2.teambatting} ${innings2.runs}/${innings2.wickets} (${Math.floor(innings2.balls / 6)}.${innings2.balls % 6}) vs. ${innings1.teambatting} ${innings1.runs}/${innings1.wickets} (${totalovers}.0)`;
        score+= `<br><small><i>Target: ${innings1.runs + 1}</i></small>`;
        score+= `<br><small><i>Required Run Rate: ${((innings1.runs + 1 - innings2.runs) / ((totalovers * 6 - innings2.balls) / 6)).toFixed(2)}</i></small>`;
        score+= `<br><small><i>Need ${innings1.runs + 1 - innings2.runs} runs in ${totalovers * 6 - innings2.balls} balls</i></small>`;
    }
    scoreExist.style.textAlign = "center";
    scoreExist.innerHTML = score;
    if (freehit) {
        let freehitIndicator = document.createElement('div');
        freehitIndicator.innerText = "FREE HIT";
        freehitIndicator.style.fontWeight = "bold";
        freehitIndicator.style.fontSize = "18px";
        freehitIndicator.style.color = "red";
        scoreExist.appendChild(freehitIndicator);
    }
}
document.addEventListener("DOMContentLoaded", function () {
if (getcurrentpage()==="live.html") {
getfromlocal();
loadcommentary();
displaylivescore();
displaybatters();
displaybowler();
manageRuns();
manageWickets();
document.getElementById("undo").addEventListener("click", function() {
    undoAction();
});
document.getElementById("wide").addEventListener("click", function () {
    saveActionState();
    let extraruns = Number(prompt("Enter the number of extra runs for wide ball:", "0"))||0;
    let runsforwide = 1 + extraruns; 
    if (currentinnings == 1) {
        innings1.runs += runsforwide;
    } else {
        innings2.runs += runsforwide;
    }
    bowler.runs += runsforwide;
    if (extraruns % 2 !== 0) {
        exchangestrike();
    }
    displaylivescore();
    displaybatters();
    displaybowler();
    savetolocal();
    checkchasecompletion();
    let inningsnow = (currentinnings === 1 ? innings1 : innings2);
    let tovers = `${Math.floor(inningsnow.balls/6)}.${inningsnow.balls%6}`;
    addline(`${tovers}: ${bowler.name} to ${strikebatter.name}, wide, ${runsforwide} runs`);
});
document.getElementById("byes").addEventListener("click", function () {
    saveActionState();
    let byeruns= Number(prompt("Enter the number of runs for bye ball:", "0"))||0;
    if (currentinnings == 1) {
        innings1.runs += byeruns;
        innings1.balls++;
    } else {
        innings2.runs += byeruns;
        innings2.balls++;
    }
    bowler.balls++;
    strikebatter.balls++;
    if (byeruns % 2 !== 0) {
        exchangestrike();
    }
    freehit = false;
    let inningsnow = (currentinnings === 1 ? innings1 : innings2);  
    let tovers = `${Math.floor(inningsnow.balls/6)}.${inningsnow.balls%6}`;
    addline(`${tovers}: ${bowler.name} to ${strikebatter.name}, byes, ${byeruns} runs`);
    if (bowler.balls%6 == 0) {
        overCompleted();
    }
    displaylivescore();
    displaybatters();
    displaybowler();
    savetolocal();
    checkchasecompletion();
});
document.getElementById("noball").addEventListener("click", function () {
    saveActionState();
    freehit = true;
    let extraruns = Number(prompt("Enter the number of extra runs for no ball:", "0"))||0;
    let noballruns = 1 + extraruns;
    if (currentinnings == 1) {
        innings1.runs += noballruns;
    } else {
        innings2.runs += noballruns;
    }
    bowler.runs += noballruns;
    strikebatter.runs += extraruns;
    strikebatter.balls++;
    if(extraruns % 2 !== 0) {
        exchangestrike();
    }
    displaylivescore();
    displaybatters();
    displaybowler();
    savetolocal();
    let inningsnow = (currentinnings === 1 ? innings1 : innings2);
    let tovers = `${Math.floor(inningsnow.balls/6)}.${inningsnow.balls%6}`;
    addline(`${tovers}: ${bowler.name} to ${strikebatter.name}, no ball, ${noballruns} runs`);
    checkchasecompletion();
});
document.getElementById("runout").addEventListener("click", function () {
    saveActionState();
    let runoutruns = Number(prompt("Enter the number of runs scored before run out:", "0"))||0;
    let batterscrossed = confirm("Did the batters cross before the run out? Press OK for Yes, Cancel for No.");
    let runnoutend= confirm("Did the runout take place at the keeper's end? Press OK for Yes, Cancel for No.");
    if (currentinnings == 1) {
        innings1.balls++;
        innings1.runs += runoutruns;
    } else {
        innings2.balls++;
        innings2.runs += runoutruns;
    }
    bowler.balls++;
    strikebatter.balls++;
    strikebatter.runs += runoutruns;
    bowler.runs += runoutruns;
    if (currentinnings == 1) {
        innings1.wickets++;
    } else {
        innings2.wickets++;
    }
if (runnoutend) {
    let inningsnow = (currentinnings === 1 ? innings1 : innings2);
    let tovers = `${Math.floor(inningsnow.balls/6)}.${inningsnow.balls%6}`;
    addline(`${tovers}: ${bowler.name} to ${strikebatter.name}, run out at the striker's end, ${runoutruns} runs`);
    if(batterscrossed) {
        if (runoutruns % 2 == 0) {
            exchangestrike();
            strikebatter.outby = 'run out';
            updatecurrentplayerstats();
            strikebatter = new batters(prompt("Enter the name of the new batter: "), 0, 0);
            let cinnings = currentinnings === 1 ? innings1 : innings2;
            cinnings.batters.push(strikebatter);
        }
        else {
            strikebatter.outby = 'run out';
            updatecurrentplayerstats();
            strikebatter = new batters(prompt("Enter the name of the new batter: "), 0, 0);
            let cinnings = currentinnings === 1 ? innings1 : innings2;
            cinnings.batters.push(strikebatter);
        }
    }
    if(!batterscrossed) {
        if(runoutruns % 2 !== 0) {
            exchangestrike();
            strikebatter.outby = 'run out';
            updatecurrentplayerstats();
            strikebatter = new batters(prompt("Enter the name of the new batter: "), 0, 0);
            let cinnings = currentinnings === 1 ? innings1 : innings2;
            cinnings.batters.push(strikebatter);
        }
        else {
            strikebatter.outby = 'run out';
            updatecurrentplayerstats();
            strikebatter = new batters(prompt("Enter the name of the new batter: "), 0, 0);
            let cinnings = currentinnings === 1 ? innings1 : innings2;
            cinnings.batters.push(strikebatter);
        }
    }
    addline(`New batter: ${strikebatter.name}`);
}
if (!runnoutend) {
    let inningsnow = (currentinnings === 1 ? innings1 : innings2);
    let tovers = `${Math.floor(inningsnow.balls/6)}.${inningsnow.balls%6}`;
    addline(`${tovers}: ${bowler.name} to ${strikebatter.name}, run out at the non-striker's end, ${runoutruns} runs`);
    if(batterscrossed) {
        if (runoutruns % 2 !== 0) {
            nonstrikebatter.outby = 'run out';
            updatecurrentplayerstats();
            nonstrikebatter = new batters(prompt("Enter the name of the new batter: "), 0, 0);
            let cinnings = currentinnings === 1 ? innings1 : innings2;
            cinnings.batters.push(nonstrikebatter);
        }
        else {
            exchangestrike();
            nonstrikebatter.outby = 'run out';
            updatecurrentplayerstats();
            nonstrikebatter = new batters(prompt("Enter the name of the new batter: "), 0, 0);
            let cinnings = currentinnings === 1 ? innings1 : innings2;
            cinnings.batters.push(nonstrikebatter);
        }
    }
    if(!batterscrossed) {
        if(runoutruns % 2 !== 0) {
            exchangestrike();
            nonstrikebatter.outby = 'run out';
            updatecurrentplayerstats();
            nonstrikebatter = new batters(prompt("Enter the name of the new batter: "), 0, 0);
            let cinnings = currentinnings === 1 ? innings1 : innings2;
            cinnings.batters.push(nonstrikebatter);
        }
        else {
            nonstrikebatter.outby = 'run out';
            updatecurrentplayerstats();
            nonstrikebatter = new batters(prompt("Enter the name of the new batter: "), 0, 0);
            let cinnings = currentinnings === 1 ? innings1 : innings2;
            cinnings.batters.push(nonstrikebatter);
        }
    }
    addline(`New batter: ${nonstrikebatter.name}`);
}
    freehit = false;
    if (bowler.balls%6 == 0) {
        overCompleted();
    }
    displaylivescore();
    displaybatters();
    displaybowler();
    savetolocal();
    checkchasecompletion();
});
document.getElementById("fullscorecard").addEventListener("click", function () {
    savetolocal();
    window.location.href = "scorecard.html";
});
document.getElementById("Livecommentary").addEventListener("click", function () {
    savetolocal();
    window.location.href = "livecom.html";
});
}
});
function manageRuns()
{   document.getElementById("dot").addEventListener("click", function () {
        saveActionState();
        if (currentinnings == 1) {
            innings1.balls++;
        } else {
            innings2.balls++;
        }
        displaylivescore();
        bowler.balls++;
        strikebatter.balls++;
        freehit = false;
        let inningsnow = (currentinnings === 1 ? innings1 : innings2);
        let tovers = `${Math.floor(inningsnow.balls/6)}.${inningsnow.balls%6}`;
        addline(`${tovers}: ${bowler.name} to ${strikebatter.name}, dot ball`);
        if (bowler.balls%6==0) {
            overCompleted();
        }
        displaybatters();
        displaybowler();
        savetolocal();
    });
    document.getElementById("one").addEventListener("click", function () {
        saveActionState();
        if (currentinnings == 1) {
            innings1.runs++;
            innings1.balls++;
        } else {
            innings2.runs++;
            innings2.balls++;
        }
        displaylivescore();
        bowler.balls++;
        strikebatter.balls++;
        strikebatter.runs++;
        bowler.runs++;
        freehit = false;
        if (bowler.balls%6 == 0) {
            overCompleted();
        }
        let inningsnow = (currentinnings === 1 ? innings1 : innings2);
        let tovers = `${Math.floor(inningsnow.balls/6)}.${inningsnow.balls%6}`;
        addline(`${tovers}: ${bowler.name} to ${strikebatter.name}, 1 run`);
        exchangestrike();
        displaybatters();
        displaybowler();
        checkchasecompletion();
        savetolocal();
    });
    document.getElementById("two").addEventListener("click", function () {
        saveActionState();
        if (currentinnings == 1) {
            innings1.runs += 2;
            innings1.balls++;
        } else {
            innings2.runs += 2;
            innings2.balls++;
        }
        displaylivescore();
        bowler.balls++;
        strikebatter.balls++;
        strikebatter.runs += 2;
        bowler.runs += 2;   
        freehit = false;
        let inningsnow = (currentinnings === 1 ? innings1 : innings2);
        let tovers = `${Math.floor(inningsnow.balls/6)}.${inningsnow.balls%6}`;
        addline(`${tovers}: ${bowler.name} to ${strikebatter.name}, 2 runs`);
        if (bowler.balls%6 == 0) {
            overCompleted();
        }
        displaybatters();
        displaybowler();
        checkchasecompletion();
        savetolocal();
    });
    document.getElementById("three").addEventListener("click", function () {
        saveActionState();
        if (currentinnings == 1) {
            innings1.runs += 3;
            innings1.balls++;
        } else {
            innings2.runs += 3;
            innings2.balls++;
        }
        displaylivescore();
        bowler.balls++;
        strikebatter.balls++;
        strikebatter.runs += 3;
        bowler.runs += 3;
        freehit = false;
        let inningsnow = (currentinnings === 1 ? innings1 : innings2);
        let tovers = `${Math.floor(inningsnow.balls/6)}.${inningsnow.balls%6}`;
        addline(`${tovers}: ${bowler.name} to ${strikebatter.name}, 3 runs`);
        if (bowler.balls%6 == 0) {
            overCompleted();
        }
        exchangestrike();
        displaybatters();
        displaybowler();
        checkchasecompletion();
        savetolocal();
    });
    document.getElementById("four").addEventListener("click", function () {
        saveActionState();
        if (currentinnings == 1) {
            innings1.runs += 4;
            innings1.balls++;
        } else {
            innings2.runs += 4;
            innings2.balls++;
        }
        displaylivescore();
        bowler.balls++;
        strikebatter.balls++;
        strikebatter.runs += 4;
        bowler.runs += 4;
        strikebatter.fours++;
        freehit = false;
        let inningsnow = (currentinnings === 1 ? innings1 : innings2);
        let tovers = `${Math.floor(inningsnow.balls/6)}.${inningsnow.balls%6}`;
        addline(`${tovers}: ${bowler.name} to ${strikebatter.name}, 4 runs`);
        if (bowler.balls%6 == 0) {
            overCompleted();
        }
        displaybatters();
        displaybowler();
        checkchasecompletion();
        savetolocal();
    });
    document.getElementById("six").addEventListener("click", function () {
        saveActionState();
        if (currentinnings == 1) {
            innings1.runs += 6;
            innings1.balls++;
        } else {
            innings2.runs += 6;
            innings2.balls++;
        }
        displaylivescore();
        bowler.balls++;
        strikebatter.balls++;
        strikebatter.runs += 6;
        bowler.runs += 6;
        strikebatter.sixes++;   
        freehit = false;
        let inningsnow = (currentinnings === 1 ? innings1 : innings2);
        let tovers = `${Math.floor(inningsnow.balls/6)}.${inningsnow.balls%6}`;
        addline(`${tovers}: ${bowler.name} to ${strikebatter.name}, 6 runs`);
        if (bowler.balls%6 == 0) {
            overCompleted();
        }
        displaybatters();
        displaybowler();
        checkchasecompletion();
        savetolocal();
    });
}
function manageWickets()
{
    document.getElementById("wicket").addEventListener("click", function () {
        saveActionState();
        if (freehit) {
            alert("No dismissal allowed on a free hit except run-out. Please use the runout button if applicable.");
            return;
        }
        if (currentinnings == 1) {
            innings1.wickets++;
            innings1.balls++;
            bowler.balls++;
            strikebatter.balls++;
            bowler.wickets++;
            strikebatter.outby = bowler.name;
            updatecurrentplayerstats();
            let tovers = `${Math.floor(innings1.balls/6)}.${innings1.balls%6}`;
            addline(`${tovers}: ${bowler.name} to ${strikebatter.name}, wicket!`);
            if (innings1.wickets >= 10) {
                checkallout();
            } else {
                strikebatter = new batters(prompt("Enter the name of the new batter:"), 0, 0);
                innings1.batters.push(strikebatter);
            }
            addline(`New batter: ${strikebatter.name}`);
            freehit = false;
            if (bowler.balls%6 == 0) {
                overCompleted();
            }
        } else {
            innings2.wickets++;
            innings2.balls++;
            bowler.balls++;
            strikebatter.balls++;
            bowler.wickets++;
            strikebatter.outby = bowler.name;
            updatecurrentplayerstats();
            let tovers = `${Math.floor(innings2.balls/6)}.${innings2.balls%6}`;
            addline(`${tovers}: ${bowler.name} to ${strikebatter.name}, wicket!`);
            if (innings2.wickets >= 10) {
                checkallout();
            } else{
                strikebatter = new batters(prompt("Enter the name of the new batter:"), 0, 0);
                innings2.batters.push(strikebatter);
            }
            addline(`New batter: ${strikebatter.name}`);
            freehit = false;
            if (bowler.balls%6 == 0) {
                overCompleted();
            }
        }
        checkallout();
        displaylivescore();
        displaybatters();
        displaybowler();
        savetolocal();
    });
}
function exchangestrike()
{
    let a = strikebatter;
    strikebatter = nonstrikebatter;
    nonstrikebatter = a;
}
function displaybatters()
{
    document.getElementById("strikename").innerText = strikebatter.name + "*";
    document.getElementById("strikeballs").innerText = strikebatter.balls;  
    document.getElementById("strikeruns").innerText = strikebatter.runs;
    document.getElementById("strikestrikerate").innerText = strikebatter.strikerate.toFixed(2);
    document.getElementById("nonstrikename").innerText = nonstrikebatter.name;
    document.getElementById("nonstrikeballs").innerText = nonstrikebatter.balls;    
    document.getElementById("nonstrikeruns").innerText = nonstrikebatter.runs;
    document.getElementById("nonstrikestrikerate").innerText = nonstrikebatter.strikerate.toFixed(2);    
    document.getElementById("strike4s").innerText = strikebatter.fours;
    document.getElementById("strike6s").innerText = strikebatter.sixes;  
    document.getElementById("nonstrike4s").innerText = nonstrikebatter.fours;
    document.getElementById("nonstrike6s").innerText = nonstrikebatter.sixes;
}
function displaybowler()
{
    document.getElementById("bowlername").innerText = bowler.name;
    document.getElementById("bowlerovers").innerText = bowler.overs.toFixed(1);  
    document.getElementById("bowlerrunsconceded").innerText = bowler.runs;
    document.getElementById("bowlerwickets").innerText = bowler.wickets;
    document.getElementById("bowlereconomyrate").innerText = bowler.economy.toFixed(2);
    document.getElementById("bowlermaidens").innerText = bowler.maidens;
}
class batters {
    constructor(name, runs, balls) {
        this.name = name;
        this.runs = runs;
        this.balls = balls;
        this.sixes=0;
        this.fours=0;
        this.outby='';
        }
        get strikerate() {
            return this.balls > 0 ? (this.runs / this.balls) * 100 : 0;
        }
    }
class bowlers {
        constructor(name, runs, wickets) {
            this.name = name;
            this.runs = runs;
            this.wickets = wickets;
            this.maidens = 0;
            this.balls=0;
        }
        get overs() {
            return Math.floor(this.balls / 6) + (this.balls % 6) / 10;
        }
        get economy() {
            return this.balls > 0 ? ((this.runs*6) / this.balls) : 0;
        }
    }
    function overCompleted() {
        if (bowler.runs == 0) {
            bowler.maidens++;
        }
        let currInnings = currentinnings === 1 ? innings1 : innings2;
        let bowlerIndex = currInnings.bowlers.findIndex(b => b.name === bowler.name);
        if (bowlerIndex !== -1) {
            currInnings.bowlers[bowlerIndex] = bowler;
    }    
        exchangestrike();
        displaylivescore();     
        displaybatters();
        displaybowler();     
        savetolocal();          
    
        let innings = currentinnings === 1 ? innings1 : innings2;
        if (innings.balls >= totalovers * 6) {
            if (currentinnings == 2) {
                displaylivescore();
                displaybatters();
                displaybowler();
                addline("Match ends! See summary for details.");
                localStorage.setItem('matchdata', JSON.stringify({ innings: [innings1, innings2] }));
                updateoverallstats();
                window.location.href = "summary.html";
            }
            if(currentinnings == 1) {
                setTimeout(() => {
                    alert("First innings complete!");
                    currentinnings++;
                    takeInitialBatters();
                    displaylivescore();
                    displaybatters();
                    displaybowler();
                    savetolocal();
                }, 100);
            }
        } else {
            setTimeout(() => {
                const prev = bowler.name;
                let name = prompt("Enter the name of the new bowler:");
                while (name === prev) {
                    alert("A bowler cannot bowl two consecutive overs. Please enter a different name.");
                    name = prompt("Enter the name of the new bowler:");
                }
                let bowlersArray = currentinnings === 1 ? innings1.bowlers : innings2.bowlers;
                let existingbowler = bowlersArray.find(b => b.name === name);
                if (existingbowler) {
                    bowler = existingbowler;
                } else {
                    bowler = new bowlers(name, 0, 0);
                    bowlersArray.push(bowler);
                }
                displaybowler();
                addline(`End of over, New bowler: ${bowler.name}`);
            }, 100);
        }
    }
function checkallout()
{
    let innings = currentinnings === 1 ? innings1 : innings2;
    if (innings.wickets >= 10) {
        if (currentinnings ==2) {
            displaylivescore();
            displaybatters();
            displaybowler();
            savetolocal();
            addline("All out! Match ends. See summary for details.");
            localStorage.setItem('matchdata', JSON.stringify({ innings: [innings1, innings2] }));
            updateoverallstats();
            window.location.href = "summary.html";
        }
        if (currentinnings == 1) {
            alert("All out! Innings complete.");
            currentinnings++;
            takeInitialBatters();
        }
        
        displaylivescore();
        displaybatters();
        savetolocal();
    }
}
function checkchasecompletion()
{
    if (currentinnings === 2) {
        let target = innings1.runs + 1;
        if (innings2.runs >= target) {
            displaylivescore();
            savetolocal();
            addline("Chase completed! Match ends. See summary for details.");
            localStorage.setItem('matchdata', JSON.stringify({ innings: [innings1, innings2] }));
            updateoverallstats();
            window.location.href = "summary.html";
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    if (getcurrentpage()==="scorecard.html") {
    getfromlocal();
    bat1=document.getElementById("battingscorecard1").querySelector("tbody");
    bowl1=document.getElementById("bowlingscorecard1").querySelector("tbody");
    bat2=document.getElementById("battingscorecard2").querySelector("tbody");
    bowl2=document.getElementById("bowlingscorecard2").querySelector("tbody");
    const instructionDiv = document.createElement('div');
    instructionDiv.innerHTML = '<p style="font-style: italic; text-align: center; margin-top: 10px;">Click on a player\'s name to see career stats</p>';
    document.querySelector('h1').after(instructionDiv);
    let innings1batters = innings1.batters.map(batter => {
        let outInfo = '';
        if (batter.outby && batter.outby !== '') {
            if (batter.outby === 'run out') {
                outInfo = '<div style="color:#ffcc00; font-style:italic">run out</div>';
            } else {
                outInfo = '<div style="color:#ffcc00; font-style:italic">b ' + batter.outby + '</div>';
            }
        } else if (!batter.outby) {
            outInfo = '<div style="color:#ffcc00; font-style:italic">not out</div>';
        }
        return `<tr>
            <td><span
            class="player-name"
            data-name="${batter.name}"
            data-type="batting">
            ${batter.name}</span>${batter.name === strikebatter.name && currentinnings === 1 ? '*' : ''}${outInfo}</td>
            <td>${batter.runs}</td>
            <td>${batter.balls}</td>
            <td>${batter.fours}</td>
            <td>${batter.sixes}</td>
            <td>${batter.strikerate.toFixed(2)}</td>
        </tr>`;
    }).join('');
    let innings2batters = innings2.batters.map(batter => {
        let outInfo = '';
        if (batter.outby && batter.outby !== '') {
            if (batter.outby === 'run out') {
                outInfo = '<div style="color:#ffcc00; font-style:italic">run out</div>';
            } else {
                outInfo = '<div style="color:#ffcc00; font-style:italic">b ' + batter.outby + '</div>';
            }
        } else if (!batter.outby) {
            outInfo = '<div style="color:#ffcc00; font-style:italic">not out</div>';
        }
        return `<tr>
            <td><span
            class="player-name"
            data-name="${batter.name}"
            data-type="batting">
            ${batter.name}</span>${batter.name === strikebatter.name && currentinnings === 2 ? '*' : ''}${outInfo}</td>
            <td>${batter.runs}</td>
            <td>${batter.balls}</td>
            <td>${batter.fours}</td>
            <td>${batter.sixes}</td>
            <td>${batter.strikerate.toFixed(2)}</td>
        </tr>`;
    }).join('');
    let innings1bowlers = innings1.bowlers.map(bowler => {
        let overs = Math.floor(bowler.balls / 6) + (bowler.balls % 6) / 10;
        return `<tr><td><span
            class="player-name"
            data-name="${bowler.name}"
            data-type="bowling">
           ${bowler.name}</span></td><td>${overs.toFixed(1)}</td><td>${bowler.maidens}</td><td>${bowler.runs}</td><td>${bowler.wickets}</td><td>${bowler.economy.toFixed(2)}</td></tr>`;
    }).join('');
    let innings2bowlers = innings2.bowlers.map(bowler => {
        let overs = Math.floor(bowler.balls / 6) + (bowler.balls % 6) / 10;
        return `<tr><td><span
            class="player-name"
            data-name="${bowler.name}"
            data-type="bowling">
           ${bowler.name}</span></td><td>${overs.toFixed(1)}</td><td>${bowler.maidens}</td><td>${bowler.runs}</td><td>${bowler.wickets}</td><td>${bowler.economy.toFixed(2)}</td></tr>`;
    }).join('');
    bat1.innerHTML = innings1batters;
    bowl1.innerHTML = innings1bowlers;
    bat2.innerHTML = innings2batters;
    bowl2.innerHTML = innings2bowlers;
    document.querySelectorAll('.player-name').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          showOverallStats(el.dataset.name, el.dataset.type);
        });
    });
    document.getElementById("goback1").addEventListener("click", function() {
        window.location.href = "live.html";
    });
    }
    });
    function updatecurrentplayerstats() {
        let currInnings = currentinnings === 1 ? innings1 : innings2;
        let sbIndex = currInnings.batters.findIndex(b => b.name === strikebatter.name);
        if (sbIndex !== -1) {
            currInnings.batters[sbIndex] = strikebatter;
        }
        let nsbIndex = currInnings.batters.findIndex(b => b.name === nonstrikebatter.name);
        if (nsbIndex !== -1) {
            currInnings.batters[nsbIndex] = nonstrikebatter;
        }
        let bowlerIndex = currInnings.bowlers.findIndex(b => b.name === bowler.name);
        if (bowlerIndex !== -1) {
            currInnings.bowlers[bowlerIndex] = bowler;
        }
    }
document.addEventListener("DOMContentLoaded", function () {
    if (getcurrentpage()==="summary.html"){
        getfromlocal();
        displayresult();
        document.getElementById("reset").addEventListener("click", function() {
            reset();
            window.location.href = "setup.html";
        });
    }
});
function displayresult() {
    let result = document.getElementById("result");
    let innings1Score = `${innings1.teambatting} ${innings1.runs}/${innings1.wickets} (${Math.floor(innings1.balls / 6)}.${innings1.balls % 6})`;
    let innings2Score = `${innings2.teambatting} ${innings2.runs}/${innings2.wickets} (${Math.floor(innings2.balls / 6)}.${innings2.balls % 6})`;
    document.getElementById("finalscore").innerText = innings1Score + " vs. " + innings2Score;
    if (innings1.runs < innings2.runs)
    {
        result.innerText = `${innings2.teambatting} won by ${10-innings2.wickets} wickets (${(totalovers*6)-innings2.balls} balls left)`;
    }
    else if (innings1.runs > innings2.runs) {
        result.innerText = `${innings1.teambatting} won by ${innings1.runs - innings2.runs} runs`;
    }
    else if (innings1.runs===innings2.runs) {
        result.innerText = `Match Drawn`;
    }
}
function reset() {
    localStorage.clear();
    window.location.href = "setup.html";
}
document.addEventListener("DOMContentLoaded", function () {
if (getcurrentpage()==="livecom.html") {
    loadcommentary();   
    p = document.getElementById("commentary");
    commentarylist.slice().reverse().forEach(line => p.innerText += line + "\n");
    document.getElementById("goback2").addEventListener("click", function() {
        window.location.href = "live.html";
    });
}
});
function loadcommentary() {
    commentarylist = JSON.parse(localStorage.getItem('commentarylist')) || [];
}
function savecommentary() {
    localStorage.setItem('commentarylist', JSON.stringify(commentarylist));
}
function addline(desc) {
    commentarylist.push(desc);
    savecommentary();
}
function updateoverallstats() {
    const matchdata = JSON.parse(localStorage.getItem('matchdata')) || {};
    const stats = JSON.parse(localStorage.getItem('overallstats')) || {};
    matchdata.innings.forEach(inning => {
        inning.batters.forEach(batter => {
            if (!stats[batter.name]) {
                stats[batter.name] = {};
            }
            if (!stats[batter.name].batting) {
                stats[batter.name].batting = {
                    runs: 0,
                    balls: 0,
                    outs: 0,
                    average: 0,
                    fours: 0,
                    sixes: 0,
                    strikeRate: 0
                };
            }
            stats[batter.name].batting.runs += batter.runs;
            stats[batter.name].batting.balls += batter.balls;
            if (batter.outby) {
                stats[batter.name].batting.outs++;
            }
            stats[batter.name].batting.fours += batter.fours;
            stats[batter.name].batting.sixes += batter.sixes;
            stats[batter.name].batting.average = (stats[batter.name].batting.runs / (stats[batter.name].batting.outs || 1)).toFixed(2);
            stats[batter.name].batting.strikeRate = ((stats[batter.name].batting.runs / stats[batter.name].batting.balls) * 100).toFixed(2);
        });
        inning.bowlers.forEach(bowler => {
            if (!stats[bowler.name]) {
                stats[bowler.name] = {};
            }
            if (!stats[bowler.name].bowling) {
                stats[bowler.name].bowling = {
                    overs: 0,
                    maidens: 0,
                    runsconceded: 0,
                    wickets: 0,
                    economy: 0
                };
            }
            const existingBalls = Math.floor(parseFloat(stats[bowler.name].bowling.overs)) * 6 + Math.round((parseFloat(stats[bowler.name].bowling.overs) % 1) * 10);
            const newBalls = bowler;
            const totalBalls = existingBalls + newBalls;
            stats[bowler.name].bowling.overs = Math.floor(totalBalls / 6) + (totalBalls % 6) / 10;
            stats[bowler.name].bowling.maidens += bowler.maidens;
            stats[bowler.name].bowling.runsconceded += bowler.runs;
            stats[bowler.name].bowling.wickets += bowler.wickets;
            stats[bowler.name].bowling.economy = ((stats[bowler.name].bowling.runsconceded * 6) / (totalBalls || 1)).toFixed(2);
        });
    });
    localStorage.setItem('overallstats', JSON.stringify(stats));
}
function showOverallStats(name, type) {
    const all = JSON.parse(localStorage.getItem('overallstats')) || {};
    const p   = all[name] && all[name][type];
    if (!p) {
      return alert(`No ${type} stats found for ${name}`);
    }
    if (type === 'batting') {
      alert(
        `${name} — Batting\n` +
        `Runs: ${p.runs}\n` +
        `Balls: ${p.balls}\n` +
        `Fours: ${p.fours}\n` +
        `Sixes: ${p.sixes}\n` +
        `Dismissals: ${p.outs}\n` +
        `Average: ${p.average}\n` +
        `Strike Rate: ${p.strikeRate}`
    );
    } else {
      const overs = Math.floor(p.overs) + "." + Math.round((p.overs % 1) * 10);
      alert(
        `${name} — Bowling\n` +
        `Overs: ${overs}\n` +
        `Maidens: ${p.maidens}\n` +
        `Runs: ${p.runsconceded}\n` +
        `Wickets: ${p.wickets}\n` +
        `Economy: ${p.economy}`
      );
    }
}
function reset() {
    localStorage.removeItem('team1');
    localStorage.removeItem('team2');
    localStorage.removeItem('tosswinner');
    localStorage.removeItem('tossdecision');
    localStorage.removeItem('totalovers');
    localStorage.removeItem('currentinnings');
    localStorage.removeItem('strikebatter');
    localStorage.removeItem('nonstrikebatter');
    localStorage.removeItem('bowler');
    localStorage.removeItem('freehit');
    localStorage.removeItem('innings1');
    localStorage.removeItem('innings2');
    localStorage.removeItem('matchdata');
    localStorage.removeItem('commentarylist');
    window.location.href = "setup.html";
}
document.addEventListener("DOMContentLoaded", function () {
    if (getcurrentpage()==="setup.html") {
        document.getElementById("resetStatsButton")?.addEventListener("click", function() {
            resetOverallStats();
        });
    }
});
function resetOverallStats() {
    if (confirm("Are you sure you want to reset all player statistics? This action cannot be undone.")) {
        localStorage.removeItem('overallstats');
        alert("All player statistics have been reset.");
    }
}
function saveActionState() {
    let state = {
        innings1: JSON.parse(JSON.stringify(innings1)),
        innings2: JSON.parse(JSON.stringify(innings2)),
        strikebatter: JSON.parse(JSON.stringify(strikebatter)),
        nonstrikebatter: JSON.parse(JSON.stringify(nonstrikebatter)),
        bowler: JSON.parse(JSON.stringify(bowler)),
        freehit: freehit,
        currentinnings: currentinnings,
        commentarylist: [...commentarylist]
    };
    actionHistory.push(state);
    if (actionHistory.length > 20) {
        actionHistory.shift();
    }
    localStorage.setItem('actionHistory', JSON.stringify(actionHistory));
}
function undoAction() {
    if (actionHistory.length === 0) {
        alert("Nothing to undo!");
        return;
    }
    let previousState = actionHistory.pop();
    innings1 = previousState.innings1;
    innings2 = previousState.innings2;
    strikebatter = recreateBatter(previousState.strikebatter);
    nonstrikebatter = recreateBatter(previousState.nonstrikebatter);
    bowler = recreateBowler(previousState.bowler);
    freehit = previousState.freehit;
    currentinnings = previousState.currentinnings;
    commentarylist = previousState.commentarylist;
    if (commentarylist.length > 0) {
        commentarylist.pop();
    }
    savetolocal();
    localStorage.setItem('actionHistory', JSON.stringify(actionHistory));
    displaylivescore();
    displaybatters();
    displaybowler();
    savecommentary();
}
function recreateBatter(data) {
    let newBatter = new batters(data.name, data.runs, data.balls);
    newBatter.fours = data.fours || 0;
    newBatter.sixes = data.sixes || 0;
    newBatter.outby = data.outby || '';
    return newBatter;
}
function recreateBowler(data) {
    let newBowler = new bowlers(data.name, data.runs, data.wickets);
    newBowler.maidens = data.maidens || 0;
    newBowler.balls = data.balls || 0;
    return newBowler;
}