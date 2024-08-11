//const gameMap = require('./entities/map/GameMap'); // Make sure this module is correctly defined
const Player = require('./entities/Player'); // Define this class if not already defined
//const Settlement = require('./Settlement'); // Define this class if not already defined
const Road = require('./entities/Road'); // Define this class if not already defined
const Helpers = require('./entities/Helpers');
const DevelopmentCardPack = require('./entities/cards/DevelopmentCardPack');

class GameManager {
    static STATE_SELECTING_START_POSITIONS = 0;
    static STATE_GAME_RUNNING = 1;
    static STATE_GAME_OVER = 2;

    static SELECTING_POSITIONS_FIRST_STAGE = 1;
    static SELECTING_POSITIONS_SECOND_STAGE = 2;

    static instance = null;

    constructor(gameId, gameMap) {

        this.gameId = gameId
        this.gameMap = gameMap

        this.playerColors = ["red", "blue", "green", "yellow"];
        this.isGameRunning = false;
        this.gameState = GameManager.STATE_GAME_RUNNING;//GameManager.STATE_SELECTING_START_POSITIONS;
        this.selectingStartingPositionsStage = GameManager.SELECTING_POSITIONS_FIRST_STAGE;
        this.developmentCardPack = new DevelopmentCardPack();
        //this.settlements = new Set();
        this.settlements = []
        this.roads = [];
        this.takenRoads = [];

        this.knightLocation = -1;
        this.turn = 0;
        this.players = [];
    }

    /*static getInstance() {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }*/


    getBoardState() {
        let boardState = {
            roads: this.roads,
            settlements: this.settlements,
            knightLocation: this.knightLocation,
        };

        return boardState;
    }

    setPlayerSocket(socketId) {
        for (let player of this.players) {
            if (!player.getSocketId()) {  // Check if the player doesn't have a socket ID yet
                player.setSocketId(socketId);
                console.log(`Socket ID ${socketId} assigned to player.`);
                return;  // Stop the loop and function once the socket ID is assigned
            }
        }
        console.log("All players already have a socket ID assigned.");
    }
    

    getTurn() {
        return this.turn
    }
    
    setNumberOfPlayers(numPlayers) {
        this.players = Array.from({ length: numPlayers }, () => new Player(this, this.gameMap));
        this.setPlayersIdentifiers();
    }

    setPlayersIdentifiers() {
        this.players.forEach((player, index) => {
            player.setId(index);
            player.setColor(this.playerColors[index]);
        });
    }

    getGameState() {
        return this.gameState;
    }

    setGameState(state) {
        this.gameState = state;
        console.log("New Game State is: " + this.gameState);
    }

    handleGameState() {
        switch (this.gameState) {
            case GameManager.STATE_SELECTING_START_POSITIONS:
                console.log("Selecting starting positions");
                break;
            case GameManager.STATE_GAME_RUNNING:
                console.log("Game is running");
                break;
            case GameManager.STATE_GAME_OVER:
                console.log("Game over");
                break;
            default:
                console.log("Unknown game state");
                break;
        }
    }

    handleSelectingStartingPositions(command, values) {
        if (command !== "buildSettlement" && command !== "buildRoad") {
            return false;
        }
    
        const p = this.players[this.turn % this.players.length];
        let { t_id } = values;
        //const t_id = parseInt(values["t_id"]);
        let sucess = false;
        console.log("Command is " + command);
        switch (command) {
            case "buildSettlement":
                let { v_id } = values;
                if (p.getSettlements().length === 0 &&
                    this.selectingStartingPositionsStage === GameManager.SELECTING_POSITIONS_FIRST_STAGE) {
                        sucess = p.buildPrimarySettlement(t_id, v_id);
                    return sucess;
                } else if (p.getSettlements().length === 1 &&
                    this.selectingStartingPositionsStage === GameManager.SELECTING_POSITIONS_SECOND_STAGE) {
                        sucess = p.buildPrimarySettlement(t_id, v_id);
                    return sucess;
                } else {
                    return false;
                }
            case "buildRoad":
                let { e_id } = values;
                if (p.getSettlements().length === 1 &&
                    this.selectingStartingPositionsStage === GameManager.SELECTING_POSITIONS_FIRST_STAGE) {
                    const roadPossibilities = p.getSettlements()[0].getRoadsPossibilities();
                    if (roadPossibilities.some(pair => pair.first === t_id && pair.second === e_id)) {
                        sucess = p.buildRoad(t_id, e_id);
                        return sucess;
                    }
                    return false;
                } else if (p.getSettlements().length === 2 &&
                    this.selectingStartingPositionsStage === GameManager.SELECTING_POSITIONS_SECOND_STAGE) {
                    const roadPossibilities = p.getSettlements()[1].getRoadsPossibilities();
                    if (roadPossibilities.some(pair => pair.first === t_id && pair.second === e_id)) {
                        sucess = p.buildRoad(t_id, e_id);
                        return sucess;
                    }
                    return false;
                } else {
                    console.log("Set Your Settlement First And Then Build Road");
                    return false;
                }
            default:
                return false;
        }
    }
    
