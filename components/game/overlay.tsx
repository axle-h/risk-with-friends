'use client'

import {useGame} from "@/state/hooks";
import {
    Text, Box, Button, Flex, Heading,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton, useDisclosure, IconButton, IconButtonProps, Card, CardBody, Badge, Divider,
} from "@chakra-ui/react";
import {ArrowRightIcon, HamburgerIcon} from "@chakra-ui/icons";
import {
    AttackTurnState,
    ContinentName,
    DeployTurnState,
    DraftEvent,
    FortifyTurnState,
    GameEvent,
    NewAction,
    TurnState
} from "@/game";
import React from "react";
import {ClientGame} from "@/game/client-game";
import {formatDateTimeLong} from "@/components/dates";
import {CONTINENT_META} from "@/game/meta";

export function PlayerTurnOverlay() {
    const { data: game, mutate } = useGame()
    if (!game) {
        return <></>
    }

    const turn = game.playerTurn

    async function onAction(action: NewAction) {
        await mutate(g => g?.update(action))
    }

    return <Flex w="100%" p={3} justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" h="100%" gap={1}>
            <EventsDrawer game={game} mr={2} />
            <Box h="70%" px={1} bg={playerColor(turn.playerOrdinal)}></Box>
            <Heading size="sm" textTransform="uppercase">{turn.phase}</Heading>
        </Flex>
        {game.isMyTurn ? <TurnControls turn={turn} onAction={onAction} /> : <></>}
    </Flex>
}

function EventsDrawer({ game, ...props }: { game: ClientGame } & Omit<IconButtonProps, 'aria-label'>) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

    return (
        <>
            <IconButton icon={<HamburgerIcon />} ref={btnRef as any} onClick={onOpen} aria-label={"open menu"} {...props} />
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef as any}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader></DrawerHeader>
                    <DrawerBody>
                        {game.events.toReversed().map((event, i) => <GameEventSummary key={`event-${i}}`} event={event}  id={i}/>)}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

function playerColor(playerOrdinal: number) {
    return playerOrdinal === 1 ? 'red' : 'blue'
}

function GameEventSummary({ id, event }: { id: number, event: GameEvent }) {
    return (
        <Card mb={2}>
            <CardBody>
                <Flex gap={2}>
                    <Box px={1} bg={playerColor(event.playerOrdinal)}></Box>
                    <Box>
                        <Text>{formatDateTimeLong(event.date)}</Text>
                        <GameEventBody id={id} event={event} />
                    </Box>
                </Flex>
            </CardBody>
        </Card>
    )
}

function GameEventBody({ id, event }: { id: number, event: GameEvent }) {
    switch (event.type) {
        case "end_phase":
            break
        case "deploy":
            break
        case "attack":
            break
        case "occupy":
            break
        case "fortify":
            break
        case "turn_in_cards":
            break
        case "draft":
            return (
                <>
                    <Text>Drafted {event.armies} armies</Text>
                    <Text>Occupied {event.territories} territories</Text>
                </>
            )
        case "deployment":
            return (
                <>
                    <Text>Deployment</Text>
                    <Text>
                        <Badge mr={1} colorScheme="blue">+{event.territoryBonus}</Badge>
                        {event.territoriesOccupied} territories
                    </Text>
                    {
                        Object.entries(event.continentBonuses)
                            .filter(([,armies]) => armies > 0)
                            .map(([continent, armies]) => (
                                <Text key={`event-${id}-${continent}-bonus`}>
                                    <Badge mr={1} colorScheme="blue">+{armies}</Badge>
                                    {CONTINENT_META[continent as ContinentName].name}
                                </Text>
                            ))
                    }
                    <Divider my={1} variant="thick" />
                    <Text fontWeight={600}>
                        <Badge mr={1} colorScheme="green">+{event.total}</Badge>
                        Total
                    </Text>
                </>
            )
        case "territory_occupied":
            break
    }

    return <Text>TODO {event.type}</Text>
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

function AttackControls({ turn, onAction }: TurnProps<AttackTurnState>) {
    return (
        <>
            <Button size="sm"
                    variant="outline"
                    leftIcon={<ArrowRightIcon/>}
                    colorScheme={turn.territoryCaptured ? 'grey' : 'orange'}
                    onClick={() => onAction({ type: 'end_phase' })}>
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