'use client'

import {
    Box,
    Heading,
    Card,
    CardBody,
    Flex,
    Avatar,
    Stack, Button, Container, HStack, Text
} from "@chakra-ui/react"
import {useCreateGame, useGameList, useSelectGame} from "@/state/hooks";
import {ErrorAlert, Loading, NoData} from "@/components/alert";
import {GameSummary} from "@/game";
import {AddIcon} from "@chakra-ui/icons";
import {formatDateLong} from "@/components/dates";
import {useRouter} from "next/navigation";

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
                <Button mb={3} leftIcon={<AddIcon />} variant="outline" colorScheme="green" onClick={async () => {
                    await onCreateGame({ opponent: 'kathryn' })
                }}>
                    New Game
                </Button>
                <Stack spacing={3}>
                    {games.map(game => <GameCard key={game.id} game={game} />)}
                </Stack>
            </Container>

        </>
    )
}


function GameCard({ game }: { game: GameSummary }) {
    const router = useRouter()
    return (
        <Card maxW='md' cursor="pointer" onClick={() => router.push(`/game/${game.id}`)}>
            <CardBody>
                <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                    <HStack spacing={1}>
                        <Avatar name={game.opponent.displayName} />
                    </HStack>
                    <Box>
                        <Heading mb={1} size='sm'>
                            {game.opponent.displayName}
                        </Heading>
                        <Text>Started {formatDateLong(game.dateStarted)}</Text>
                        <Text>{game.turnNumber} turn{game.turnNumber === 1 ? '' : 's'} played</Text>
                    </Box>
                </Flex>
            </CardBody>
        </Card>
    )
}
