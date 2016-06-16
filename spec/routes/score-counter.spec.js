describe("Score counter", function () {
    var scoreCounter = require('../../routes/score-counter');

    var scores, game;
    beforeEach(function () {
        game = {
            "_id": "576286d2fdf4e7eac36b8fac",
            "status": "ACTIVE",
            "teams": {"1": ["p998pmo"], "2": ["p998pmo"]},
            "deviceId": "b977d0488fe60ba27f01392cfc686299",
            "endScore": 11
        };
    });

    describe("#countScores", function () {
        beforeEach(function () {
            scores = [{
                "_id": "57629af6bb74bf937237f5ec",
                "gameId": "1234",
                "team": "1",
                "date": "2016-06-16 15:06:03"
            }, {
                "_id": "57629afabb74bf937237f5ed",
                "gameId": "1234",
                "team": "1",
                "date": "2016-06-16 15:06:33"
            }, {
                "_id": "57629b02bb74bf937237f5ee",
                "gameId": "1234",
                "team": "2",
                "date": "2016-06-16 15:06:35"
            }, {
                "_id": "57629b0bbb74bf937237f5ef",
                "gameId": "1234",
                "team": "2",
                "date": "2016-06-16 15:06:45"
            }, {
                "_id": "57629b0fbb74bf937237f5f0",
                "gameId": "1234",
                "team": "2",
                "date": "2016-06-16 15:06:49"
            }];
        });
        it("should return counted scores", function () {
            var score = scoreCounter.countScores(game, scores);
            expect(score.teams[1].score).toBe(2);
            expect(score.teams[2].score).toBe(3);
        });
        it("should count one sided match", function () {
            scores = scores.splice(2);
            var score = scoreCounter.countScores(game, scores);
            expect(score.teams[1].score).toBe(0);
            expect(score.teams[2].score).toBe(3);
        });
        it("should count empty match", function () {
            var score = scoreCounter.countScores(game, []);
            expect(score.teams[1].score).toBe(0);
            expect(score.teams[2].score).toBe(0);
        });
    });

    describe("#getGameStatus", function () {
        var scores;
        beforeEach(function () {
            scores = {
                teams: {
                    "1": {score: 10},
                    "2": {score: 10}
                }
            }
        });
        it("should return active if score not met", function () {
            expect(scoreCounter.getGameStatus(game, scores)).toBe("ACTIVE");
        });
        it("should return game status if game not active", function () {
            game.status = "ABORTED";
            expect(scoreCounter.getGameStatus(game, scores)).toBe("ABORTED");
        });
        it("should return ended if score is met", function () {
            scores.teams[1].score = 11;
            expect(scoreCounter.getGameStatus(game, scores)).toBe("ENDED");
        });
    });

});