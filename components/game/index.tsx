import {GameMap} from "@/components/game/map";
import {PlayerTurnOverlay} from "@/components/game/overlay";

export function GameBoard() {
    return (
        <>
            <PlayerTurnOverlay />
            <GameMap></GameMap>
        </>
    )
}