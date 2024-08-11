const GameMap = require('./entities/map/GameMap');
const GameManager = require('./GameManager');
const gameObjects = require('./entities/GameObjects');
const Hexagon = require('./entities/map/Hexagon');

class Game {
    constructor(numberOfPlayers, id) {
        this.id = id;
        this.gameMap = new GameMap();
        this.gm = new GameManager(id, this.gameMap);
        this.gameMap.setTiles(gameObjects.initialTiles())
        this.numberOfPlayers = numberOfPlayers
        Hexagon.setGameMap(this.gameMap)
        this.gm.setNumberOfPlayers(numberOfPlayers);
        this.gm.startGame();
    }

    getTurn() {
        return this.gm.getTurn()
    }
    getBoardState() {
        return this.gm.getBoardState()
    }

    setPlayerSocket(socketId) {
        this.gm.setPlayerSocket(socketId)
    }
    getTiles() {
        return this.gameMap.getTiles()
    }

    getGameMap() {
        returnthis.gameMap
    }
    
    getGameManager() {
        return this.gm
    }

    getId() {
        return this.id
    }

    getGameManager() {
        return this.gm
    }
}


module.exports = Game