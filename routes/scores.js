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
     db.get('games').find({"status": "ACTIVE", "deviceId": req.body.deviceId},{},function(e,game) {
        if(game.length > 0) {


            db.get("scores").insert({
                "gameId": game[0].gameId,
                "team": req.team,
                "date": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
            })

	        res.json(game);
        } else {
            res.json(["empty"]);
        }

    });
});

module.exports = router;
