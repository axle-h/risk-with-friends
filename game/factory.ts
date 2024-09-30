import {CardName, TerritoryName} from "@/game/schema";
import {Action, DiceRoll, TurnPhase, GameEvent} from "@/game/types";
import {AvailableDeployment} from "@/game/deployment";

export function deploy(playerOrdinal: number, territory: TerritoryName, armies: number): Action {
    return { type: 'deploy', playerOrdinal, date: new Date(), armies, territory }
}

export function deployment(playerOrdinal: number, deployment: AvailableDeployment): GameEvent {
    return { ...deployment, type: 'deployment', playerOrdinal, date: new Date() }
}

export function endPhase(playerOrdinal: number): Action {
    return { type: 'end_phase', date: new Date(), playerOrdinal }
}

export function attack(playerOrdinal: number, territoryFrom: TerritoryName, territoryTo: TerritoryName,
                attackingDiceRoll: DiceRoll[], defendingDiceRoll: DiceRoll[]): Action {
    return { type: 'attack', date: new Date(), playerOrdinal, territoryFrom, territoryTo, attackingDiceRoll, defendingDiceRoll }
}

export function occupy(playerOrdinal: number, armies: number): Action {
    return { type: 'occupy', date: new Date(), playerOrdinal, armies }
}

export function territoryOccupied(playerOrdinal: number, territory: TerritoryName): GameEvent {
    return { type: 'territory_occupied', date: new Date(), playerOrdinal, territory  }
}

export function fortify(playerOrdinal: number, territoryFrom: TerritoryName, territoryTo: TerritoryName, armies: number): Action {
    return { type: 'fortify', date: new Date(), playerOrdinal, territoryFrom, territoryTo, armies }
}

export function turnInCards(playerOrdinal: number, cards: [CardName, CardName, CardName]): Action {
    return { type: 'turn_in_cards', playerOrdinal, date: new Date(), cards }
}