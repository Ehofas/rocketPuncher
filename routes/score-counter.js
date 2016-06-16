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
    for(var team in scores.teams){
        if(scores.teams[team].score >= game.endScore){
            return "ENDED";
        }
    }
    return "ACTIVE";
}

module.exports = ScoreCounter;