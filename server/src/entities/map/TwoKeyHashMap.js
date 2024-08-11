const Helpers = require('../Helpers');

const Pair = Helpers.Pair

class TwoKeyHashMap {
    constructor() {
        this.map = new Map();
    }

    isEmpty() {
        return this.map.size === 0;
    }

    size() {
        return this.map.size 
    }

    put(key1, key2, value) {
        const pair = new Pair(key1, key2);
        this.map.set(pair.toString(), value);
    }

    get(key1, key2) {
        const pair = new Pair(key1, key2);
        return this.map.get(pair.toString());
    }

    getById(key1) {
        for (let [key, value] of this.map) {
            const pair = key.split("_");
            if (pair[0] == key1) {  // Loose equality for type coercion
                return value;
            }
        }
        return null;
    }

    getByQandR(key2) {
        const { first: q2, second: r2 } = key2;

        for (let [key, value] of this.map) {
            const [q1, r1] = key.split("_").slice(1).map(Number);
            if (q1 === q2 && r1 === r2) {
                return value;
            }
        }
        return null;
    }

    getAllValues() {
        return Array.from(this.map.values());
    }
}

module.exports = TwoKeyHashMap; // Export as part of an object

// Example usage
/*
const map = new TwoKeyHashMap();
map.put(1, new Pair(2, 3), "Value1");
console.log(map.get(1, new Pair(2, 3))); // Outputs: "Value1"
console.log(map.getById(1)); // Outputs: "Value1"
console.log(map.getByQandR(new Pair(2, 3))); // Outputs: "Value1"
console.log(map.getAllValues()); // Outputs: ["Value1"]
*/
