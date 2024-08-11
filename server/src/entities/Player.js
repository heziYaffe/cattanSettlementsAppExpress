const Settlement = require('./Settlement');
const Road = require('./Road');
//const gm = require('../GameManager');
//onst gameMap = require('./map/GameMap'); // Make sure this module is correctly defined
//const GamesFactory = require('./GamesFactory');

class Player {
    constructor(gameManager, gameMap) {

        this.socketId = null
        this.gm = gameManager
        this.gameMap = gameMap


        this.id = null;
        this.resources = {
            sheep: 10,
            ore: 10,
            brick: 10,
            wheat: 10,
            wood: 10
        };
        this.settlements = [];
        this.roads = [];
        this.cards = {
            knight: 5,
            roadsBuilding: 5,
            yearOfPlenty: 5,
            monopoly: 5,
            victoryPoint: 5
        };
        this.points = 0;
        this.color = null;
        /*this.tradingOptions = {
            fourToOne: '1',
            threeToOne: '1',
            brickHarbor: '1',
            oreHarbor: '0',
            wheatHarbor: '0',
            sheepHarbor: '0',
            woodHarbor: '0'
        };
        */
       this.initializeBankTradingOptions()
    }

    initializeBankTradingOptions() {
        this.tradingOptions = {
            fourToOne: '1',
            threeToOne: '1',
            brickHarbor: '1',
            oreHarbor: '0',
            wheatHarbor: '0',
            sheepHarbor: '0',
            woodHarbor: '0'
        };
    }

    getBankTradingOptions() {
        return this.tradingOptions;
    }

    tradeWithTheBank(offerResource, offerAmount, requestResource) {
        let returnValue = false;
        const offerResourceAmount = this.resources[offerResource];
        console.log("offerResource", offerResource)
        console.log("offerAmount", offerAmount)
        console.log("requestResource", requestResource)

        switch (offerAmount) {
            case 2:
                if (this.tradingOptions[offerResource + "Harbor"] === "1") {
                    if (offerResourceAmount >= 2) {
                        this.resources[offerResource] -= 2;
                        this.resources[requestResource] += 1;
                        returnValue = true;
                    }
                }
                break;
            case 3:
                if (this.tradingOptions["threeToOne"] === "1") {
                    if (offerResourceAmount >= 3) {
                        this.resources[offerResource] -= 3;
                        this.resources[requestResource] += 1;
                        returnValue = true;
                    }
                }
                break;
            case 4:
                if (offerResourceAmount >= 4) {
                    this.resources[offerResource] -= 4;
                    this.resources[requestResource] += 1;
                    returnValue = true;
                }
                break;
            default:
                break;
        }

        return returnValue;
    }

    addResource(resource, quantity) {
        if (this.resources.hasOwnProperty(resource)) {
            this.resources[resource] += quantity;
        } else {
            this.resources[resource] = quantity;
        }
    }

    getSocketId() {
        return this.socketId
    }

    setSocketId(socketId) {
        this.socketId = socketId
    }

    getResources() {
        return this.resources;
    }

    getCards() {
        return this.cards;
    }

    getSettlements() {
        return this.settlements;
    }

    getRoads() {
        return this.roads;
    }

    getPoints() {
        return this.points;
    }

    setColor(color) {
        this.color = color;
    }

