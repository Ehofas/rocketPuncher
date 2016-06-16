ScoreCounter = {
    countScores: countScores,
    getGameStatus: getGameStatus
};

function countScores(game, scores) {
    var result = {teams: {}};
    for (var team in game.teams) {
        result.teams[team] = {score: 0};
    }
    scores.forEach(function (score) {
        result.teams[score.team].score += 1;
    });
    return result;
}
function getGameStatus (game, scores){
    if(game.status != "ACTIVE"){
        return game.status;
    }
    var scoreMet = false;
    var scoreLeadMet = false;
    var teams = scores.teams;
    for(var team in teams){
        if(teams[team].score >= game.endScore){
            scoreMet = true;
        }
    }
    if(Math.abs(teams[1].score - teams[2].score) >= 2)
        scoreLeadMet = true;
    if(scoreMet && scoreLeadMet)
        return "ENDED";
    return "ACTIVE";
}

module.exports = ScoreCounter;