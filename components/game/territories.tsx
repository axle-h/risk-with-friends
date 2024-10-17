'use client'

import './territories.css'
import * as React from "react";
import {META, OverflowingBorder, Point} from "@/game/meta";
import {useGame} from "@/state/hooks";
import {
    AttackTurnState,
    DeployTurnState,
    FortifyTurnState,
    NewAction,
    TerritoryName,
    TerritoryState,
    TurnState
} from "@/game";
import {SVGLineElementAttributes, useEffect, useState} from "react";
import {DiceVector} from "@/components/game/dice";

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

    async function onAction(action: NewAction) {
        await mutate(g => g?.update(action))
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
    if (selectedTerritoryName) {
        selectedTerritory = territories[selectedTerritoryName]
        delete territories[selectedTerritoryName]
    }

    const overflowTerritories = Object.values(META)
        .flatMap(m => m.borders)
        .filter(b => typeof b !== 'string')
        .map(border => {
            const { name, overflowOffset } = border
            return <TerritoryPath
                key={`overflow-${name}`}
                name={name}
                overflowOffset={overflowOffset}
                territory={game.territories[name]}
                selected={false}
                turn={turn}
                allowSelect={() => allowSelect(name)}
                onSelect={() => onSelect(name)}
            />
        })

    return (
        <>
            {Object.values(territories)}
            {overflowTerritories}
            {selectedTerritory || <></>}
            {selectedTerritoryName && turn
                ? <TurnUI territory={selectedTerritoryName} turn={turn} onAction={onAction} />
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

    if (turn?.phase === 'deploy' && turn.selected?.territory === name) {
        armies += turn.selected.armies
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
                id={name + (overflowOffset ? '-overflow' : '')}
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
    onAction(action: NewAction): void
}

function TurnUI({ turn, ...props }: TurnUIProps) {
    switch (turn.phase) {
        case "deploy":
            return turn.selected?.territory === props.territory && turn.armiesRemaining > 0
                ? <DeployUI  {...props} turn={turn} />
                : <></>
        case "attack":
            return turn.selected?.territoryFrom === props.territory
                ? <AttackUI {...props} turn={turn} />
                : <></>
        case "fortify":
            return <FortifyUI {...props} turn={turn} />
    }
}

function DeployUI({ territory, turn, onAction }: TurnUIProps<DeployTurnState>) {
    const [toDeploy, setToDeploy] = useState(turn.armiesRemaining)

    function deploy(e: React.MouseEvent<SVGGElement>, delta: number) {
        e.stopPropagation()
        const next = toDeploy + delta
        if (next >= 0 && next <= turn.armiesRemaining) {
            setToDeploy(next)
        }
    }

    function ok(e: React.MouseEvent<SVGGElement>) {
        e.stopPropagation()
        onAction({ type: 'deploy', armies: toDeploy, territory })
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

            <g onClick={ok} className="button">
                <rect x={WIDTH / 2 - BUTTON_WIDTH / 2} y={HEIGHT - MARGIN - BUTTON_HEIGHT} width={BUTTON_WIDTH} height={BUTTON_HEIGHT} rx={BUTTON_HEIGHT / 2} fill="orange" />
                <text x={WIDTH / 2} y={HEIGHT - MARGIN - BUTTON_HEIGHT / 2} dy="0.3em" textAnchor="middle" fontSize="0.5em" stroke="white" fill="white">OK</text>
            </g>
        </g>
    )
}

const ARROW_COLOR = "orange"
function AttackUI({territory, turn}: TurnUIProps<AttackTurnState>) {
    if (!turn.selected || turn.selected.adjacentUnoccupiedTerritories.length === 0 || turn.selected.availableAttacking === 0) {
        return <></>
    }

    const { adjacentUnoccupiedTerritories, territoryTo } = turn.selected
    const { centre: [cx, cy] } = META[territory]
    const arrows = adjacentUnoccupiedTerritories
        .filter(t => !territoryTo || territoryTo === t)
        .map(t => {
            let { centre: [x2, y2], borders } = META[t]

            const border = borders.find(b => typeof b !== 'string' && b.name === territory)
            if (border) {
                const [dx, dy] = (border as OverflowingBorder).overflowOffset
                x2 -= dx
                y2 -= dy
            }

            return <ShortenedLine
                key={`attack_${t}`}
                x1={cx} y1={cy}
                x2={x2} y2={y2}
                stroke={ARROW_COLOR}
                strokeWidth={2.0}
                markerEnd="url(#arrow)"
            />
        })

    return (
        <g onClick={e => e.stopPropagation()}>
            <defs>
                <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    stroke={ARROW_COLOR}
                    fill={ARROW_COLOR}
                    orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z"/>
                </marker>
            </defs>
            {arrows}
            {territoryTo ? <AttackConfirm territoryFrom={territory} territoryTo={territoryTo} maxDice={turn.selected.availableAttacking} /> : <></>}
        </g>
    )
}

function AttackConfirm({territoryFrom, territoryTo, maxDice}: { territoryFrom: TerritoryName, territoryTo: TerritoryName, maxDice: number }) {
    const [dice, setDice] = useState(maxDice)
    const { centre: [, fromY] } = META[territoryFrom]
    const { centre: [, toY] } = META[territoryTo]
    const lowestTerritory = toY > fromY ? territoryTo : territoryFrom
    const { centre: [x, y] } = META[lowestTerritory]
    const WIDTH = 200
    const HEIGHT = 40
    const BUTTON_WIDTH = WIDTH / 4
    const BUTTON_HEIGHT = HEIGHT / 3
    const MARGIN = 5
    const DICE_SIZE = 20

    function chooseDice(e: React.MouseEvent<SVGGElement>, delta: number) {
        e.stopPropagation()
        const next = dice + delta
        if (next > 0 && next <= maxDice) {
            setDice(next)
        }
    }

    return (
        <g transform={`translate(${x - WIDTH / 2}, ${y + 50})`} className="attack-confirm-ui">
            <g onClick={e => e.stopPropagation()}>
                <rect x={0} y={0} width={WIDTH} height={HEIGHT} rx={HEIGHT / 2} fill="black" fillOpacity={0.7}/>
            </g>

            <g onClick={e => chooseDice(e, -1)} className="button">
                <circle cx={HEIGHT / 2} cy={HEIGHT / 2} r={HEIGHT / 2} fill="red" stroke="black" strokeOpacity="0.5"/>
                <text x={HEIGHT / 2} y={HEIGHT / 2} dy="0.3em" textAnchor="middle" fontSize="1em" stroke="white"
                      fill="white">
                    -
                </text>
            </g>

            <g onClick={e => e.stopPropagation()}>
                {/*<text x={WIDTH / 2} y={(HEIGHT - MARGIN - BUTTON_HEIGHT) / 2} dy="0.3em" textAnchor="middle"*/}
                {/*      fontSize="0.6em" stroke="white" fill="white">*/}
                {/*    {dice} dice*/}
                {/*</text>*/}

                <DiceVector width={DICE_SIZE} height={DICE_SIZE} x={(WIDTH - DICE_SIZE) / 2} y={(HEIGHT - MARGIN - BUTTON_HEIGHT) / 2} />
            </g>

            <g onClick={e => chooseDice(e, 1)} className="button">
                <circle cx={WIDTH - HEIGHT / 2} cy={HEIGHT / 2} r={HEIGHT / 2} fill="green" stroke="black"
                        strokeOpacity="0.5"/>
                <text x={WIDTH - HEIGHT / 2} y={HEIGHT / 2} dy="0.3em" textAnchor="middle" fontSize="1em" stroke="white"
                      fill="white">
                    +
                </text>
            </g>
        </g>
    )
}

interface ShortenedLineProps extends SVGLineElementAttributes<SVGLineElement> {
    x1: number
    y1: number
    x2: number
    y2: number
    shortenBy?: number
}

const SHORTEN_BY = 15

function ShortenedLine({x1, y1, x2, y2, shortenBy = SHORTEN_BY, ...props}: ShortenedLineProps) {
    const dx = x2 - x1
    const dy = y2 - y1
    const angle = Math.atan2(dy, dx)

    const xFactor = Math.cos(angle)
    const yFactor = Math.sin(angle)

    x1 += shortenBy * xFactor
    y1 += shortenBy * yFactor
    x2 -= shortenBy * xFactor
    y2 -= shortenBy * yFactor

    return (
        <line x1={x1} y1={y1} x2={x2} y2={y2} {...props} />
    );
}

function FortifyUI({turn}: TurnUIProps<FortifyTurnState>) {
    return <></>
}