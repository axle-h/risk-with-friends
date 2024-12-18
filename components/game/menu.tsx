'use client'

import {useGame} from "@/state/hooks";
import {
    Text,
    Box,
    Button,
    Flex,
    Heading,
    IconButton,
    IconButtonProps,
    Card,
    Badge,
    HStack,
    Stack,
} from "@chakra-ui/react";
import {
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerRoot,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    AttackTurnState,
    ContinentName,
    DeployTurnState,
    FortifyTurnState,
    GameEvent,
    NewAction,
    TurnState
} from "@/game";
import React from "react";
import {ClientGame} from "@/game/client-game";
import {formatDateShort} from "@/components/dates";
import {cardName, CONTINENT_META, territoryName} from "@/game/meta";
import {ArrowRightIcon, MenuIcon} from "@/components/icons";
import {MenuItem} from "@/components/ui/menu";
import {Link} from "@/components/next/link";

export function GameMenu() {
    const { data: game, mutate } = useGame()
    if (!game) {
        return <></>
    }

    const turn = game.playerTurn

    async function onAction(action: NewAction) {
        await mutate(g => g?.update(action))
    }

    return <Stack direction="row" alignItems="center">
        <Flex alignItems="center" gap={1}>
            <EventsDrawer game={game} mr={2} />
            <Box h={6} px={1} bg={playerColor(turn.playerOrdinal)}></Box>
            <Heading size="sm" textTransform="uppercase">{turn.phase}</Heading>
        </Flex>
        {game.isMyTurn ? (<>
            <Text mx={3}>|</Text>
            <TurnControls turn={turn} onAction={onAction} />
        </>) : <></>}
    </Stack>
}

export function GameUserMenuItems() {
    // const { data: game } = useGame()
    // if (!game) {
    //     return <></>
    // }
    return (
        <>
            <MenuItem value="switch_game" asChild>
                <Link href="/" variant="plain" _hover={{ textDecoration: 'none' }}>Games</Link>
            </MenuItem>
        </>
    )
}

function EventsDrawer({ game, ...props }: { game: ClientGame } & Omit<IconButtonProps, 'aria-label'>) {
    return (
        <DrawerRoot placement="start">
            <DrawerBackdrop />
            <DrawerTrigger asChild>
                <IconButton {...props} variant="ghost">
                    <MenuIcon />
                </IconButton>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader></DrawerHeader>
                <DrawerBody>
                    {game.events.toReversed()
                        // event types ending in "_outcome" are a subset of their actions
                        .filter(({type}) => type !== 'attack' && type !== 'occupy' && type !== 'end_phase')
                        .slice(0, 20)
                        .map((event, i) => <GameEventSummary key={`event-${i}}`} event={event}  id={i}/>)}
                </DrawerBody>
                <DrawerCloseTrigger />
            </DrawerContent>
        </DrawerRoot>
    )
}

function playerColor(playerOrdinal: number | null) {
    switch (playerOrdinal) {
        case null:
            return 'grey'
        case 1:
            return 'red'
        default:
            return 'blue'
    }
}

function GameEventSummary({ id, event }: { id: number, event: GameEvent }) {
    return (
        <Card.Root mb={2}>
            <Card.Body>
                <Flex gap={2}>
                    <Box px={1} bg={playerColor(event.playerOrdinal)}></Box>
                    <Box>
                        <Text>{formatDateShort(event.date)}</Text>
                        <GameEventBody id={id} event={event} />
                    </Box>
                </Flex>
            </Card.Body>
        </Card.Root>
    )
}

function armies(count: number): string {
    if (count === 1) return "1 army"
    else return `${count} armies`
}

function territories(count: number): string {
    if (count === 1) return "1 territory"
    else return `${count} territories`
}