    distributeResources(diceSum) {
        this.players.forEach(player => {
            //console.log("player:", player)
            player.getSettlements().forEach(settlement => {
                //console.log("settlement:", settlement)
                settlement.getTiles().forEach(tile => {
                    console.log("tile:", tile)
                    if (tile.getNumber() === diceSum) {
                        const correspondingResource = tile.getResource();
                        console.log("distribute:", correspondingResource)
                        const quantity = player.getResources()[correspondingResource] || 0;
                        // Update the resource quantity for the player
                        player.getResources()[correspondingResource] = quantity + 1;
                    }
                });
            });
        });
        console.log("Distributed Resources");
    }

    getRoadsPositions() {
        const roadsPositions = [];
        // Assuming `roads` is an array of `Road` objects
        this.takenRoads.forEach(road => {
            roadsPositions.push(road.getRoadPosition());
            //let pos = {first: road.t_id, second: road.e_id};
            //roadsPositions.push(pos);
        });
        return roadsPositions;
    }
    
    
    getPlayerBySocketId(socketId) {
        for (const player of this.players) {
            let s = player.getSocketId();
            console.log(s);
            if (s === socketId) {
                return player;  // This return will now effectively return from getPlayerBySocketId.
            }
        }
        return null;  // If no player with the matching socketId is found, return null.
    }
    

    handleCommand(player, command, values) {

        let response = {};
        let { t_id, e_id, v_id } = values;
        let offerAmount = parseInt(values.offerAmount);
        let requestAmount = parseInt(values.requestAmount);
        let {offerResource, requestResource} = values


        switch (command) {
            case "buildSettlement":
                //let { t_id, v_id } = values;
                response.success  = player.buildPrimarySettlement(t_id, v_id)//player.buildSettlement(t_id, v_id);

                if (response.success) {
                    this.settlements.push({ color: player.getColor(), t_id: t_id, v_id: v_id, location: values.settlementLocation});
                } 
                break;
            case "buildRoad":
                response.success = player.buildRoad(t_id, e_id);
                if (response.success) {
                    this.roads.push({ color: player.getColor(), t_id: t_id, e_id: e_id, location: values.roadLocation});
                }
                break;
            case "rollDice":
                const d1 = values.dice1
                const d2 = values.dice2
                this.distributeResources(d1 + d2);
                response.success = true;
                break;
            case "drawCard":
                const card = this.developmentCardPack.getTopCard();
                if (card) {
                    response.card = card.getName();
                    if (player.drawCard(card)) {
                        this.developmentCardPack.drawCard();
                        response.success = true;
                    }
                } else {
                    response.success = false;
                    // NOTIFY FRONT THAT THERE ARE NO MORE CARDS
                }
                break;
            case "tradeWithTheBank":
                console.log("tradeWithTheBank")
                response.success  = true;
                const tradingOptions = player.getBankTradingOptions();
                response = {...response, ...tradingOptions};
                break;
            
            case "submitOfferToBank":
                response.success  = player.tradeWithTheBank(offerResource, offerAmount, requestResource);
                console.log(`Offer successfully ${response.success}`);
                break;
            case "submitOfferToOtherPlayer":
                response.success  = true;//player.tradeWithTheBank(offerResource, offerAmount, requestResource);
                response.offerAmount = offerAmount
                response.requestAmount = requestAmount
                response.offerResource = offerResource
                response.requestResource = requestResource

                console.log(`Offer successfully ${response.success}`);
                break;

            default:
                response.error = "Invalid command";
                break;
        }

        return response
    }

