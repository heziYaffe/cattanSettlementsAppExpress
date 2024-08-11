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

function getPlayerResourcesAsString(playerResources) {
    let playerResourcesAsString = {};
    for (const [resource, value] of Object.entries(playerResources)) {
        playerResourcesAsString[resource] = value.toString();
    }
    return playerResourcesAsString;
}

function getPlayerCardsAsString(playerCards) {
    let playerCardsAsString = {};
    for (const [card, value] of Object.entries(playerCards)) {
        playerCardsAsString[card] = value.toString();
    }
    return playerCardsAsString;
}

function getPlayerState(player) {
    let playerState = {
        id: player.getId().toString(),
        color: player.getColor(),
        ...getPlayerResourcesAsString(player.getResources()),
        ...getPlayerCardsAsString(player.getCards()),
        points: player.getPoints().toString(),
        // Uncomment and modify if `name` is an attribute of the player
        // name: player.getName(),
    };

    return playerState;
}

module.exports = { Pair, getPlayerResourcesAsString, getPlayerCardsAsString, getPlayerState };

//module.exports = Pair;
