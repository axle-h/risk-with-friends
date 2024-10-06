'use client'

import {useGame} from "@/state/hooks";
import {Text, Box, Button, Flex, Heading} from "@chakra-ui/react";
import {ArrowRightIcon} from "@chakra-ui/icons";
import {AttackTurnState, DeployTurnState, FortifyTurnState, NewAction, TurnState} from "@/game";

export function PlayerTurnOverlay() {
    const { data: game, mutate } = useGame()
    if (!game) {
        return <></>
    }

    const turn = game.playerTurn
    if (!turn) {
        return <></>
    }

    async function onAction(action: NewAction) {
        await mutate(g => g?.update(action))
    }

    return <Flex w="100%" p={3} justifyContent="space-between" alignItems="center">
        <Flex>
            <Box px={1} bg="red" mr={1}></Box>
            <Heading size="sm" textTransform="uppercase">{turn.phase}</Heading>
        </Flex>
        <TurnControls turn={turn} onAction={onAction} />
    </Flex>
}

interface TurnProps<State = TurnState> {
    turn: State
    onAction(action: NewAction): void
}

function TurnControls({ turn, ...props }: TurnProps) {
    switch (turn.phase) {
        case "deploy":
            return <DeployControls {...props} turn={turn} />
        case "attack":
            return <AttackControls {...props} turn={turn} />
        case "fortify":
            return <FortifyControls {...props} turn={turn} />
    }
}

function DeployControls({ turn, onAction }: TurnProps<DeployTurnState>) {
    return (
        <>
            <Box>
                <Text>{turn.armiesRemaining} Armies Remaining</Text>
            </Box>
            <Button size="sm"
                    variant="outline"
                    leftIcon={<ArrowRightIcon/>}
                    colorScheme={turn.armiesRemaining > 0 ? 'grey' : 'orange'}
                    onClick={() => onAction({ type: 'end_phase' })}>
                Start Attack
            </Button>
        </>
    )
}

function AttackControls({ turn }: TurnProps<AttackTurnState>) {
    return (
        <>
            <Button size="sm" variant="outline" leftIcon={<ArrowRightIcon />}>
                End Attack
            </Button>
        </>
    )
}

function FortifyControls({ turn }: TurnProps<FortifyTurnState>) {
    return (
        <>
            <Button size="sm" variant="outline" leftIcon={<ArrowRightIcon />}>
                End Turn
            </Button>
        </>
    )
}