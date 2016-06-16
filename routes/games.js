var express = require('express');
var dateFormat = require('dateformat');
var router = express.Router();

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
});

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
 */
router.get('/:id', function (req, res) {
    var db = req.db;

    db.get('games').findOne({
        "_id": req.params.id
    }, function (err, found) {
        if (found) {
            res.json(found);
        } else {
            res.status(404).json({"message": "Game not found", "error": {}});
        }
    });
});


module.exports = router;