function GameEventBody({ id, event }: { id: number, event: GameEvent }) {
    switch (event.type) {
        case "deploy":
            return (
                <>
                    <Text>Deployed {armies(event.armies)} to {territoryName(event.territory)}</Text>
                </>
            )
        case "attack_outcome":
            const attackingColor = playerColor(event.playerOrdinal)
            const defendingColor = playerColor(event.defendingPlayerOrdinal)
            return (
                <>
                    <Text>Attacked {territoryName(event.territoryTo)} from {territoryName(event.territoryFrom)}</Text>
                    <Text>
                        Dice&nbsp;
                        {event.attackingDice
                            .map((roll, i) => (
                                <Badge key={`attack-dice-${i}`} mr={1} colorPalette={attackingColor}>{roll}</Badge>
                            ))}
                        {event.defendingDice
                            .map((roll, i) => (
                                <Badge key={`defend-dice-${i}`} mr={1} colorPalette={defendingColor}>{roll}</Badge>
                            ))}
                    </Text>
                    <Text>
                        Losses&nbsp;
                        <Badge mr={1} colorPalette={attackingColor}>{event.attackerLosses * -1}</Badge>
                        <Badge mr={1} colorPalette={defendingColor}>{event.defenderLosses * -1}</Badge>
                    </Text>
                </>
            )
        case "occupy_outcome":
            return (
                <>
                    <Text>Occupied {territoryName(event.territory)} with {armies(event.armies)}</Text>
                </>
            )
        case "fortify":
            return (
                <>
                    <Text>Fortified {territoryName(event.territoryFrom)} with {armies(event.armies)} from {territoryName(event.territoryTo)}</Text>
                </>
            )
        case "turn_in_cards":
            return (
                <>
                    <Text>
                        Turned in cards&nbsp;
                        {event.cards.map(card =>
                            <Badge key={card} mr={1} colorPalette={playerColor(event.playerOrdinal)}>{cardName(card)}</Badge>)}
                    </Text>
                </>
            )
        case "draft":
            return (
                <>
                    <Text>Drafted {armies(event.armies)}</Text>
                    <Text>Occupied {territories(event.territories)}</Text>
                </>
            )
        case "deployment":
            const badgeColor = playerColor(event.playerOrdinal)
            return (
                <>
                    <Text>Deployment</Text>
                    <Text>
                        <Badge mr={1} colorPalette={badgeColor}>+{event.territoryBonus}</Badge>
                        {territories(event.territoriesOccupied)} occupied
                    </Text>
                    {
                        Object.entries(event.continentBonuses)
                            .filter(([,armies]) => armies > 0)
                            .map(([continent, armies]) => (
                                <Text key={`event-${id}-${continent}-bonus`}>
                                    <Badge mr={1} colorPalette={badgeColor}>+{armies}</Badge>
                                    {CONTINENT_META[continent as ContinentName].name}
                                </Text>
                            ))
                    }
                </>
            )
        case "end_phase":
        case "occupy":
        case "attack":
            // handled by *_outcome events
            return <></>
    }
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
            {turn.armiesRemaining > 0
                ? (
                    <Box>
                      <Text>{turn.armiesRemaining} Armies Remaining</Text>
                    </Box>
                )
                : <></>}
            <Button size="sm"
                    variant="outline"
                    colorScheme={turn.armiesRemaining > 0 ? 'grey' : 'orange'}
                    onClick={() => onAction({ type: 'end_phase' })}
                    ml={3}>
                <ArrowRightIcon /> Start Attack
            </Button>
        </>
    )
}

function AttackControls({ turn, onAction }: TurnProps<AttackTurnState>) {
    return (
        <>
            <Button size="sm"
                    variant="outline"
                    colorScheme={turn.territoryCaptured ? 'grey' : 'orange'}
                    onClick={() => onAction({ type: 'end_phase' })}>
                <ArrowRightIcon /> End Attack
            </Button>
        </>
    )
}

function FortifyControls({ turn, onAction }: TurnProps<FortifyTurnState>) {
    return (
        <>
            <Button size="sm"
                    variant="outline"
                    onClick={() => onAction({ type: 'end_phase' })}>
                <ArrowRightIcon /> End Turn
            </Button>
        </>
    )
}