import {GameMap} from "@/components/game/map";
import {PlayerTurnOverlay} from "@/components/game/overlay";
import {Box, Flex} from "@chakra-ui/react";

export function GameBoard() {
    return (
        <Flex w="100%" h="100dvh" direction="column" alignItems="center">
            <PlayerTurnOverlay />
            <GameMap />
        </Flex>
    )
}