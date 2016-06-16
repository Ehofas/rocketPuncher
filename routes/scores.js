var express = require("express");
var dateFormat = require("dateformat");
var router = express.Router();
var ScoreCounter = require("./score-counter");

/*
 * POST /scores/{gameId}
 * request: {
 *            "deviceId": "b977d0488fe60ba27f01392cfc686299",
 *            "team": "1"
 * }
 */
function getScore(gameId, team) {
    return {
        "gameId": gameId,
        "team": team,
        "date": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
    };
}
router.post("/", function (req, res) {
    var db = req.db;
    db.get("games").find({"status": "ACTIVE", "deviceId": req.body.deviceId}, {}, function (e, games) {
        if (games && games.length > 0) {
            var game = games[0];
            var score = getScore(game._id, req.body.team);
            db.get("scores").insert(score);
            db.get("scores").find({"gameId": game._id}, {}, function (e, scores) {
                var calculatedScore = ScoreCounter.countScores(game, scores);
                if (ScoreCounter.getGameStatus(game, calculatedScore) == "ENDED") {
                    db.get("games").update(
                        {"_id": game._id},
                        {$set: {"status": "ENDED"}});
                }
                res.json(calculatedScore);
            });
        } else {
            res.json({"message": "Game not found"});
        }

    });
});

module.exports = router;
