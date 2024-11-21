import {GameMap} from "@/components/game/map";
import {Flex} from "@chakra-ui/react";

export function GameBoard() {
    return (
        <Flex w="100%" h="100dvh" direction="column" alignItems="center">
            <GameMap />
        </Flex>
    )
}