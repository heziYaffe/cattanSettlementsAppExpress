const TwoKeyHashMap = require('./TwoKeyHashMap');
//const MapHelpers = require('./MapHelpers');

//const Pair = MapHelpers.Pair
class Pair {
    constructor(first, second) {
        this.first = first;
        this.second = second;
    }

    // Adding a method to generate a unique key string for each pair
    toString() {
        return `${this.first}_${this.second}`;
    }

    equals(other) {
        return this.first === other.first && this.second === other.second;
    }
};

class GameMap {
    constructor(tiles) {
        //this.tiles = new TwoKeyHashMap();
        //this.initialTiles();
    }

    setTiles(tiles) {
        this.tiles = tiles
    }

    getTiles() {
        //return this.tiles
        const tilesArray = [];
        this.tiles.getAllValues().forEach((tile, key) => {
            tilesArray.push({
                key: key,
                q: tile.h.getQ(),
                r: tile.h.getR(),
                id: tile.h.getId(),
                resource: tile.resource,
                number: tile.number
            });
        });
        return tilesArray;
    }
    
    getTileById(id) {
        return this.tiles.getById(id)
    }

    getTileByQandR(q, r) {
        return this.tiles.getByQandR(new Pair(q,r))
    }


    /*
    
    getQAndR(id) {
        const coordinates = {
            0: new Pair(0, -3), 1: new Pair(1, -3), 2: new Pair(2, -3), 3: new Pair(3, -3),
            4: new Pair(-1, -2), 5: new Pair(0, -2), 6: new Pair(1, -2), 7: new Pair(2, -2), 8: new Pair(3, -2),
            9: new Pair(-2, -1), 10: new Pair(-1, -1), 11: new Pair(0, -1), 12: new Pair(1, -1), 13: new Pair(2, -1), 14: new Pair(3, -1),
            15: new Pair(-3, 0), 16: new Pair(-2, 0), 17: new Pair(-1, 0), 18: new Pair(0, 0), 19: new Pair(1, 0), 20: new Pair(2, 0), 21: new Pair(3, 0),
            22: new Pair(-3, 1), 23: new Pair(-2, 1), 24: new Pair(-1, 1), 25: new Pair(0, 1), 26: new Pair(1, 1), 27: new Pair(2, 1),
            28: new Pair(-3, 2), 29: new Pair(-2, 2), 30: new Pair(-1, 2), 31: new Pair(0, 2), 32: new Pair(1, 2),
            33: new Pair(-3, 3), 34: new Pair(-2, 3), 35: new Pair(-1, 3), 36: new Pair(0, 3),
            'default': new Pair(-99999, -99999)
        };
        return coordinates[id] || coordinates['default'];
    }
    

    getRandomSeaHarbor() {
        const seaHarbors = ["harbor1", "harbor2", "harbor3", "harbor1", "harbor2", "harbor1", "harbor2", "harbor3"];
        return seaHarbors[Math.floor(Math.random() * seaHarbors.length)];
    }


    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    initialTiles() {
        const Tile = require('./Tile');
        const Hexagon = require('./Hexagon');
        console.log("try to initialTiles")

        if (this.tiles.isEmpty()) {
            const numbers = [2, 3, 3, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 10, 11, 11, 12];
            const resources = ["wood", "wood", "wood", "wood", "sheep", "sheep", "sheep", "sheep",
                                "wheat", "wheat", "wheat", "brick", "brick", "brick", "ore", "ore", "ore", "ore", "desert"];
            this.shuffleArray(numbers);
            this.shuffleArray(resources);

            const numRows = 5;
            const tilesPerRow = [5, 6, 7, 6, 5];
            let h_id = 0;

            for (let i = 0; i < 4; i++) {
                const qAndR = this.getQAndR(h_id);
                const q = qAndR.first
                const r = qAndR.second
                let resourceName = this.getRandomSeaHarbor();

                let h = new Hexagon(q, r, h_id);

                if (i === 0) resourceName = "oreHarbor";
                if (i === 3) resourceName = "woodHarbor";


                this.tiles.put(h_id, qAndR, new Tile(h, resourceName, 0, h_id));
                h_id++;
            }

            for (let row = 0; row < numRows; row++) {
                for (let col = 0; col < tilesPerRow[row]; col++) {
                    let qAndR = this.getQAndR(h_id);
                    const q = qAndR.first
                    const r = qAndR.second
                    let h = new Hexagon(q, r, h_id);

                    if (col === 0) {
                        let resourceName = this.getRandomSeaHarbor();
                        if (row === 2) {
                            resourceName = "sheepHarbor";
                        }
                        this.tiles.put(h_id, qAndR, new Tile(h, resourceName, 0, h_id));

                    } else if (col === tilesPerRow[row] - 1) {
                        let resourceName = this.getRandomSeaHarbor();
                        if (row === 2) {
                            resourceName = "wheatHarbor";
                        }
                        this.tiles.put(h_id, qAndR, new Tile(h, resourceName, 0, h_id));
                    } else {
                        let resourceName = resources.pop();
                        const number = resourceName !== "desert" ? numbers.pop() : -1;
                        this.tiles.put(h_id, qAndR, new Tile(h, resourceName, number, h_id));
                    }
                    h_id++;
                }

            }

            for (let i = 0; i < 4; i++) {
                const qAndR = this.getQAndR(h_id);
                const q = qAndR.first
                const r = qAndR.second
                let h = new Hexagon(q, r, h_id);
                let resourceName = this.getRandomSeaHarbor();
                if (i === 0) resourceName = "threeToOneHarbor";
                if (i === 3) resourceName = "brickHarbor";
                this.tiles.put(h_id, qAndR, new Tile(h, resourceName, 0, h_id));
                h_id++;
            }


        }

    }
    */

    toString() {
        let result = "TilesMap:\n";
        for (let tile of this.tiles.getAllValues()) {
            result += tile.toString() + "\n";
        }
        return result;
    }

    
}

//module.exports = new GameMap();
module.exports = GameMap;

