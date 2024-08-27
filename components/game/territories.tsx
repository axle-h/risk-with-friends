'use client'

import './territories.css'
import * as React from "react";
import {META, Point} from "@/game/meta";
import {useGame} from "@/state/hooks";
import {TerritoryName, TerritoryState} from "@/game";

export function GameTerritories() {
    const { data: game, mutate } = useGame()

    if (!game) {
        return <></>
    }

    function allowSelect(name: TerritoryName) {
        return game?.allowSelect(name) === true
    }

    async function onSelect(name: TerritoryName) {
        console.log(name)
        await mutate(g => g?.selectTerritory(name))
    }

    const selectedTerritoryName = game.selectedTerritory
    const territories = Object.fromEntries(
        Object.entries(game.territories).map(([key, territory]) => {
            const name = key as TerritoryName
            const path = <TerritoryPath
                key={key}
                name={name}
                territory={territory}
                selected={name === selectedTerritoryName}
                allowSelect={() => allowSelect(name)}
                onSelect={() => onSelect(name)}
            />
            return [name, path] as const
        })
    ) as Record<TerritoryName, React.JSX.Element>

    // render selected territory last so it's on top in the z-axis
    let selectedTerritory: React.JSX.Element | null = null
    let overflowTerritory: React.JSX.Element | null = null
    if (selectedTerritoryName) {
        selectedTerritory = territories[selectedTerritoryName]
        delete territories[selectedTerritoryName]
        const { borders } = META[selectedTerritoryName]
        const overflowBorder = borders.find(b => typeof b !== 'string')

        if (overflowBorder) {
            const { name, overflowOffset } = overflowBorder
            overflowTerritory = (
                <TerritoryPath
                    name={name}
                    overflowOffset={overflowOffset}
                    territory={game.territories[name]}
                    selected={false}
                    allowSelect={() => allowSelect(name)}
                    onSelect={() => onSelect(name)}
                />
            )
        }
    }


    return (
        <>
            {Object.values(territories)}
            {overflowTerritory || <></>}
            {selectedTerritory || <></>}
        </>
    )
}

interface TerritoryPathProps {
    name: TerritoryName
    overflowOffset?: Point
    territory: TerritoryState
    selected: boolean
    allowSelect(): boolean
    onSelect(): Promise<void>
}

function TerritoryPath({ name, overflowOffset, territory, selected, allowSelect, onSelect }: TerritoryPathProps) {
    const meta = META[name]
    const armies = territory.owner ? territory.armies : 0

    const [cx, cy] = meta.centre
    return (
        <g className={`territory${selected ? ' selected' : ''}`}
           style={{
               transform: overflowOffset ? `translate(${overflowOffset[0]}px, ${overflowOffset[1]}px)` : undefined
           }}
           onClick={async e => {
               if (!allowSelect()) {
                   return
               }
               e.stopPropagation()
               await onSelect()
           }}>
            <path
                id={name + overflowOffset ? '-overflow' : ''}
                d={meta.path}
                className={territory.owner !== null ? `player${territory.owner}` : 'unoccupied'}
            />
            {armies > 0 ? (
                <>
                    <circle cx={cx} cy={cy} r="0.5em" fill="white" opacity={1} stroke="black" strokeWidth="1"/>
                    <text x={cx} y={cy} dy="0.3em" textAnchor="middle" fontSize="0.5em">
                        {armies}
                    </text>
                </>
            ) : <></>}
        </g>
    )
}