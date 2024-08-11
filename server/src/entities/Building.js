const Pair = require('./Helpers').Pair;
//const gameMap = require('./map/GameMap');

class Building {
    static id = -1;
    static cost = {
        // Define static costs if any specific to buildings generally
    };

    constructor(owner, location, gameMap) {
        if (new.target === Building) {
            throw new TypeError("Cannot construct Building instances directly");
        }
        this.owner = owner;
        this.location = location; // Pair of t_id and v_id
        this.gameMap = gameMap;
        this.tiles = [];
    }

    getTiles() {
        return this.tiles;
    }

    setTiles(tiles) {
        this.tiles = tiles;
    }

    static getCost() {
        return Building.cost;
    }

    getRoadsPossibilities() {
        const possibilities = [];
        //console.log("this.location:", this.location)
        const tile = this.gameMap.getTileById(this.location.t_id);
        //console.log("tile:", tile)

        // Get possibilities directly from the current vertex
        const adjacentEdges = tile.getAdjacentEdgesToVertex(this.location.v_id);
        adjacentEdges.forEach(eId => {
            possibilities.push(new Pair(this.location.t_id, eId));
        });

        console.log("adjacentEdges:", adjacentEdges)

        // Get possibilities from copies of the vertex
        const copies = tile.getVertexCopies(this.location.v_id);

        copies.forEach(copy => {
            const tId = copy.tileId;
            const vId = copy.vertexId;
            const adjacentEdges = this.gameMap.getTileById(tId).getAdjacentEdgesToVertex(vId);
            adjacentEdges.forEach(eId => {
                possibilities.push(new Pair(tId, eId));
            });
        });

        return possibilities;
    }

    getId() {
        return Building.id;
    }

    getLocation() {
        return this.location;
    }

    getOwnerId() {
        return this.ownerId;
    }
}

module.exports = Building;
