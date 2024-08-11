const Building = require('./Building'); // Make sure this module is correctly defined

class Settlement extends Building {
    static cost = {
        wood: 1,
        brick: 1,
        wheat: 1,
        sheep: 1
    };

    constructor(t_id, v_id, owner, gameMap) {
        
        super(owner, { t_id, v_id }, gameMap);
        //this.id = ++Building.id; // This assumes you want to increment a static id in the Building class
    }

    getCost() {
        return Settlement.cost
    }
}

module.exports = Settlement;
