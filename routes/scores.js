var express = require('express');
var dateFormat = require('dateformat');
var router = express.Router();

/*
 * POST /scores/{gameId}
 * request: {
 *            "deviceId": "b977d0488fe60ba27f01392cfc686299",
 *            "team": "1"
 * }
 */
router.post('/', function(req, res) {
    var db = req.db;
     db.get('games').find({"status": "ACTIVE", "deviceId": req.body.deviceId},{},function(e,games) {
        if(games.length > 0) {
            var score = {
                "gameId": games[0].id,
                "team": req.body.team,
                "date": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
            };
            //db.get("scores").insert(score);
	        res.json(score);
        } else {
            res.json(["empty"]);
        }

    });
});

module.exports = router;
