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
router.post('/', function(req, res) {
    var db = req.db;

    db.get('games').insert({

        "status": "ACTIVE",
        "teams": req.body.teams,
        "endScore": req.body.ensScore,
        "deviceId": req.body.deviceId

    }, function(err, docsInserted){

	if (docsInserted) {
            res.json({"gameId": docsInserted._id});
	} else {
            res.status(500).json({"error":"Database error"});
        }

    });
});

module.exports = router;