import {TurnPhase} from "@/game/types";

export function niceTurnPhase(phase: TurnPhase) {
    switch (phase) {
        case "deploy":
            return 'Deploy'
        case "attack":
            return 'Attack'
        case "occupy":
            return 'Occupy'
        case "fortify":
            return 'Fortify'
    }
}