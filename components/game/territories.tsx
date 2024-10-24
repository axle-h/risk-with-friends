'use client'

import './territories.css'
import * as React from "react";
import {META, OverflowingBorder, Point} from "@/game/meta";
import {useGame} from "@/state/hooks";
import {
    AttackTurnState,
    DeployTurnState,
    FortifyTurnState,
    NewAction, OccupyTurnState,
    TerritoryName,
    TerritoryState,
    TurnState
} from "@/game";
import {ReactNode, SVGLineElementAttributes, useEffect, useState} from "react";
import {DiceGroup, DiceVector} from "@/components/game/dice";
import {KeyedMutator} from "swr";
import {ClientGame} from "@/game/client-game";
import {getCurrentViewBox} from "@/components/game/view-box";

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

    const { playerTurn: turn, selectedTerritories: selectedTerritoryNames } = game
    const territories = Object.fromEntries(
        Object.keys(META).map(key => {
            const name = key as TerritoryName
            const path = <TerritoryPath
                key={key}
                name={name}
                territory={game.territory(name)}
                selected={selectedTerritoryNames.includes(name)}
                allowSelect={() => allowSelect(name)}
                onSelect={() => onSelect(name)}
            />
            return [name, path] as const
        })
    ) as Record<TerritoryName, React.JSX.Element>

    // render selected territory last so it's on top in the z-axis
    let selectedTerritories: React.JSX.Element[] = []
    for (let selectedTerritoryName of selectedTerritoryNames) {
        selectedTerritories.push(territories[selectedTerritoryName])
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
                territory={game.territory(name)}
                selected={false}
                allowSelect={() => allowSelect(name)}
                onSelect={() => onSelect(name)}
            />
        })

    return (
        <>
            <TerritoryArrowDefs />
            {Object.values(territories)}
            {overflowTerritories}
            {selectedTerritories}
            {selectedTerritoryNames.length > 0 && turn
                ? <TurnUI territory={selectedTerritoryNames[0]} game={game} turn={turn} mutate={mutate} />
                : <></>}
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

function TerritoryPath({name, overflowOffset, territory, selected, allowSelect, onSelect}: TerritoryPathProps) {
    const meta = META[name]
    let armies = territory.owner ? territory.armies : 0

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
    game: ClientGame
    mutate: KeyedMutator<ClientGame | null>
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
        case "occupy":
            return <OccupyUI {...props} turn={turn} />
        case "fortify":
            return <FortifyUI {...props} turn={turn} />
        default:
            return <></>
    }
}

function DeployUI({ territory, game, turn, mutate }: TurnUIProps<DeployTurnState>) {
    const toDeploy = turn.selected?.armies || 1
    return (
        <DeltaUI
            onDelta={delta => mutate(g => g?.setDeployment(toDeploy + delta))}
            onOK={() => mutate(g => g?.update({type: 'deploy', armies: toDeploy, territory}))}
            game={game}
        >
            <text dy="0.3em" textAnchor="middle" fontSize="0.6em" stroke="white" fill="white">
                + {toDeploy}
            </text>
        </DeltaUI>
    )
}

const ARROW_FILL = "white"
const ARROW_STROKE = "white"
function AttackUI(props: TurnUIProps<AttackTurnState>) {
    const {territory, turn} = props
    if (!turn.selected || turn.selected.adjacentUnoccupiedTerritories.length === 0 || turn.selected.availableAttacking < 1) {
        return <></>
    }

    const { adjacentUnoccupiedTerritories, territoryTo } = turn.selected
    const arrows = adjacentUnoccupiedTerritories
        .filter(t => !territoryTo || territoryTo === t)
        .map(t => <TerritoryArrow key={`attack_${t}`} territoryFrom={territory} territoryTo={t}/>)

    return (
        <g onClick={e => e.stopPropagation()}>
            {arrows}
            <AttackConfirm {...props} />
        </g>
    )
}

function AttackConfirm({territory, game, turn, mutate}: TurnUIProps<AttackTurnState>) {
    const [dice, setDice] = useState(turn.selected?.availableAttacking || 0)

    if (!turn.selected || turn.selected.availableAttacking < 1 || !turn.selected.territoryTo) {
        return <></>
    }

    const { territoryTo, availableAttacking } = turn.selected
    const DICE_SIZE = 16
    return (
        <DeltaUI
            onDelta={delta => {
                const next = dice + delta
                if (next > 0 && next <= availableAttacking) {
                    setDice(next)
                }
            }}
            onOK={() => mutate(g => g?.update({ type: 'attack', territoryFrom: territory, territoryTo, attackingDice: dice }))}
            game={game}
        >
            <DiceGroup transform={`translate(${-DICE_SIZE * dice / 2},${-DICE_SIZE / 2})`} diceSize={DICE_SIZE} count={dice} />
        </DeltaUI>
    )
}

function TerritoryArrowDefs() {
    return (
        <defs>
            <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                stroke={ARROW_STROKE}
                fill={ARROW_FILL}
                orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z"/>
            </marker>
        </defs>
    )
}

