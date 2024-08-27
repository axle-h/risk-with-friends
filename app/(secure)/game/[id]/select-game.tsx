'use client'

import {useGame, useSelectGame} from "@/state/hooks";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export function SelectGame(props: { id: string }) {
    const onSelectGame = useSelectGame()
    const { data: game, isLoading } = useGame()
    const router = useRouter()

    const selectId = parseInt(props.id, 10)

    useEffect(() => {
        if (!selectId || isNaN(selectId)) {
            router.replace('/')
            return
        }

        if (isLoading) {
            return
        }
        if (game?.id !== selectId) {
            onSelectGame(selectId).then(game => {
                if (!game) {
                    router.replace('/')
                }
            })
        }
    }, [router, isLoading, game, selectId, onSelectGame]);

    return <></>
}