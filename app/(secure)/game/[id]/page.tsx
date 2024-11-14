import {GameBoard} from "@/components/game";
import {SelectGame} from "@/app/(secure)/game/[id]/select-game";

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <>
            <SelectGame id={id} />
            <GameBoard />
        </>
    )
}

