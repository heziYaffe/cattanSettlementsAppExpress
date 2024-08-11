const Game = require('./Game');

class GamesFactory {

    static id = 0
    static games = {}

    createGame(numberOfPlayers) {
        const id = ++GamesFactory.id; // Increment and use the static `id` correctly.
        const game = new Game(numberOfPlayers, id); // Ensure you pass `id` correctly.
        GamesFactory.games[id] = game; // Correct syntax to add game to the `games` object.
        return game;
    }

    getGame(gameId) {
        return GamesFactory.games[gameId]; // Correctly access the static `games` object.
    }

}


module.exports = GamesFactory