//const { ConnectionStates } = require('mongoose');
//const gameMap = require('./GameMap'); 
//const gm = require('../GameManager'); 

//const gameMap = require('./GameMap'); 

class Hexagon {

    static gameMap;

    constructor(q, r, id) {
        this.q = q;
        this.r = r;
        this.id = id;
        this.availableVerticesForCities = [1, 2, 3, 4, 5, 6];
        this.availableEdgesForRoads = [1, 2, 3, 4, 5, 6];
    }

    static setGameMap(map) {
        Hexagon.gameMap = map
    }
    getQ() {
        return this.q;
    }

    getR() {
        return this.r;
    }

    getId() {
        return this.id;
    }

    getVertexCopies(v_id) {
        const copies = this.getNeighborsToVertex(v_id);
        return copies;
    }

    getEdgeCopies(e_id) {
        const copies = this.getNeighborsToEdgeIds(e_id);
        return copies;
    }

    removeVertexCopies(v_id) {
        const copies = this.getVertexCopies(v_id);
        copies.forEach(copy => {
            const t = Hexagon.gameMap.getTileById(copy.tileId);
            t.removeAvailableVertex(copy.vertexId);
        });
    }

    getAdjacentVertices(v_id) {
        if (v_id === 1) {
            return [6, 2];
        } else if (v_id === 6) {
            return [5, 1];
        } else {
            return [v_id - 1, v_id + 1];
        }
    }

    getAdjacentEdgesToVertex(v_id) {
        if (v_id === 1) {
            return [1, 6];
        } else if (v_id === 6) {
            return [5, 6];
        } else {
            return [v_id, v_id - 1];
        }
    }

    getAdjacentEdgesToEdge(e_id) {
        if (e_id === 1) {
            return [2, 6];
        } else if (e_id === 6) {
            return [5, 1];
        } else {
            return [e_id - 1, e_id + 1];
        }
    }

    removeAvailableVertex(v_id) {
        this.availableVerticesForCities = this.availableVerticesForCities.filter(vertex => vertex !== v_id);
    }

    removeVerticesAfterBuildingCity(v_id) {
        this.removeAvailableVertex(v_id);
        this.removeVertexCopies(v_id);

        const adjacentVertices = this.getAdjacentVertices(v_id);
        adjacentVertices.forEach(id => {
            this.removeAvailableVertex(id);
            this.removeVertexCopies(id);
        });

        const copies = this.getVertexCopies(v_id);
        copies.forEach(copy => {
            const t = Hexagon.gameMap.getTileById(copy.tileId);
            const adjacentVertices2 = t.getAdjacentVertices(copy.vertexId);
            adjacentVertices2.forEach(id => {
                t.removeAvailableVertex(id);
                t.removeVertexCopies(id);
            });
        });
    }

    checkIfLocationIsValid(type, id) {
        if (type === "edge") {
            return this.availableEdgesForRoads.includes(id);
        } else if (type === "vertex") {
            return this.availableVerticesForCities.includes(id);
        } else {
            return false;
        }
    }

    getNeighborsToVertex(v_id) {
        let v_idOfNeighbors = [];
    
        let neighbors = this.getNeighbors(); // Assuming this method is correctly defined and retrieves neighbor ids
        switch (v_id) {
            case 1:
                neighbors.forEach(id => {
                    let t = Hexagon.gameMap.getTileById(id); // Assuming gameMap holds tiles and has getById
                    if (t.getQ() === this.q - 1 && t.getR() === this.r) { // Left
                        v_idOfNeighbors.push({ tileId: id, vertexId: 3 });
                    } else if (t.getQ() === this.q && t.getR() === this.r - 1) { // Upper left
                        v_idOfNeighbors.push({ tileId: id, vertexId: 5 });
                    }
                });
                break;
    
            case 2:
                neighbors.forEach(id => {
                    let t = Hexagon.gameMap.getTileById(id);
                    if (t.getQ() === this.q && t.getR() === this.r - 1) { // Upper left
                        v_idOfNeighbors.push({ tileId: id, vertexId: 4 });
                    } else if (t.getQ() === this.q + 1 && t.getR() === this.r - 1) { // Upper right
                        v_idOfNeighbors.push({ tileId: id, vertexId: 6 });
                    }
                });
                break;
    
            case 3:
                neighbors.forEach(id => {
                    let t = Hexagon.gameMap.getTileById(id);
                    if (t.getQ() === this.q + 1 && t.getR() === this.r - 1) { // Upper right
                        v_idOfNeighbors.push({ tileId: id, vertexId: 5 });
                    } else if (t.getQ() === this.q + 1 && t.getR() === this.r) { // Right
                        v_idOfNeighbors.push({ tileId: id, vertexId: 1 });
                    }
                });
                break;
    
            case 4:
                neighbors.forEach(id => {
                    let t = Hexagon.gameMap.getTileById(id);
                    if (t.getQ() === this.q + 1 && t.getR() === this.r) { // Right
                        v_idOfNeighbors.push({ tileId: id, vertexId: 6 });
                    } else if (t.getQ() === this.q && t.getR() === this.r + 1) { // Lower right
                        v_idOfNeighbors.push({ tileId: id, vertexId: 2 });
                    }
                });
                break;
    
            case 5:
                neighbors.forEach(id => {
                    let t = Hexagon.gameMap.getTileById(id);
                    if (t.getQ() === this.q && t.getR() === this.r + 1) { // Lower right
                        v_idOfNeighbors.push({ tileId: id, vertexId: 1 });
                    } else if (t.getQ() === this.q - 1 && t.getR() === this.r + 1) { // Lower left
                        v_idOfNeighbors.push({ tileId: id, vertexId: 3 });
                    }
                });
                break;
    
            case 6:
                neighbors.forEach(id => {
                    let t = Hexagon.gameMap.getTileById(id);
                    if (t.getQ() === this.q - 1 && t.getR() === this.r + 1) { // Lower left
                        v_idOfNeighbors.push({ tileId: id, vertexId: 2 });
                    } else if (t.getQ() === this.q - 1 && t.getR() === this.r) { // Left
                        v_idOfNeighbors.push({ tileId: id, vertexId: 4 });
                    }
                });
                break;
        }
    
        return v_idOfNeighbors;
    }
    

