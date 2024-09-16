'use client'

import './territories.css'
import * as React from "react";
import {META, Point} from "@/game/meta";
import {useGame} from "@/state/hooks";
import {AttackTurnState, DeployTurnState, FortifyTurnState, TerritoryName, TerritoryState, TurnState} from "@/game";
import {useEffect, useState} from "react";

export function GameTerritories() {
    const { data: game, mutate } = useGame()

    if (!game) {
        return <></>
    }

    function allowSelect(name: TerritoryName) {
        return game?.allowSelect(name) === true
    }

    async function onSelect(name: TerritoryName) {
        await mutate(g => g?.selectTerritory(name))
    }

    async function onDeploy(armies: number) {
        await mutate(g => g?.provisionallyDeployArmies(armies))
    }

    const { playerTurn: turn, selectedTerritory: selectedTerritoryName } = game
    const territories = Object.fromEntries(
        Object.entries(game.territories).map(([key, territory]) => {
            const name = key as TerritoryName
            const path = <TerritoryPath
                key={key}
                name={name}
                territory={territory}
                selected={name === selectedTerritoryName}
                turn={turn}
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

        const { continent } = META[selectedTerritoryName]
        const continentOverflowBorder = Object.values(META)
            .filter(m => m.continent === continent)
            .flatMap(m => m.borders)
            .find(b => typeof b !== 'string')

        if (continentOverflowBorder) {
            const { name, overflowOffset } = continentOverflowBorder
            overflowTerritory = (
                <TerritoryPath
                    name={name}
                    overflowOffset={overflowOffset}
                    territory={game.territories[name]}
                    selected={false}
                    turn={turn}
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
            {selectedTerritoryName && turn
                ? <TurnUI territory={selectedTerritoryName} turn={turn} onDeploy={onDeploy} />
                : <></>}
        </>
    )
}

interface TerritoryPathProps {
    name: TerritoryName
    overflowOffset?: Point
    territory: TerritoryState
    selected: boolean
    turn: TurnState | null
    allowSelect(): boolean
    onSelect(): Promise<void>
}

function TerritoryPath({ name, overflowOffset, territory, selected, turn, allowSelect, onSelect }: TerritoryPathProps) {
    const meta = META[name]
    let armies = territory.owner ? territory.armies : 0

    if (turn?.phase === 'deploy' && turn.provisional?.territory === name) {
        armies += turn.provisional.armies
    }

    const [cx, cy] = meta.centre
    return (
        <g className={`territory${selected ? ' selected' : ''}${overflowOffset ? ' overflow' : ''}`}
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

interface TurnUIProps<State = TurnState> {
    territory: TerritoryName
    turn: State
    onDeploy(armies: number): void
}

function TurnUI(props: TurnUIProps) {
    switch (props.turn.phase) {
        case "deploy":
            return props.turn.selected === props.territory ? <DeployUI  {...props} turn={props.turn} /> : <></>
        case "attack":
            return <AttackUI {...props} turn={props.turn} />
        case "fortify":
            return <FortifyUI {...props} turn={props.turn} />
    }
}

function DeployUI({ territory, turn, onDeploy }: TurnUIProps<DeployTurnState>) {
    const [toDeploy, setToDeploy] = useState(turn.armiesRemaining)
    useEffect(() => {
        onDeploy(toDeploy)
    }, [toDeploy]);

    function deploy(e: React.MouseEvent<SVGGElement>, delta: number) {
        e.stopPropagation()
        const next = toDeploy + delta
        if (next >= 0 && next <= turn.armiesRemaining) {
            setToDeploy(next)
        }
    }

    const { centre: [x, y] } = META[territory]
    const WIDTH = 200
    const HEIGHT = 40

    const BUTTON_WIDTH = WIDTH / 4
    const BUTTON_HEIGHT = HEIGHT / 3

    const MARGIN = 5

    return (
        <g transform={`translate(${x - WIDTH / 2}, ${y + 50})`} className="deploy-ui">
            <g onClick={e => e.stopPropagation()}>
                <rect x={0} y={0} width={WIDTH} height={HEIGHT} rx={HEIGHT / 2} fill="black" fillOpacity={0.7}/>
            </g>

            <g onClick={e => deploy(e, -1)} className="button">
                <circle cx={HEIGHT / 2} cy={HEIGHT / 2} r={HEIGHT / 2} fill="red" stroke="black" strokeOpacity="0.5" />
                <text x={HEIGHT / 2} y={HEIGHT / 2} dy="0.3em" textAnchor="middle" fontSize="1em" stroke="white" fill="white">
                    -
                </text>
            </g>

            <g onClick={e => e.stopPropagation()}>
                <text x={WIDTH / 2} y={(HEIGHT - MARGIN - BUTTON_HEIGHT) / 2} dy="0.3em" textAnchor="middle" fontSize="0.6em" stroke="white" fill="white">
                    + {toDeploy}
                </text>
            </g>

            <g onClick={e => deploy(e, 1)} className="button">
                <circle cx={WIDTH - HEIGHT / 2} cy={HEIGHT / 2} r={HEIGHT / 2} fill="green" stroke="black" strokeOpacity="0.5" />
                <text x={WIDTH - HEIGHT / 2} y={HEIGHT / 2} dy="0.3em" textAnchor="middle" fontSize="1em" stroke="white" fill="white">
                    +
                </text>
            </g>

            <g className="button">
                <rect x={WIDTH / 2 - BUTTON_WIDTH / 2} y={HEIGHT - MARGIN - BUTTON_HEIGHT} width={BUTTON_WIDTH} height={BUTTON_HEIGHT} rx={BUTTON_HEIGHT / 2} fill="orange" />
                <text x={WIDTH / 2} y={HEIGHT - MARGIN - BUTTON_HEIGHT / 2} dy="0.3em" textAnchor="middle" fontSize="0.5em" stroke="white" fill="white">OK</text>
            </g>
        </g>
    )
}

function AttackUI({turn}: TurnUIProps<AttackTurnState>) {
    return <></>
}

function FortifyUI({turn}:TurnUIProps<FortifyTurnState>) {
    return <></>
}