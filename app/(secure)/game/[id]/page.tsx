import {GameBoard} from "@/components/game";
import {SelectGame} from "@/app/(secure)/game/[id]/select-game";

export default function GamePage({ params }: { params: { id: string } }) {
    return (
        <>
            <SelectGame id={params.id} />
            <GameBoard />
        </>
    )
}

