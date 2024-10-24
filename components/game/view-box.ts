import {META, TerritoryMeta} from "@/game/meta";
import {Route} from "@/game/route";
import {ClientGame} from "@/game/client-game";

export type ViewBox = [number, number, number, number]

const TERRITORY_VIEW_MARGIN = 150
const VIEW_WIDTH = 737
const VIEW_HEIGHT = 520
const VIEW_ASPECT_RATIO = VIEW_WIDTH / VIEW_HEIGHT
export const DEFAULT_VIEW_BOX: ViewBox = [0, 0, VIEW_WIDTH, VIEW_HEIGHT]

export function getCurrentViewBox(game: ClientGame | null) {
    if (!game || !game.isMyTurn) {
        return DEFAULT_VIEW_BOX
    }
    const turn = game.playerTurn
    const viewBox = turn.phase !== 'fortify' || turn.selected?.route
        ? getRouteViewBox(game.selectedTerritories)
        : null
    return viewBox || DEFAULT_VIEW_BOX
}

export function getTerritoryViewBox(territory: TerritoryMeta): ViewBox {
    const { p: [rawX, rawY], w: rawW, h: rawH } = territory.aabb

    const [w, h] = rawW > rawH ? [rawW, rawW / VIEW_ASPECT_RATIO] : [rawH * VIEW_ASPECT_RATIO, rawH]
    const x = (rawX + rawW / 2) - w / 2
    const y = (rawY + rawH / 2) - h / 2

    return [
        x - TERRITORY_VIEW_MARGIN,
        Math.max(0, y - TERRITORY_VIEW_MARGIN),
        w + TERRITORY_VIEW_MARGIN * 2,
        h + TERRITORY_VIEW_MARGIN * 2
    ] as const
}

export function getRouteViewBox(route: Route): ViewBox | null {
    if (route.length === 0) {
        return null
    }

    if (route.length === 1) {
        return getTerritoryViewBox(META[route[0]])
    }

    const boxes = route.map(t => getTerritoryViewBox(META[t]))
    const x1 = Math.min(...boxes.map(([x]) => x))
    const y1 = Math.min(...boxes.map(([,y]) => y))
    const x2 = Math.max(...boxes.map(([x,,w]) => x + w))
    const y2 = Math.max(...boxes.map(([,y,,h]) => y + h))

    const w = Math.min(x2 - x1, VIEW_WIDTH)
    const h = Math.min(y2 - y1, VIEW_HEIGHT)

    return [x1, y1, w, h]
}

export function viewBoxString([x, y, w, h]: ViewBox): string {
    return `${x} ${y} ${w} ${h}`
}