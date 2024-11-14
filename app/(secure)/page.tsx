'use client'

import {
    Box,
    Heading,
    Card,
    Flex,
    Stack, Button, Container, HStack, Text
} from "@chakra-ui/react"
import {useCreateGame, useGameList} from "@/state/hooks"
import {ErrorAlert, Loading, NoData} from "@/components/alert"
import {Avatar} from "@/components/ui/avatar"
import {GameSummary} from "@/game"
import {formatDateLong} from "@/components/dates"
import {useRouter} from "next/navigation"
import {PlusIcon} from "@/components/icons";

export default function HomePage() {
    return <GameList />
}

function GameList() {
    const { data: games, isLoading, error } = useGameList()

    const onCreateGame = useCreateGame()

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <ErrorAlert error={error} />
    }

    if (!games) {
        return <NoData />
    }

    return (
        <>
            <Container py={6}>
                <Button mb={3} variant="outline" colorScheme="green" onClick={async () => {
                    await onCreateGame({ opponent: 'kathryn' })
                }}>
                    <PlusIcon /> New Game
                </Button>
                <Stack gap={3}>
                    {games.map(game => <GameCard key={game.id} game={game} />)}
                </Stack>
            </Container>

        </>
    )
}


function GameCard({ game }: { game: GameSummary }) {
    const router = useRouter()
    const opponent = game.opponents[0] // assume one opponent for now
    return (
        <Card.Root maxW='md' cursor="pointer" onClick={() => router.push(`/game/${game.id}`)}>
            <Card.Body>
                <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                    <HStack gap={1}>
                        <Avatar name={opponent.displayName} />
                    </HStack>
                    <Box>
                        <Heading mb={1} size='sm'>
                            {opponent.displayName}
                        </Heading>
                        <Text>Started {formatDateLong(game.dateStarted)}</Text>
                        <Text>{game.status}</Text>
                    </Box>
                </Flex>
            </Card.Body>
        </Card.Root>
    )
}