    /*getNeighborsToEdge(e_id) {
        const neighbors = this.getNeighbors();
        const edgeNeighbors = [];

        neighbors.forEach(id => {
            const t = Hexagon.gameMap.getTileById(id);
            const adjustment = this.edgeAdjustment(e_id, t);
            if (adjustment) {
                edgeNeighbors.push({ tileId: id, edgeId: adjustment });
            }
        });

        return edgeNeighbors;
    }
    */


    getNeighborsToEdgeIds(eId) {
        const edgesOfNeighbors = [];
    
        const neighbors = this.getNeighbors();
        switch (eId) {
            case 1:
                for (const id of neighbors) {
                    const tile = Hexagon.gameMap.getTileById(id);
                    if (tile.getQ() === this.q - 1 && tile.getR() === this.r - 1) {
                        edgesOfNeighbors.push({ first: id, second: 4 });
                    }
                }
                break;
            case 2:
                for (const id of neighbors) {
                    const tile = Hexagon.gameMap.getTileById(id);
                    if (tile.getQ() === this.q && tile.getR() === this.r - 1) {
                        edgesOfNeighbors.push({ first: id, second: 5 });
                    }
                }
                break;
            case 3:
                for (const id of neighbors) {
                    const tile = Hexagon.gameMap.getTileById(id);
                    if (tile.getQ() === this.q + 1 && tile.getR() === this.r) {
                        edgesOfNeighbors.push({ first: id, second: 6 });
                    }
                }
                break;
            case 4:
                for (const id of neighbors) {
                    const tile = Hexagon.gameMap.getTileById(id);
                    if (tile.getQ() === this.q + 1 && tile.getR() === this.r + 1) {
                        edgesOfNeighbors.push({ first: id, second: 1 });
                    }
                }
                break;
            case 5:
                for (const id of neighbors) {
                    const tile = Hexagon.gameMap.getTileById(id);
                    if (tile.getQ() === this.q && tile.getR() === this.r + 1) {
                        edgesOfNeighbors.push({ first: id, second: 2 });
                    }
                }
                break;
            case 6:
                for (const id of neighbors) {
                    const tile = Hexagon.gameMap.getTileById(id);
                    if (tile.getQ() === this.q - 1 && tile.getR() === this.r) {
                        edgesOfNeighbors.push({ first: id, second: 3 });
                    }
                }
                break;
        }
    
        return edgesOfNeighbors;
    }

    
    getNeighbors() {
        const neighborOffsets = [{q: 0, r: -1}, {q: 1, r: -1}, {q: 1, r: 0}, {q: 0, r: 1}, {q: -1, r: 1}, {q: -1, r: 0}];
        const neighbors = [];
        neighborOffsets.forEach(offset => {
            const neighborQ = this.q + offset.q;
            const neighborR = this.r + offset.r;

            const neighbor = Hexagon.gameMap.getTileByQandR(neighborQ, neighborR);
            if (neighbor) {

                neighbors.push(neighbor.getId());
            }
        });
        return neighbors;
    }

    toString() {
        return `id: ${this.id}, q: ${this.q}, r: ${this.r}`;
    }
}

module.exports = Hexagon ; 

