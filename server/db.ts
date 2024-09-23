import {
    PrismaClient,
} from "@prisma/client";
import {
    Action,
    EndPhaseAction,
    ActionType,
    ActionBase,
    TurnPhase,
    TerritoryName,
    DeployAction,
    AttackAction,
    DiceRoll,
    FortifyAction,
    DrawCardAction,
    CardName,
    TurnInCardsAction, OccupyAction, Player
} from "@/game";
import {newGameState} from "@/game/state";
import {newTerritories} from "@/game/draft";

const prisma = new PrismaClient()



class GameDB {
    async getByPlayer(id: number, username: string) {
        const dbGame = await prisma.game.findFirst({
            where: { id, players: { some: { username } } },
            include: {
                drafts: true,
                actions: {
                    include: {
                        deploy: true,
                        attack: true,
                        occupy: true,
                        fortify: true,
                        endPhase: true,
                        drawCard: true,
                        turnInCards: true,
                    }
                },
                players: true
            }
        })

        if (!dbGame) {
            return null
        }

        const actions: Action[] = dbGame.actions
            .sort((a, b) => a.ordinal - b.ordinal)
            .map(a => {
                const type = a.type as ActionType
                const playerOrdinal = dbGame.players.find(p => p.id === a.playerId)?.ordinal
                if (!playerOrdinal) {
                    throw new Error(`action ${a.id} has unknown player ${a.playerId}`)
                }
                const base: ActionBase = { type, date: a.date, playerOrdinal }
                switch (type) {
                    case 'end_phase':
                        if (!a.endPhase) {
                            throw new Error(`action ${a.id} is of type endPhase but has no endPhase action attached`)
                        }
                        return {
                            ...base,
                            phase: a.endPhase.phase as TurnPhase
                        } as EndPhaseAction
                    case "deploy":
                        if (!a.deploy) {
                            throw new Error(`action ${a.id} is of type deploy but has no deploy action attached`)
                        }
                        return {
                            ...base,
                            territory: a.deploy.territory as TerritoryName,
                            armies: a.deploy.armies,
                        } as DeployAction
                    case "attack":
                        if (!a.attack) {
                            throw new Error(`action ${a.id} is of type attack but has no attack action attached`)
                        }
                        return {
                            ...base,
                            territoryFrom: a.attack.territoryFrom as TerritoryName,
                            territoryTo: a.attack.territoryTo as TerritoryName,
                            attackingDiceRoll: parseDiceRoll(a.attack.attackingDiceRoll),
                            defendingDiceRoll: parseDiceRoll(a.attack.defendingDiceRoll),
                        } as AttackAction
                    case "occupy":
                        if (!a.occupy) {
                            throw new Error(`action ${a.id} is of type occupy but has no occupy action attached`)
                        }
                        return {
                            ...base,
                            territoryFrom: a.occupy.territoryFrom as TerritoryName,
                            territoryTo: a.occupy.territoryTo as TerritoryName,
                            armies: a.occupy.armies
                        } as OccupyAction
                    case "fortify":
                        if (!a.fortify) {
                            throw new Error(`action ${a.id} is of type fortify but has no fortify action attached`)
                        }
                        return {
                            ...base,
                            territoryFrom: a.fortify.territoryFrom as TerritoryName,
                            territoryTo: a.fortify.territoryTo as TerritoryName,
                            armies: a.fortify.armies,
                        } as FortifyAction
                    case 'draw_card':
                        if (!a.drawCard) {
                            throw new Error(`action ${a.id} is of type drawCard but has no drawCard action attached`)
                        }
                        return {
                            ...base,
                            card: a.drawCard.card as CardName,
                        } as DrawCardAction
                    case 'turn_in_cards':
                        if (!a.turnInCards) {
                            throw new Error(`action ${a.id} is of type turnInCards but has no turnInCards action attached`)
                        }
                        return {
                            ...base,
                            cards: [
                                a.turnInCards.card1 as CardName,
                                a.turnInCards.card2 as CardName,
                                a.turnInCards.card3 as CardName,
                            ],
                        } as TurnInCardsAction
                }
            })

        const territories = newTerritories()
        for (let draft of dbGame.drafts) {
            const territory = territories[draft.territory as TerritoryName]
            territory.armies = draft.armies

            const playerOrdinal = dbGame.players.find(p => p.id === draft.playerId)?.ordinal
            if (!playerOrdinal) {
                throw new Error(`draft ${draft.id} has unknown player ${draft.playerId}`)
            }

            territory.owner = playerOrdinal
        }

        const players = dbGame.players.map(p => ({
            username: p.username,
            displayName: p.displayName,
            ordinal: p.ordinal,
            cards: []
        } as Player))

        return newGameState(
            dbGame.id,
            players,
            territories,
            actions,
            dbGame.dateStarted,
        )
    }
}

function parseDiceRoll(s: string): DiceRoll[] {
    return s.split(',').map(n => parseInt(n, 10) as DiceRoll)
}