    getColor() {
        return this.color
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    drawCard(card) {
        console.log(`Trying to draw card: ${card.getName()}`);
        if (this.checkForEnoughResources(card.getCost())) {
            this.spendResources(card.getCost());
            console.log(`Drawing card: ${card.getName()}`);
            try {
                // Increment the count of the card in the player's possession
                this.cards[card.getName()] = (this.cards[card.getName()] || 0) + 1;
            } catch (error) {
                console.error(`Error while drawing card: ${error}`);
                this.cards[card.getName()] = 1; // If the card is not already in the dictionary, start at 1
            }
            return true;
        } else {
            console.log("You don't have enough resources to buy this development card");
            return false;
        }
    }
    

    buildPrimarySettlement(t_id, v_id) {
        const s = new Settlement(t_id, v_id, this, this.gameMap);
    
        const clickedTile = this.gameMap.getTileById(t_id);
    
        if (!clickedTile.isVertexAvailable(v_id)) {
            return false;
        }
    
        const neighborsToVertex = clickedTile.getNeighborsToVertex(v_id);
        console.log("neighborsToVertex:", neighborsToVertex)
        clickedTile.removeVerticesAfterBuildingCity(v_id);
        const settlementTiles = [clickedTile];
    
        for (const pair of neighborsToVertex) {
            console.log("pair:", pair)
            const nT_id = pair.tileId;  // tile id
            const nV_id = pair.vertexId; // tile vertex id
            const t = this.gameMap.getTileById(nT_id);
            if (t) {
                settlementTiles.push(t);
            }
        }
    
        for (const t of settlementTiles) {
            this.addResource(t.getResource(), 1);
            
        }
    
        // console.log(this.resources);
    
        s.setTiles(settlementTiles);
    
        // Add the settlement to the player's list of settlements
        this.settlements.push(s);
        this.points++;
        return true;
    }

    
    buildSettlement(t_id, v_id) {
        const tile = this.gameMap.getTileById(t_id);
        //console.log("tile:", tile)
        //console.log("availableVertices before:", tile.getAvailableVertices())
        //console.log("v_id:", v_id)
        if (tile && tile.isVertexAvailable(v_id)) {
            const settlement = new Settlement(t_id, v_id, this, this.gameMap);
            if (this.checkForEnoughResources(settlement.getCost())) {
                this.spendResources(settlement.getCost());
                console.log("build Settlement")

                let neighborsToVertex = tile.getNeighborsToVertex(v_id);
                //console.log("neighborsToVertex:", neighborsToVertex)

                tile.removeAvailableVertex(v_id)

                let settlementTiles = [];
                
                neighborsToVertex.forEach(pair => {
                    //console.log("pair:", pair)
                    let nT_id = pair.tileId;  // tile id
                    let nV_id = pair.vertexId; // tile vertex id
                    let t = this.gameMap.getTileById(nT_id); // Assuming gameMap holds the tiles and has a method to retrieve them by ID
                    t.removeAvailableVertex(nV_id);
                    //console.log("t:", t)
                    settlementTiles.push(t);
                });
                
    
                settlement.setTiles(settlementTiles);
                //console.log("settlement.getTiles():", settlement.getTiles())

                this.settlements.push(settlement);
                this.points += 1; // Update points or any other rules
                //console.log("availableVertices after:", tile.getAvailableVertices())
                return true;
            }
        }
        return false;
    }

    getAllRoadsPossibilities() {
        const uniquePossibilities = new Set();
    
        const possibilitiesFromSettlements = [];
        const possibilitiesFromRoads = [];
    
        // Assuming `settlements` and `roads` are arrays of `Settlement` and `Road` objects respectively
        this.settlements.forEach(s => {
            possibilitiesFromSettlements.push(...s.getRoadsPossibilities());
        });

        console.log("possibilitiesFromSettlements:", possibilitiesFromSettlements)
    
        this.roads.forEach(road => {
            possibilitiesFromRoads.push(...road.getRoadsPossibilities());
        });
    
        console.log("possibilitiesFromRoads:", possibilitiesFromRoads)

        // Adding all possibilities to a set to ensure uniqueness
        possibilitiesFromSettlements.forEach(p => uniquePossibilities.add(JSON.stringify(p)));
        possibilitiesFromRoads.forEach(p => uniquePossibilities.add(JSON.stringify(p)));
    
        // Assuming gm.getRoadsPositions() returns an array of road positions that should be excluded
        this.gm.getRoadsPositions().forEach(pos => uniquePossibilities.delete(JSON.stringify(pos)));
    
        // Convert set back to array and sort by the first element of the pair
        const sortedPossibilities = Array.from(uniquePossibilities).map(p => JSON.parse(p));
        sortedPossibilities.sort((a, b) => a[0] - b[0]); // Assuming the structure {t_id, e_id}
        
        return sortedPossibilities;
    }
    
    buildRoad(t_id, e_id) {
        const roadLocation = { t_id, e_id };
        const r = new Road(this.id, t_id, e_id, this.gameMap);
        console.log(`t_id: ${t_id}`);
        console.log(`e_id: ${e_id}`);
    
        if (this.roads.length <= 1) {
            this.addResource("wood", 1);
            this.addResource("brick", 1);
        }
    
        if (this.checkForEnoughResources(r.getCost())) {
            const possibilities = this.getAllRoadsPossibilities();
            console.log("possibilities:", possibilities);
    
            // Check if the road location is in the list of possible places to build roads
            const canBuild = possibilities.some(pos => pos.first === roadLocation.t_id && pos.second === roadLocation.e_id);
            if (canBuild) {
                this.spendResources(r.getCost());
                this.roads.push(r);  // Add the road to the player's list of roads
                
                this.gm.addRoad(r);  // This assumes `gm` is a game manager instance available in this context
    
                return true;  // Building successful
            } else {
                console.log(`Player ${this.id}, ${this.color} can't build a road in this location`);
                return false;  // Not a valid location
            }
        } else {
            console.log(`Player ${this.id}, ${this.color} doesn't have enough resources to build a road`);
            return false;  // Not enough resources
        }
    }
    

    checkForEnoughResources(cost) {
        return Object.keys(cost).every(key => this.resources[key] >= cost[key]);
    }

    spendResources(cost) {
        Object.keys(cost).forEach(key => {
            this.resources[key] -= cost[key];
        });
    }

    toString() {
        return `Player ID: ${this.id}\nColor: ${this.color}\nPoints: ${this.points}\nResources: ${JSON.stringify(this.resources)}\nSettlements: ${this.settlements.length}\nRoads: ${this.roads.length}\nDevelopment Cards: ${JSON.stringify(this.cards)}`;
    }
}

module.exports = Player;
