//const Hexagon = require('./Hexagon');

class Tile {
    constructor(h, resource, number) {
        this.h = h;
        this.resource = resource;
        this.number = number;
        this.neighbors = h.getNeighbors
        this.thief = false;
    }

    getId() {
        return this.h.getId();
    }

    getQ() {
        return this.h.getQ();
    }

    getR() {
        return this.h.getR();
    }

    getNumber() {
        return this.number;
    }

    getResource() {
        return this.resource;
    }

    getNeighborsToVertex(vId) {
        return this.h.getNeighborsToVertex(vId);
    }

    isThief() {
        return this.thief;
    }

    isVertexAvailable(v_id) {
        return this.h.checkIfLocationIsValid("vertex", v_id);
    }

    isEdgeAvailable(e_id) {
        return this.h.checkIfLocationIsValid("edge", e_id);
    }

    removeAvailableVertex(v_id) {
        this.h.removeAvailableVertex(v_id);
    }

    removeVertexCopies(v_id) {
        this.h.removeVertexCopies(v_id);
    }

    getAdjacentVertices(v_id) {
        return this.h.getAdjacentVertices(v_id);
    }

    removeVerticesAfterBuildingCity(v_id) {
        this.h.removeVerticesAfterBuildingCity(v_id);
    }

    toString() {
        return `Hexagon ${this.hexagon.toString()}, Resource ${this.resource}, Number: ${this.number}`;
    }

    getAvailableVertices() {
        return this.h.availableVerticesForCities;
    }

    initNeighbors() {
        this.neighbors = this.getNeighbors();
    }

    getNeighbors() {
        return this.neighbors;
    }

    setThief(b) {
        this.thief = b;
    }

    getVertexCopies(v_id) {
        return this.h.getVertexCopies(v_id);
    }

    getEdgeCopies(e_id) {
        return this.h.getEdgeCopies(e_id);
    }

    getAdjacentEdgesToVertex(v_id) {
        return this.h.getAdjacentEdgesToVertex(v_id);
    }
}


module.exports = Tile;
