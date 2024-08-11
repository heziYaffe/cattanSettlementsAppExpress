const Pair = require('./Helpers').Pair;

class Road {
    static counter = 0;
    static roadCost = {
        wood: 1,
        brick: 1
    };

    constructor(ownerId, tId, eId, gameMap) {
        this.gameMap = gameMap
        this.id = ++Road.counter;
        this.ownerId = ownerId;
        this.tId = tId;
        this.eId = eId;
        const vertices = this.getVerticesOfEdge(eId);
        this.vId1 = vertices.first;
        this.vId2 = vertices.second;
    }

    getTid() {
        return this.tId
    }

    getEid() {
        return this.eId
    }

    getRoadPosition() {
        return new Pair(this.tId, this.eId);
    }

    getOwnerId() {
        return this.ownerId;
    }

    /*
    getRoadsPossibilities() {
        const possibilities = [];
        const tile = this.gameMap.getTileById(this.tId);

        // Get possibilities from the first vertex
        const copies1 = tile.getVertexCopies(this.vId1);
        copies1.forEach(copy => {
                    
            const adjacentEdges = this.gameMap.getTileById(copy.tileId).getAdjacentEdgesToVertex(copy.vertexId);
            adjacentEdges.forEach(eId => {
                possibilities.push(new Pair(copy.tileId, eId));
            });
        });

        // Get possibilities from the second vertex
        const copies2 = tile.getVertexCopies(this.vId2);
        copies2.forEach(copy => {
            const adjacentEdges = this.gameMap.getTileById(copy.tileId).getAdjacentEdgesToVertex(copy.vertexId);
            adjacentEdges.forEach(eId => {
                possibilities.push(new Pair(copy.tileId, eId));
            });
        });

        return possibilities;
    }
    */

    getRoadsPossibilities() {
        let possibilities = [];
    
        console.log("this.eId:", this.eId)
        // Get all the copies of the first vertex
        let copies1 = this.gameMap.getTileById(this.tId).getVertexCopies(this.vId1);
    
        // Add all the possibilities from the vertex of any copy
        for (let copy of copies1) {
            let t_idCopy = copy.tileId;
            let v_idCopy = copy.vertexId;
            let adjacentEdges1 = this.gameMap.getTileById(t_idCopy).getAdjacentEdgesToVertex(v_idCopy);
    
            for (let e_id of adjacentEdges1) {
                possibilities.push({ first: t_idCopy, second: e_id });
            }
        }
    
        // Get adjacent edges to the first vertex
        let adjacentEdges2 = this.gameMap.getTileById(this.tId).getAdjacentEdgesToVertex(this.vId1);
    
        // Add all the possibilities from the first vertex
        for (let e_id of adjacentEdges2) {
            possibilities.push({ first: this.tId, second: e_id });
        }
    
        // Get all the copies of the second vertex
        let copies2 = this.gameMap.getTileById(this.tId).getVertexCopies(this.vId2);
    
        // Get adjacent edges to the second vertex
        let adjacentEdges3 = this.gameMap.getTileById(this.tId).getAdjacentEdgesToVertex(this.vId2);
    
        for (let e_id of adjacentEdges3) {
            possibilities.push({ first: this.tId, second: e_id });
        }
    
        // Add all the possibilities from the vertex of any copy for the second vertex
        for (let copy of copies2) {
            let t_idCopy = copy.tileId;
            let v_idCopy = copy.vertexId;
            let adjacentEdges4 = this.gameMap.getTileById(t_idCopy).getAdjacentEdgesToVertex(v_idCopy);
    
            for (let e_id of adjacentEdges4) {
                possibilities.push({ first: t_idCopy, second: e_id });
            }
        }
    
        return possibilities;
    }
    
    getCost() {
        return Road.roadCost;
    }

    getVerticesOfEdge(edge) {
        if (edge === 6) {
            return new Pair(6, 1);
        } else {
            return new Pair(edge, edge + 1);
        }
    }
}

module.exports = Road;
