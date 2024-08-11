const {KnightCard, VictoryPointCard, RoadBuildingCard, YearOfPlentyCard, MonopolyCard} = require ('./Card')

class DevelopmentCardPack {
    constructor() {
        this.cardList = [];

        // Adding knight cards
        this.cardList.push(...Array(2).fill(new KnightCard(null, "knight")));

        // Adding victory point cards
        this.cardList.push(...Array(2).fill(new VictoryPointCard(null, "victoryPoint")));

        // Adding road building cards
        this.cardList.push(...Array(2).fill(new RoadBuildingCard(null, "buildingRoads")));

        // Adding year of plenty cards
        this.cardList.push(...Array(2).fill(new YearOfPlentyCard(null, "yearOfPlenty")));

        // Adding monopoly cards
        this.cardList.push(...Array(2).fill(new MonopolyCard(null, "monopoly")));

        // Shuffle the cards
        this.shuffle(this.cardList);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getTopCard() {
        return this.cardList.length > 0 ? this.cardList[0] : null;
    }

    drawCard() {
        return this.cardList.length > 0 ? this.cardList.shift() : null;
    }
}


module.exports = DevelopmentCardPack