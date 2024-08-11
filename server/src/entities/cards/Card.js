class Card {
    static cardCost = {
        ore: 0,
        wheat: 0,
        sheep: 0
    };

    constructor(owner, name) {
        this.owner = owner;
        this.name = name;
        this.used = false;
    }

    // Abstract method `apply` needs to be implemented in subclasses
    apply(data) {
        throw new Error('Method "apply()" must be implemented');
    }

    getName() {
        return this.name;
    }

    getCost() {
        return Card.cardCost;
    }

}

class KnightCard extends Card {
    constructor(owner, type) {
        super(owner, type); // Calls the constructor of the base Card class
        // Additional properties specific to KnightCard can be set here if needed
    }

    apply(data) {
        console.log(`Applying KnightCard effects for ${this.owner}`);
        // Implement the effects of the Knight card here
    }
}

class VictoryPointCard extends Card {
    constructor(owner, type) {
        super(owner, type);
    }

    apply(data) {
        console.log(`Applying VictoryPointCard effects for ${this.owner}`);
        // Implement the effects of the Victory Point card here
    }
}

class RoadBuildingCard extends Card {
    constructor(owner, type) {
        super(owner, type);
    }

    apply(data) {
        console.log(`Applying RoadBuildingCard effects for ${this.owner}`);
        // Implement the effects of the Road Building card here
    }
}

class YearOfPlentyCard extends Card {
    constructor(owner, type) {
        super(owner, type);
    }

    apply(data) {
        console.log(`Applying YearOfPlentyCard effects for ${this.owner}`);
        // Implement the effects of the Year Of Plenty card here
    }
}

class MonopolyCard extends Card {
    constructor(owner, type) {
        super(owner, type);
    }

    apply(data) {
        console.log(`Applying MonopolyCard effects for ${this.owner}`);
        // Implement the effects of the Monopoly card here
    }
}

module.exports = {KnightCard, MonopolyCard, YearOfPlentyCard, RoadBuildingCard, VictoryPointCard}