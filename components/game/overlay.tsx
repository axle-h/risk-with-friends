'use client'

import {useGame} from "@/state/hooks";
import {Text, Box, Button, Flex, Heading} from "@chakra-ui/react";
import {ArrowRightIcon} from "@chakra-ui/icons";
import {AttackTurnState, DeployTurnState, FortifyTurnState, TurnState} from "@/game";

export function PlayerTurnOverlay() {
    const { data: game, mutate } = useGame()
    if (!game) {
        return <></>
    }

    const turn = game.playerTurn
    if (!turn) {
        return <></>
    }



    return <Flex w="100%" p={3} justifyContent="space-between" alignItems="center">
        <Flex>
            <Box px={1} bg="red" mr={1}></Box>
            <Heading size="sm" textTransform="uppercase">{turn.phase}</Heading>
        </Flex>
        <TurnControls turn={turn} />
    </Flex>
}

function TurnControls({ turn }: { turn: TurnState }) {
    switch (turn.phase) {
        case "deploy":
            return <DeployControls turn={turn} />
        case "attack":
            return <AttackControls turn={turn} />
        case "fortify":
            return <FortifyControls turn={turn} />
    }
}

function DeployControls({ turn }: { turn: DeployTurnState }) {
    return (
        <>
            <Box>
                <Text>{turn.armiesRemaining} Armies Remaining</Text>
            </Box>
            <Button size="sm" variant="outline" leftIcon={<ArrowRightIcon />}>
                Start Attack
            </Button>
        </>
    )
}

function AttackControls({ turn }: { turn: AttackTurnState }) {
    return (
        <>
            <Button size="sm" variant="outline" leftIcon={<ArrowRightIcon />}>
                End Attack
            </Button>
        </>
    )
}

function FortifyControls({ turn }: { turn: FortifyTurnState }) {
    return (
        <>
            <Button size="sm" variant="outline" leftIcon={<ArrowRightIcon />}>
                End Turn
            </Button>
        </>
    )
}