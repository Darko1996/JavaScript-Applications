/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 50 points on GLOBAL score wins the game

*/


/*
YOUR 3 CHALLENGES
Change the game to follow these rules:

1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. (Hint: Always save the previous dice roll in a separate variable)

2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)

3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.)
*/

var scores, roundScore, activePLayer, gamePLaying, previousRoll;

init();

document.querySelector('.btn-roll').addEventListener('click', function(){
    if(gamePLaying){ //gameplaying je po default true (deklarisali smo ga dole)

        var dice = Math.floor(Math.random() * 6) + 1;
        var dice2 = Math.floor(Math.random() * 6) + 1;

        //display the result
        document.querySelector('.dice').style.display = 'block';
        document.querySelector('.dice').src = 'dice-' + dice + '.png'; 

        document.querySelector('.dice2').style.display = 'block';
        document.querySelector('.dice2').src = 'dice-' + dice2 + '.png';

        //proverava da li su bacene dve sestice za redom
        if(previousRoll === 6 && dice === 6){
            scores[activePLayer] = 0
            document.getElementById('score-' + activePLayer).textContent = '0';
            nextPlayer();
        } //update the round score if the rolled number was not a 1
        else if(dice !== 1 && dice2 !==1){
            roundScore += dice + dice2;
            document.querySelector('#current-' + activePLayer).textContent = roundScore;
        } 
        else {
            //next player
            console.log('1')
            nextPlayer();
        }
        previousRoll = dice; //ovo mora da ide na kraju jer se tako cuva poslednja bacena kockica i vraca se u if i proverava sledeci klik
    }    
});

document.querySelector('.btn-hold').addEventListener('click', function(){
    var input = document.querySelector('.btn-score').value;
    var setWinningScore

    if(input){
        setWinningScore = input;
    }
    else{
        setWinningScore = 100;
    }
    
    if(gamePLaying){
        //add current score to global score
        scores[activePLayer] += roundScore;   

        //update the ui
        document.querySelector('#score-' + activePLayer).textContent = scores[activePLayer];

        //check if player won the game 
        if(scores[activePLayer] >= setWinningScore){
            document.querySelector('#name-' + activePLayer).textContent = 'Winner';
            document.querySelector('.dice').style.display = 'none';
            document.querySelector('.dice2').style.display = 'none';
            document.querySelector('.player-'+ activePLayer + '-panel').classList.add('winner');
            document.querySelector('.player-'+ activePLayer + '-panel').classList.remove('active');
            gamePLaying = false;
        }
        else{
            nextPlayer();
        }
    }
});

function nextPlayer(){
    //next player   
    activePLayer === 0 ? activePLayer = 1 : activePLayer = 0;
    roundScore = 0; 

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.dice2').style.display = 'none';
}

function init(){
    scores = [0,0];
    roundScore = 0;
    activePLayer = 0;
    gamePLaying = true;
    
    document.querySelector('.dice').style.display = 'none'; 
    document.querySelector('.dice2').style.display = 'none';
    
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'PLayer 1';
    document.getElementById('name-1').textContent = 'PLayer 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
}

document.querySelector('.btn-new').addEventListener('click', init);






