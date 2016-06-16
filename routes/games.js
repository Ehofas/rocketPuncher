var express = require('express');
var dateFormat = require('dateformat');
var router = express.Router();
var ScoreCounter = require("./score-counter");

/*
 * POST /games
 *
 * deviceId: controlling device id
 * teams: players participating in the match
 * endScore: match ending score
 *
 * request: {
 *     "deviceId": "b977d0488fe60ba27f01392cfc686299",
 *     "teams": {
 *         "1": ["p998pmo"],
 *         "2": ["p998cmm"]
 *     },
 "endScore": 11
 * }
 *
 * responseSample: {
 *     "gameId": "5762a65f8802d648487b46ef"
 * }
 */

router.post('/', function (req, res) {
    var db = req.db;
    if(validateFields(res, req.body)) {
        db.get('games').insert({
            "status": "ACTIVE",
            "teams": req.body.teams,
            "endScore": req.body.endScore,
            "deviceId": req.body.deviceId,
            "startDate": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
        }, function (err, docsInserted) {
            if (docsInserted) {
                res.json({"gameId": docsInserted._id});
            } else {
                res.status(500).json({"message": "Database error", "error": "Database error"});
            }
        });
    }
});

function validateFields(res, fields) {
    if(fields.teams == undefined){
        res.status(400).json({"message": "Field value invalid"});
        return false;
    }
    return true;
}

/*
 * GET /games
 * returns all games
 */
router.get('/', function (req, res) {
    var db = req.db;

    db.get('games').find({}, function (err, found) {
        res.json(found);
    });
});

/*
 * GET /games/:id
 * Get detailed game status
 */
router.get('/:id', function (req, res) {
    var db = req.db;

    db.get('games').findOne({
        "_id": req.params.id
    }, function (err, game) {
        if (game) {
            db.get("scores").find({
                "gameId": game._id
            }, {}, function (e, scores) {
                game.scores = ScoreCounter.countScores(game, scores);
                res.json(game);
            });
        } else {
            res.status(404).json({"message": "Game not found", "error": {}});
        }
    });
});

/*
 * GET /games/abort/:id
 * Stop game
 */
router.post('/abort/:id', function (req, res) {
    var db = req.db;

    db.get('games').update({
        "_id": req.params.id
    }, {
        $set: {
            "status": "ABORTED",
            "endDate": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
        }
    }, function (e) {
        res.json({"message": "Game stopped"});
    });
});

module.exports = router;