function TerritoryArrow({territoryFrom, territoryTo}: { territoryFrom: TerritoryName, territoryTo: TerritoryName }) {
    const {centre: [cx, cy]} = META[territoryFrom]
    let {centre: [x2, y2], borders} = META[territoryTo]
    const border = borders.find(b => typeof b !== 'string' && b.name === territoryFrom)
    if (border) {
        const [dx, dy] = (border as OverflowingBorder).overflowOffset
        x2 -= dx
        y2 -= dy
    }

    return <ShortenedLine
        x1={cx} y1={cy}
        x2={x2} y2={y2}
        stroke={ARROW_STROKE}
        fill={ARROW_FILL}
        strokeWidth={2.0}
        markerEnd="url(#arrow)"
    />
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

function OccupyUI({game, turn, mutate}: TurnUIProps<OccupyTurnState>) {
    return (
        <>
            <TerritoryArrow territoryFrom={turn.territoryFrom} territoryTo={turn.territoryTo}/>
            <DeltaUI
                onDelta={delta => mutate(g => g?.setOccupy(turn.selectedArmies + delta))}
                onOK={() => mutate(g => g?.update({type: 'occupy', armies: turn.selectedArmies}))}
                game={game}
            >
                <text dy="0.3em" textAnchor="middle" fontSize="0.6em" stroke="white" fill="white">
                    + {turn.selectedArmies}
                </text>
            </DeltaUI>
        </>
    )
}

function FortifyUI({turn, game, mutate}: TurnUIProps<FortifyTurnState>) {
    if (!turn.selected || turn.selected.route === null) {
        return <></>
    }

    const arrows = []
    for (let i = 0; i < turn.selected.route.length - 1; i++) {
        arrows.push(
            <TerritoryArrow key={`fortify-arrow-${i}`} territoryFrom={turn.selected.route[i]} territoryTo={turn.selected.route[i + 1]} />
        )
    }

    const { armies, route } = turn.selected

    return (
        <>
            {arrows}
            <DeltaUI
                game={game}
                onDelta={delta => mutate(g => g?.setFortify(armies + delta))}
                onOK={() => mutate(g => g?.update({
                    type: 'fortify',
                    armies,
                    territoryFrom: route[0],
                    territoryTo: route[route.length - 1]
                }))}
            >
                <text dy="0.3em" textAnchor="middle" fontSize="0.6em" stroke="white" fill="white">
                    + {turn.selected.armies}
                </text>
            </DeltaUI>
        </>
    )
}

interface DeltaUIProps {
    game: ClientGame
    children?: ReactNode

    onDelta(delta: number): any | Promise<any>

    onOK(): any | Promise<any>
}

function DeltaUI({ game, onDelta, onOK, children }: DeltaUIProps) {
    const [vx, vy, vw, vh] = getCurrentViewBox(game)
    const WIDTH = 200
    const HEIGHT = 40
    const BUTTON_WIDTH = WIDTH / 4
    const BUTTON_HEIGHT = HEIGHT / 3
    const MARGIN = 5

    const x = vx + (vw / 2) - WIDTH / 2
    const y = vy + vh - 2 * HEIGHT

    function delta(e: React.MouseEvent<SVGGElement>, delta: number) {
        e.stopPropagation()
        return onDelta(delta)
    }

    function ok(e: React.MouseEvent<SVGGElement>,) {
        e.stopPropagation()
        return onOK()
    }

    return (
        <g transform={`translate(${x}, ${y})`} className="ui">
            <g onClick={e => e.stopPropagation()}>
                <rect x={0} y={0} width={WIDTH} height={HEIGHT} rx={HEIGHT / 2} fill="black" fillOpacity={0.7}/>
            </g>

            <g onClick={e => delta(e, -1)} className="button">
                <circle cx={HEIGHT / 2} cy={HEIGHT / 2} r={HEIGHT / 2} fill="red" stroke="black"
                        strokeOpacity="0.5"/>
                <text x={HEIGHT / 2} y={HEIGHT / 2} dy="0.3em" textAnchor="middle" fontSize="1em" stroke="white"
                      fill="white">
                    -
                </text>
            </g>

            <g onClick={e => e.stopPropagation()} transform={`translate(${WIDTH / 2}, ${(HEIGHT - MARGIN - BUTTON_HEIGHT) / 2})`}>
                {children}
            </g>

            <g onClick={e => delta(e, 1)} className="button">
                <circle cx={WIDTH - HEIGHT / 2} cy={HEIGHT / 2} r={HEIGHT / 2} fill="green" stroke="black"
                        strokeOpacity="0.5"/>
                <text x={WIDTH - HEIGHT / 2} y={HEIGHT / 2} dy="0.3em" textAnchor="middle" fontSize="1em"
                      stroke="white" fill="white">
                    +
                </text>
            </g>

            <g onClick={ok} className="button">
                <rect x={WIDTH / 2 - BUTTON_WIDTH / 2} y={HEIGHT - MARGIN - BUTTON_HEIGHT} width={BUTTON_WIDTH}
                      height={BUTTON_HEIGHT} rx={BUTTON_HEIGHT / 2} fill="orange"/>
                <text x={WIDTH / 2} y={HEIGHT - MARGIN - BUTTON_HEIGHT / 2} dy="0.3em" textAnchor="middle"
                      fontSize="0.5em" stroke="white" fill="white">OK
                </text>
            </g>
        </g>
    )
}