    handleInputFromClients(command, values) {
        console.log("COMMAND IS:", command)
        let response = {};
        let player = this.players[this.turn % this.players.length];
        //console.log("player:", player)
        let { t_id, e_id, v_id } = values;

        if (player.getSocketId() !== values.socketId) {
            console.log(values.socketId, " Its Not Your Turn")
            response.success = false;
            player = this.getPlayerBySocketId(values.socketId)
            
        } else if (command === "endTurn") {
            this.endTurn();
            const newTurn = this.getTurn();
            response.turn = newTurn;
            //response.colorIndex = newTurn % this.players.length;
            response.success = true;
        } else if (this.gameState === GameManager.STATE_SELECTING_START_POSITIONS) {
            console.log("GAME_STATE = STATE_SELECTING_START_POSITIONS ")
            response.success = this.handleSelectingStartingPositions(command, values);
            if (response.success) {
                console.log("your command done succefuly")
                const s_id = player.getSettlements()[player.getSettlements().length - 1].getId();
                // console.log(s_id);
                response.s_id = s_id;
            } else {
                console.log("your command failed")
                response.s_id  = -1;
            }
        } else if (this.gameState === GameManager.STATE_GAME_RUNNING) {
            console.log("GAME_STATE = STATE_GAME_RUNNING) ")
            response = this.handleCommand(player, command, values)
            console.log("response is " + response)

            /*
            switch (command) {
                case "buildSettlement":
                    response.success  = player.buildPrimarySettlement(t_id, v_id)//player.buildSettlement(t_id, v_id);
    
                    if (response.success) {
                        let s_id = player.getSettlements()[player.getSettlements().length - 1].getId();
                        this.settlements.push({ color: player.getColor(), t_id: t_id, v_id: v_id, location: values.settlementLocation});
                        response.s_id = s_id
                    } else {
                        response.s_id = -1
                    }
                    break;
                case "buildRoad":
                    response.success = player.buildRoad(t_id, e_id);
                    if (response.success) {
                        this.roads.push({ color: player.getColor(), t_id: t_id, e_id: e_id, location: values.roadLocation});
                    }
                    break;
                case "rollDice":
                    const d1 = values.dice1
                    const d2 = values.dice2
                    this.distributeResources(d1 + d2);
                    response.success = true;
                    break;
                
                case "drawCard":
                    const card = this.developmentCardPack.getTopCard();
                    console.log("card:", card)
                    if (card) {
                        response.card = card.getName();
                        if (player.drawCard(card)) {
                            this.developmentCardPack.drawCard();
                            response.success = true;
                        }
                    } else {
                        response.success = false;
                        // NOTIFY FRONT THAT THERE ARE NO MORE CARDS
                    }
                    break;
                default:
                    response.error = "Invalid command";
                    break;
            }
            */

        }
        

        // Assuming Helpers.getPlayerState is adapted to JavaScript and exported accordingly
        let playerState = Helpers.getPlayerState(player);
        let boardState = this.getBoardState()
        console.log("boardState:", boardState)
        response = { ...response, ...playerState };

        return response;
    }

    startGame() {
        //this.setGameState(GameManager.STATE_SELECTING_START_POSITIONS);
        this.handleGameState();
    }

    endGame() {
        this.setGameState(GameManager.STATE_GAME_OVER);
        this.handleGameState();
    }

    updateTurn() {
        if (this.gameState === GameManager.STATE_SELECTING_START_POSITIONS) {
            if (this.selectingStartingPositionsStage === GameManager.SELECTING_POSITIONS_FIRST_STAGE) {
                if (this.turn === this.players.length - 1) {
                    this.selectingStartingPositionsStage = GameManager.SELECTING_POSITIONS_SECOND_STAGE;
                    return;
                }
                this.turn++;
    
            } else if (this.selectingStartingPositionsStage === GameManager.SELECTING_POSITIONS_SECOND_STAGE) {
                if (this.turn === 0) {
                    this.setGameState(GameManager.STATE_GAME_RUNNING);
                    return;
                }
                this.turn--;
            }
        } else if (this.gameState === GameManager.STATE_GAME_RUNNING) {
            this.turn++;
        } else {
            this.turn++;
        }
    }
    

    endTurn() {
        this.updateTurn();
        console.log(`Turn updated to ${this.turn}`);
    }

    addRoad(road) {
        /*this.roads.push(road);
        const roadPosition = road.getRoadPosition();
        const tId = roadPosition.first;
        const eId = roadPosition.second;
        const edgeCopies = this.gameMap.getTileById(tId).getEdgeCopies(eId);
        //console.log("edgeCopies:", edgeCopies)
    
        for (const edgeCopy of edgeCopies) {
            const newRoad = new Road(road.getOwnerId(), edgeCopy.first, edgeCopy.second, this.gameMap);
            this.roads.push(newRoad);
        }
        */
        this.takenRoads.push(road)
        const roadPosition = road.getRoadPosition();
        const tId = roadPosition.first;
        const eId = roadPosition.second;
        const edgeCopies = this.gameMap.getTileById(tId).getEdgeCopies(eId);
        //console.log("edgeCopies:", edgeCopies)
    
        for (const edgeCopy of edgeCopies) {
            const newRoad = new Road(road.getOwnerId(), edgeCopy.first, edgeCopy.second, this.gameMap);
            this.takenRoads.push(newRoad);
        }
    }
    
}

//module.exports = new GameManager();
module.exports = GameManager;