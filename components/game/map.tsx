'use client'

import * as React from "react"
import {SVGProps, useRef} from "react";
import {GameTerritories} from "@/components/game/territories";
import {useGame} from "@/state/hooks";
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import {META, TerritoryMeta} from "@/game/meta";
import {Box} from "@chakra-ui/react";
import {Loading} from "@/components/alert";
import {Route} from "@/game/route";
import {DEFAULT_VIEW_BOX, getCurrentViewBox, viewBoxString} from "@/components/game/view-box";

gsap.registerPlugin(useGSAP)

export const DEFAULT_TERRITORY_COLOR = '#aabbcc'

export const OCEANA_COLOR = '#000'
export const NORTH_AMERICA_COLOR = '#000'
export const SOUTH_AMERICA_COLOR = '#000'
export const EUROPE_COLOR = '#000'
export const AFRICA_COLOR = '#000'
export const ASIA_COLOR = '#000'

export function GameMap(props: SVGProps<SVGSVGElement>) {
    const { data: game, mutate } = useGame()
    const svg = useRef()
    const viewBox = viewBoxString(getCurrentViewBox(game || null))

    useGSAP(
        () => {
            gsap.to('#map', {
                duration: 1,
                attr: { viewBox: viewBox },
                ease: "power3.inOut"
            })
        },
        { scope: svg, dependencies: [viewBox] }
    )

    if (!game) {
        return <Loading />
    }

    return (
        <Box ref={svg as any} flexGrow={1} height="100%">
            <svg
                id="map"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={viewBoxString(DEFAULT_VIEW_BOX)}
                onClick={() => mutate(g => g?.deSelect())}
                style={{
                    backgroundColor:'lightblue',
                    width: '100%',
                    height: '100%',
                    maxHeight: '100%',
                    fontFamily: 'sans-serif'
                }}
                preserveAspectRatio="xMidYMid meet"
                {...props}
            >
                <g
                    style={{
                        display: "inline",
                    }}
                >
                    <path
                        d="M486.75 253a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: DEFAULT_TERRITORY_COLOR,
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m485.5 253 13-19"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M500 234a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m498.5 234 23.25 13.5"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M523.25 247.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m521.75 247.5-.25 34.25"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1.20000005,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4.8,1.2",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M523 281.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M521.5 281.75 485.25 253"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m485.5 253 36.25-5.25"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M491.75 315.125a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m490.25 315.125-7.5-12.5"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M484.375 302.625a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M564.357 371.313a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m562.857 371.313 1.414 18.208"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M565.948 389.521a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M629.057 431.948a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m627.557 431.594-8.131 12.551"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M620.926 444.145a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M793.813 431.77a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m792.49 431.77 7.425 24.926"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M801.415 456.696a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m799.915 457.05 18.738 4.066"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M477.03 430.533a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m475.53 430.533-25.81 7.425"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M451.22 437.958a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M401.75 179.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m400.25 179.75-15.5 37.5"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M386.25 217.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m400.25 179.5-68 50.25"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M333.75 229.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m400.25 179.5-36.75 8.25"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M365 187.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M473.5 214.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m472 214.5-20.5-17.75"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M453 197a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M824.926 275.854a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m823.426 275.854 22.627 18.738"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M847.553 294.592a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m846.053 294.592-32.173 5.303"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M815.38 299.895a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M824.572 462.883a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m823.072 462.883-.707 47.73"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M823.865 510.613a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m822.365 510.613-11.314-8.485"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M812.5 502.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M838.25 498.625a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M836.75 498.625 823 462.875"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M625.522 498.946a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="m624 499 8.25 45.75"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M633.75 544.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M632.25 544.75 610 560.25"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        d="M611.5 560.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 1 1 3 0z"
                        style={{
                            fill: "#000",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        id="sea-route-kamchatka-alaska"
                        d="M142 216h55"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                    <path
                        id="sea-route-alaska-kamchatka"
                        d="m846 219 67 0"
                        style={{
                            fill: "none",
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 4,
                            strokeDasharray: "4,1",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                        }}
                        transform="translate(-167.997 -118.555)"
                    />
                </g>
                <g
                    style={{
                        opacity: 1,
                        display: "inline",
                    }}
                    transform="translate(-167.997 -118.555)"
                >
                    <path
                        d="M869.741 495.587s1.591-.177 1.768 2.298c.177 2.475.884 4.596.884 5.657 0 1.06.707 4.95.707 4.95s1.238 1.414 1.945.884c.707-.53 1.767-.707 1.767-1.945 0-1.237.354-2.651.708-1.944.353.707 1.414 1.237 1.414 2.298 0 1.06-.177 2.121 0 3.182.177 1.06 1.237 2.121 1.237 2.121s.354 2.121.354 2.828c0 .708.353 1.238 0 3.006-.354 1.767-.354 1.944-.177 3.535.177 1.591.354 2.298 1.06 2.475.708.177.708.177 1.415.177.707 0 .884-.707 1.414.177.53.883.707 1.414 1.945 1.59 1.237.177 2.298 0 2.298 0s.53.884.53 1.945c0 1.06-.177 1.414.177 2.829.353 1.414.353 1.59 1.237 1.767.884.177 1.414.354 1.414.354s.177.884.177 2.298c0 1.414.354 2.298.354 2.298l1.414 1.06s.354.885 1.06 1.769c.708.883 1.415 1.06 1.415 1.06s.53 1.06.707 1.945c.177.884-.354.353.707 1.59 1.06 1.238 1.237 1.592 1.237 2.652 0 1.061.884 1.768.53 3.182-.353 1.415-.176 1.945-.353 3.713-.177 1.767.177-.354-.177 2.651-.353 3.005-.176 3.89-.353 4.95s-.53.177-.707 2.121c-.177 1.945-.354 3.536-.354 3.536s-1.237 1.768-2.121 1.768c-.884 0-2.475-.707-2.475.176 0 .884-.884 1.591.354 1.945 1.237.354 1.59-.707 1.59.53 0 1.238-.353 1.591-1.414 2.475-1.06.884-1.06.707-2.298 1.414-1.237.707-.53-.353-1.414 1.945-.884 2.298-.707 2.298-1.414 3.182-.707.884-.884.884-1.238 1.944-.353 1.061-.353 1.415-.353 2.652 0 1.238-.354 1.768-.354 1.768s-1.414 1.414-1.414 2.652c0 1.237.884 1.767.177 2.651-.707.884 0 .884-1.591 1.06-1.591.178-2.298.178-2.298.178l-2.475.53s-.354-1.06-1.237-.53c-.884.53-.53.353-1.238 1.237-.707.884-.884.884-1.768 1.414-.884.53 0 .707-.53 1.591s-.707 1.768-1.768 1.238c-1.06-.53-1.414-.354-1.768-1.415-.353-1.06.177-1.237-1.59-1.767-1.768-.53-1.945-.53-1.945-.53s-.53.353-.884 1.237c-.354.884.177 1.237-1.06 1.768-1.238.53-1.238 1.06-2.476.176-1.237-.884-.883-1.237-1.59-1.59-.708-.354-.53 0-1.238-.708-.707-.707-2.652-3.358-2.828-4.42-.177-1.06-.707-1.06-.177-2.474.53-1.414.53-2.475-.354-3.005-.884-.53-1.06-.354-1.06-1.414 0-1.061.707-3.182-.177-3.36-.884-.176-.884-.883-1.591.178-.707 1.06-2.475 3.712-2.652 2.298-.177-1.415-.707-1.238.354-2.475 1.06-1.238 1.06-1.414 1.944-2.298.884-.884 1.591-1.238 1.945-2.475.353-1.238 1.59-3.359.353-3.536-1.237-.176-1.944-1.767-2.298.53-.353 2.299.707 2.83-.884 3.36-1.59.53-1.414-.53-2.474 1.06-1.061 1.591-2.299 3.359-2.299 3.359s-.707 0-2.12-2.475c-1.415-2.475-1.592-2.652-1.592-4.066 0-1.414.53-1.59-.353-2.121-.884-.53-1.591-1.768-2.829-1.945-1.237-.177-1.06-.353-3.005-.353h-3.005c-1.945 0-1.945-.53-3.005.53-1.061 1.06-.884 1.414-2.299 1.591-1.414.177-1.767-.177-2.474.53-.707.707-2.475 1.061-3.182 1.061-.707 0-2.298.354-2.829 1.591-.53 1.237-.53 1.414-.53 2.121 0 .707 1.06 1.945.177 2.298-.884.354-1.945.53-2.652.53-.707 0-1.768 0-2.121-.706-.354-.708.53-.884-1.061-.884h-1.591s-.53-.53-2.475.176c-1.944.708-2.121 1.238-3.359 1.945-1.237.707-.53-.177-1.59.884-1.061 1.06-1.592 1.59-2.299 1.944-.707.354-.353.177-1.59.708-1.238.53-.531.707-2.122 1.59-1.591.884-1.591.884-3.182 1.061-1.591.177-1.414 1.238-3.005.354s-.884-.884-1.945-1.768c-1.06-.884-2.121-1.414-3.005-2.121-.884-.707-1.414-.354-.884-1.768.53-1.414.354-1.414 1.06-2.298.708-.884 1.415 0 1.592-2.122.177-2.12-.177-1.767.177-2.828.353-1.06 1.237-.707.883-2.475-.353-1.768-.353-2.298-1.06-2.828-.707-.53-1.945-1.414-1.945-1.414s-1.06.707-1.237-1.591c-.177-2.299-.177-1.768-.177-3.536s.53-1.945-.353-3.89c-.884-1.944-1.415-1.59-1.945-2.827-.53-1.238-.707-1.768-.884-3.006-.177-1.237-.707-1.06-.177-2.121.53-1.06 1.061-1.237 1.061-1.237v-1.238c0-1.237-.884-1.768.707-1.768s2.121.707 1.768 0c-.354-.707 0-2.828 0-2.828s-1.06.884-1.591-.53c-.53-1.415-1.06-1.768-.53-3.006.53-1.237.883-1.237 1.06-2.651.177-1.414-1.59-1.768.354-3.005 1.944-1.238 1.06-1.238 3.005-1.415 1.944-.176 1.237.53 2.475-.707 1.237-1.237 1.768-1.59 2.828-2.475 1.06-.884.707-1.944 2.298-2.121 1.591-.177.354-.354 2.475-.177 2.122.177 2.652.707 3.713-.353 1.06-1.061 2.828-2.829 3.889-3.536 1.06-.707 1.237.177 2.12-1.59.885-1.769-.176-1.769 1.238-3.006 1.415-1.237 1.591-.177 2.652-1.591 1.06-1.414.177-2.121 1.768-2.121 1.59 0 1.59 1.59 2.121-.177.53-1.768-1.237-1.768.707-2.475 1.945-.707 3.536.354 3.89-.884.353-1.237.883-3.005.883-3.005s2.122-1.238 2.829-1.591c.707-.354 1.414-2.829 2.298-2.298.884.53 2.475 1.59 2.475 1.59l2.12 1.238s.178.53.708-1.59c.53-2.122.177-3.183.884-4.774.707-1.59 1.06-1.414 2.475-2.121 1.414-.707 1.768-1.06 2.121-1.768.354-.707 1.414-.884 2.475-.707 1.06.177 1.591.707 2.475-.53.884-1.238.707-1.591 1.59-1.238.885.354.354.354 1.592.707 1.237.354 2.475.884 4.95.354 2.474-.53 2.651-1.768 2.828-.354.177 1.415.177 1.591 1.06 1.591.885 0 .885.177.354 1.238-.53 1.06-.177.353-1.59 2.298-1.415 1.945-2.122 2.121-2.299 3.535-.177 1.415.177 2.299.177 2.299s-.707 1.944.53 1.944c1.238 0 1.414-.53 3.005-.707 1.591-.177 3.006-.354 3.182 1.237.177 1.591 1.238 4.597 2.299 4.773 1.06.177 1.06.53 2.828.177 1.768-.353 2.475.53 2.652-1.06.176-1.591.176-1.945.176-3.182 0-1.238-1.767.707.53-2.829 2.299-3.535 2.83-1.237 2.299-5.126-.53-3.89-1.591-3.536-.707-6.01.884-2.476.53-2.476 1.06-2.299z"
                        style={{
                            fill: OCEANA_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                        }}
                    />
                    <path
                        d="M212.132 178.98s2.828-3.182 4.596-2.828c1.768.353 3.89 0 5.657-1.415 1.768-1.414 4.596-.707 4.596-.707l2.122 1.768s2.828 2.828 4.596 1.768c1.768-1.06 1.768 1.768 4.95 2.121 3.182.354 4.596 1.06 7.778 2.121 3.182 1.061 6.01-1.767 9.192-.353 3.182 1.414 8.132 3.889 9.546 2.828 1.414-1.06 1.06-2.475 4.243-2.121 3.182.354 5.657-.707 5.657-.707s-.354-2.121 1.767-1.768c2.122.354 4.596-.707 4.596-.707l3.182-.707h2.475l.354 2.475s4.596-.707 7.071 1.414c2.475 2.121 7.071 6.01 8.132 3.89 1.06-2.122-1.415 3.888 3.182 4.242 4.596.353 3.535-3.182 5.657-2.475 2.12.707 3.889 1.414 6.01.353 2.121-1.06 4.596-4.242 6.717-2.474 2.122 1.767 10.254 2.828 9.9 1.414-.354-1.414 0-5.304 0-5.304h2.828l.354 3.89s4.243.353 4.95-1.768c.707-2.122-1.415-2.829-1.415-2.829s-1.767-2.475.354-6.717c2.121-4.243 3.536-4.243 3.536-7.425 0-3.182 4.242 0 4.242 0l.707-2.828s3.536-1.06 3.536.353c0 1.415-1.414 1.061-1.768 3.536-.353 2.475-3.182 1.06-3.182 1.06s-4.243 6.718-2.828 7.425c1.414.707 2.121 3.89 1.767 6.01-.353 2.122.708-1.06 1.415 1.061.707 2.122 4.596 0 4.95 1.414.353 1.415-3.536 2.829.353 3.536 3.889.707 3.535-.354 4.95-1.414 1.414-1.06 1.767-4.243 3.182-2.122 1.414 2.122 0 3.182 0 3.182l2.121.708s-1.414 1.06-.707 2.474c.707 1.415 2.828 0 0 2.829-2.829 2.828-5.657 1.768-5.657 1.768s-1.414 3.535-2.828 3.889c-1.415.353-.708 2.475-2.829 2.475-2.121 0-2.828-1.415-2.828-1.415l-2.122-1.767-.707 2.12s3.182 3.183 1.768 4.244c-1.414 1.06-4.596 1.414-4.596 1.414s-9.9 10.253-10.607 12.728c-.707 2.475-1.06 9.192-1.06 9.192l1.767 1.414s1.415 2.475 3.182 4.243c1.768 1.768 2.829 5.303 5.657 4.596 2.829-.707 3.89 2.475 3.89 2.475l2.12-1.414s2.122-1.238 2.476-.53c.353.707 2.474 1.414 2.474 1.414s2.122-1.238 4.066-1.415c1.945-.176.354 1.591.354 1.591l-4.066 1.945s.884 2.652 1.944 2.298c1.061-.353 1.591 4.066.354 4.95-1.237.884.354 2.651.354 2.651l.707 2.475 1.944 1.415.53 2.298s.708-3.713 1.945-4.597c1.238-.883 1.945-5.656 1.414-6.717-.53-1.06-1.414-1.414-.707-3.005s.354-4.243 2.122-3.713c1.767.53 3.535.354 3.889-.883.353-1.238-.177-1.238 0-2.299.176-1.06 1.06-1.414 1.767-1.59.708-.177 1.238.353.708-2.122-.53-2.475 0-1.414-.708-3.182-.707-1.768-.176-.707-.883-2.298-.708-1.59-1.238-4.066.53-4.243 1.768-.176-.177-2.298 1.06-2.828 1.238-.53 3.536.177 3.006-1.945-.53-2.12-3.182-6.363-1.414-6.54 1.767-.177 4.281.725 4.281.725l6.25.375s-.625 2.375 1.25 2.625 2.125 1.375 2.75 1.75 1.625 1.25 1.375 1.75-.25 1-.125 1.875.75 2.125.25 2.375-1 1-.875 2 .5 2.5.5 2.5 1 1.375 2.25.75.875-1.125 2.5-1.875 1.625.875 2.625-.75.875-1.875 1.125-2.5 1.5-2.25 2.5-1.75-.317 4.999.744 6.59c1.06 1.59 2.506-.59 2.631.16s.25 1.625.375 2.25-.75 1.125 0 2.125.875 1.25.75 2 .375 1.375.375 1.375 1.375-1.25 2 .25.125 2.375 1.25 2.375 2.375 1.75 2.375 1.75l.5 2.625 2.875-2 2.75.875s-3.813 1.75-3.063 3.563c.75 1.812 4.625-2.125 4.563.312-.063 2.438-.5 4.938-1.438 5.063-.937.125-2.437.937-2.562 1.5-.125.562-1.875 1.687-3 1.937s.625 1.25-1.75 1.625-3.125.25-3.625.25-.5.5-1.125 1.625-.125 1.5-.75 2 2.25 0-1.625.875-4.5 1.125-4.5 1.125-.25.375-1.5.375-1.75-.625-1.75-.625-.25-.625-2-.625-3.375 1.625-3.375 1.625-.5.625-1.5.75-2.375 1.375-2.375 1.375-1.375.375-1 1.875S385.125 271 386 270s2.25-5 4.125-4.625S394.5 266.5 394 269.25s-.625 2.25-.25 3.625 1.25 2.125 1.125 3.375-1.25.875.125 2 2.875 2.875 3.375 1.25 1.125-2.75 1.75-2.5 2.375-.5 1.125 2-1 2.625-2.125 3.375-1-1.25-3 1.75-1 3.625-3.125 4.5-2.5 3.625-3.25 2.5-1.75-1.125-.875-2.75 1.5-1.375 1.25-2.875.75-1.625-.5-1.75-.625-.125-2.125.375-1.375-1.125-2.625.875-1.625 1.875-2.5 2.375-.5 1.125-1.125 1.875-.875 1.125-1.375 1.75-.625.625-.625 2 1.125 3.625 1.125 3.625-.625 1.75-1.375 2.125-.875-.875-4.125 2.875-2.875 4.125-4.875 5-1.75 1-1.875 1.5-1.5 1.125-.75 2.25 0 1.375 1.125 1.875 2.25-.5 2.125 1.125-1.375 3.25-3.375 4.5-4.625 5.125-7.25 5.75-3.75 1.5-3.625 2.75 0 2.75-1.375 2.75-.5.625-.5 3.625.25 3.875.875 5 .875 1.125.875 2.875 0 3-.125 3.5 1 .375-.875 1.5-3.5 1.75-4.25-.125-2.25-1.375-2.375-2.875.5-5.125.5-5.125-1.875-.5-2.125-1.5-1-3.375-1.5-3.75-1.5-1.25-2.5-.75-2.75 1.5-3.375 1.375S340.5 333 337 332s-5.125-1.5-6.625-1.625-5-.125-5.625 0-6.625 1.5-7.375 1.5-6 1.25-7.375 2.375-1.25 3-2.75 3.625-2 .875-2 .875-1.5 1.75-1.625 2.75-1.375 2.75-2 3.125-.75.25-.375 1.375c-.501 2.793-.886 5.47.25 6.625l.125 2.25 1.5 2.625s2.25 3.25 5.125 2.375 1.5-.25 3.875-1.375 1.625 1.25 2.875-1.25.375-2.75 1.75-3.25.625-1 2.375-.5.125.625 2.375.75 2.5-2.375 2.25.5-.5 3-.75 3.75.375-.125-.5 1.5-1.375 1.75-2 2.125-1 .625-1 1.75.25 2-.875 2.5-2.25-.125-2 1.25-.125 1.75.875 2.375 1.75.75 2.375 1.875.875 2.5.625 3-.125 2.125-.875 2.5-1.75.125-1.75 1.75.75 2.875 0 3.25-2-.5-2.25.375-.375 1.625-.5 2.375-.75.875-.75 1.375v1.625c0 1.375-.875 2.25.375 2.5s1.875.625 2.5.25 1.375-.5 1.875-.875 1.25-1.375 2-1.375 2.25.375 2.25.375.75 1.875.625 2.5.375.5.25 2-.125 2.625-.375 3.125-.625 1-.875 1.5 0 .5-.25 1.25.125 1.875-.5 1.375-.25-.5-.625-1-.625-1.125-1.375-2.375-.625-.5-2.125-1.25-1.375-1.625-2.375-1.125-.625 1.375-1.75.625-1.5-.75-2.125-1.75-.5-.875-.875-1.625-1.375-.25-1.375-1.625.375-1.625 0-2.375-.75-1.125-1-1.75-.375-.125-.375-1.375V382.5c0-.5-.5-2.5-.5-2.5l-.625-1.25s-.125-.125-.625-.875-.5-.375-.875-1.625-1.25-2.75-1.5-3.75-1.625-2.25-5.75-3.75-3.875-1.875-7.375-2.625-4.75-1.375-4.75-2.875 0-2-.875-2.5-1.75-.625-1.375-1.5 1-1 1.625-2.125.75-1.375.75-2.25.375-1-1-1.625-4.125-3-4.125-3 1.625-.375-1.875.125-3.75 2.5-4.75 1.25.75-5.625-.5-6.25-1.125.25-1.875-1.375-.125-3-.5-4.375 0 .75-1-3.875.875-3.375-1.375-6-5-2.375-5.25-4.5.375-4-.125-6.125-.75-1.625-.75-3.5-2.875-5.5-4.25-7.5-1.375-7.375-1.125-8.75-.25-6.375.625-8.5.875-5.125 1.5-8-.125-2.25 1.375-5.875 1.375-1.25 1.625-4.375 1.25-1.25 1.375-3.875.625-3.875-.25-5.125-2.125-.375-2.375-2.75 1-3.5-.375-6.125-1.375-1.5-1.625-3.5-1.375-2.125-2-3-.375-.125-.875-2.375-1.75-2.375-2.375-3.625-.5.125-.875-2-1.125-1.875-1.75-2.5-1.5-.75-1.125-1.875.625-1.125.25-2.25-2-1.75-2.5-2.875-.5-.25-.5-2 .5-2-1-2.5-2.5.75-3.25-.875-.625-.75-2.125-1-2.125-.125-2.625-1.125-.75-1.875-1.75-1.875-2.25-.375-2.5-1-1.625-2.375-2.5-2.375-.625.625-2 1.25 2.5 1.25-.5 2-4.375 1-5 .5-2.875 1.125-2.5-.75.5-1.625 1.125-2.125 2.375-.625 1.625-1.125-.375-1.375-3-.75-3.375.875-4.25 1.5-.875 1.875-1.25 2.625 1.125.5-1.75 1.75-1.375-.625-4.375 2-2 2.875-4.25 3.25-.875 0-2.625 1.875-1.5 2.75-3.25 2.75-1.125 3.125-2.75 1-2.75-1.25-1.5-2.25 1.5-.75 2.5-1 .5.375 1.625-1.25.875-2.25 2.625-2.375 1.5 1.5 2.25-.875 0-2.25 1.375-3.5 2.875-2.5 1.125-2.625-1.875-.5-3.5.25-1.75 1.125-3.25.875-1.875-.375-1.875-1-.625-2.625-.625-2.625 1.25-.625-.875-1.125-2.25 1.125-2.125-.5 1.125-1.375.25-2.125-1.125-1.25-2.25-.75-2.375 1.75-1.625-.125 2.25-2.625 2.75-3.375 1.25-2.875 1.5-4-1-.5.5-1.625.875-1.375 2.75-1.25 1.375 0 2.625.625 1.625 1 2.375.625 1.5-1.25 2-1.875 1.125-1 1.25-1.75.75-1.5-.625-1-.875.5-2.75.875-1.625 1.75-2.375.125-.875-2.375-.875-2.375-.75 0-.625-1.75-1.125-4.625 2.25-5.5 5.5-.125 5.625.375-1 1 .5 1.125 1.625.5 2.5-.75 1.875-1.125.875-1.625-1.875-.375-2.375-1.375 0-1.25-.5-2.625-.5-1.625-1.25-2.625-2.75-2.5-.25-3.125 5.125-1.25 4.632-.895z"
                        style={{
                            fill: NORTH_AMERICA_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                        }}
                    />
                    <path
                        d="M519.9 234.841c-.53-1.06 0-.883-.884-1.767-.884-.884-1.59-1.238-1.06-2.652.53-1.414-.354-2.298 1.06-2.652 1.415-.353 1.238 1.591 1.591-.883.354-2.475-.707-1.768.707-3.36 1.415-1.59 1.591-1.944 1.591-1.944s.884 0 1.238 1.238c.353 1.237.353 2.298 1.06 1.414.708-.884.884-1.945 1.415-2.652.53-.707 1.414-1.59 1.414-1.59s-1.591-2.652.354-2.476c1.944.177 1.944.53 2.474-.176.53-.708.354-.708 1.591-1.061 1.238-.354 1.415-.177 1.591-1.238.177-1.06.707-1.06 1.415-1.767.707-.707.707-1.06.883-2.475.177-1.414-.176-1.238 1.415-3.359 1.59-2.121 1.59-1.944 2.121-3.359.53-1.414.53-1.237 1.06-2.121.531-.884 1.238-.53 1.768-1.237.53-.708.708-1.591.708-1.591l.883-1.591s-1.767-.708-.176-1.415c1.59-.707 1.767-.883 3.005-1.237 1.237-.354 2.121-.354 2.121-.354s1.15 1.68 1.326.442c.177-1.237-.53-1.414.53-2.21 1.061-.795 1.68-.706 2.033-.441.354.265.177.53.973.353.795-.177 1.679.884 1.944-.353.265-1.238-1.149-2.21.53-2.917 1.68-.707 2.564-.089 3.094-.619.53-.53-.265-.795.796-1.326 1.06-.53 1.414-.265 2.474-.618 1.061-.354 1.15-1.503 1.68-1.591.53-.089 1.237 0 1.768.53.53.53-.973.972 1.149.619 2.12-.354 4.95-1.68 5.745-1.061.795.619.088 1.68 1.149 1.68 1.06 0 2.121-.443 2.652-.089.53.354.441.619 1.237.972.795.354.884.265 2.121.354 1.238.088.265-.354.973-.089.707.266.972.796 1.944 1.15.972.353 1.238.088 2.387.176 1.149.089.53.53 1.856.884s1.414.089 3.093.089c1.68 0 3.713-.089 4.685.176.972.265.795.884 2.121.796 1.326-.089 1.15-1.591 4.508.619 3.359 2.21 3.27 2.651 4.066 3.358.795.707 1.149 1.15 1.237 2.298.089 1.15.442 1.326-.088 1.945s-2.033 1.414-3.182 1.68c-1.15.264-3.27.706-4.154.706h-4.155c-2.21 0-5.038-.353-6.363-.53-1.326-.177-2.917.442-3.006.884-.088.442-.442.884-.088 1.237.353.354 1.237 1.238 2.033 1.591a4.122 4.122 0 0 1 1.59 1.238c.266.353 1.503.265 1.945.265.442 0 1.15.619 1.326 1.06.177.443-.088.885.177 1.238.265.354.795 0 .795 1.503v2.121c0 .707-.353 1.237.708 1.15 1.06-.09.795-.178 1.856-.178 1.06 0 .707 1.415 2.121-.088 1.414-1.503 1.591-1.591 1.414-1.945-.177-.353-.353-1.06-.972-2.033-.619-.972-1.68-1.679-.707-2.033.972-.353.265-1.325 1.59-.441 1.327.883.885 1.502 2.034 1.502 1.149 0 1.237.884 2.828-.619 1.591-1.502 1.414-2.032 2.387-2.12.972-.09 1.414.088 2.386-.443.972-.53 1.591-1.944 2.563-1.856.973.088 1.768.972 1.945.177.177-.796.53-1.15-.354-1.768-.883-.619-1.325-.354-1.59-1.149-.266-.796-.089-.884-.089-1.591s.707-1.945.088-2.652c-.618-.707-.795-.618-1.06-1.414-.265-.795-1.06-1.502-.177-1.59.884-.09.796-.266 2.033-.09 1.237.178 2.652-1.325 3.359-.618.707.707.707 1.06 1.326 1.945.618.883 1.06 1.414 1.679 1.679.619.265 1.237-.53.619.884-.62 1.414-.62.795-.62 1.856 0 1.06-.353 1.856 1.327.972 1.68-.884.972-.442 1.856-1.68.884-1.237 3.359-1.944 3.977-2.297.62-.354 3.006-2.652 3.006-2.652s.618-1.502 1.944-1.237c1.326.265 1.15.884 3.005-.884 1.856-1.768 1.856-2.122 3.182-1.238 1.326.884 1.238 1.15 2.298 1.15 1.061 0 2.299-.708 3.27-.354.973.353.885 1.856 2.21 1.237 1.326-.618 1.415.619 2.475-.972 1.061-1.591 1.415-1.856 1.768-2.563.354-.707 1.238-1.856 2.563-1.591 1.326.265 1.591.53 2.652.707 1.06.177 2.033.265 3.005.265.973 0 2.298-.795 3.005.088.708.884.973 1.415 1.68 1.857.707.442 1.414 7.16 1.414 7.16s.177 3.358-.354 4.065c-.53.707-.53 3.889-.53 3.889l-1.237 2.121-1.945 4.773s-1.237 3.89-1.06 4.773c.176.884 1.06 2.829 1.06 2.829s-1.06 1.59-.53 2.475c.53.883 1.237 3.182 1.237 4.419v4.773 4.066s1.768.353 1.768 1.237c0 .884 0 2.298-.707 3.536-.707 1.237-1.591 1.768-1.768 3.359a14.39 14.39 0 0 0 0 3.005l1.414.707 3.182 2.121s1.591 0 1.768 1.238c.177 1.237.884 1.767.177 3.182-.707 1.414-2.475 2.298-2.298 3.182.177.883.53 1.237.707 2.474.177 1.238.707 1.415.707 3.182 0 1.768 1.06 2.829 0 3.36-1.06.53-1.237.883-2.121 1.237-.884.353-4.066.353-4.243 1.59-.177 1.238-.353 1.592-1.06 3.006-.708 1.414-.884 1.768-1.768 1.944-.884.177-1.238 0-2.122-.176-.884-.177-2.475-.884-2.475-.884l-1.414-.177-1.237-1.238s-.707.53-1.414.884c-.708.354-2.299 1.768-2.299 1.768s-2.474.707-3.181.707c-.708 0-.708-.177-1.415 0-.707.177-1.944 0-2.475.707-.53.707.708 1.415-1.944 1.591-2.652.177-2.652.177-3.359.177-.707 0-1.944 3.712-1.944 3.712s1.414 1.238.353 1.591c-1.06.354-1.768 1.415-2.298 2.122-.53.707-.884 1.237-.707 2.121.177.884 0 1.414.353 2.475.354 1.06 1.238 3.182 1.238 3.182s.707.353.53 1.414c-.177 1.06-.707 1.591-.177 2.475.53.884 1.591 1.237 1.591 1.237l1.061 1.415s1.414-.354 1.414.884c0 1.237.177 1.767.354 3.182.177 1.414-.354 2.828-.354 2.828s-.353.707-1.414 1.06c-1.06.354-1.414.177-1.768.884-.353.708-.176.884-.353 1.768s-1.945 3.713-1.945 3.713l1.238-1.061s.707 1.06.53 2.121c-.177 1.06-.53 1.238-.354 1.945.177.707.884 1.06.884 1.06l1.061.354s1.243 1.427.993 2.927c-.25 1.5.375 1.75.5 2.375s-.25.25.5 1.75 1.25 1.5 2.375 1.875 1.625.375 1.625.375 1 1.25.25 1.75-1.375 0-1.5 1-.125 1.125-.125 2.625.25 2.375 0 2.875-.375.75-.375 1.5.875 1.375.875 1.375.625 1 .625 1.625-.25.875-.75 1.375-1.25.375-1.25.375-.875 0-1 .875 1.75.875-.375 1.25c0 0-1.25.125-1.875.25s-1.25-.25-1.875.25-.625.875-1.5 1-.75 0-1.75.125-1.75 1-1.75 1 .25.5-1.375.375-2.25.25-2.25.25 0 1.5-1.375.5-2-1-2-1.5.625-1 1.125-1.5 1-.75 1.375-1.25.625-1.25.625-1.25-.375 2.625-.75-.25 0-2.875-.75-3-.625.125-1.5-.625-1.375-1.375-1.875-1.75-.125-.875-1.25-.875-.5-.75-1.375-1.625-1.625-1.375-1.625-1.375l.625-1.5s-.125-.25-1.25-.125-1.375.125-1.875.375-.375 1.75-1 .625-.375-1.375-1-2-1.75-1.25-1.75-2 .75-1.5.125-1.75-1.125.375-1.375-.625-.625-1.75-.625-1.75l-.875-.5.5-1.25s.625-.75.75-1.625-1-.875.625-1.125 1.75.25 2.625-.625l1.5-1.5s.625-.75.25-1.25-.625-.75-1.25-.375-1 .875-1 .875-.25.25-1.625.25-.875-.25-2.125 0-1.75.375-2.375.625-1.125.25-1.875.5-.625.125-1.5.75-1.75 1.625-1.75 1.625-.5.25.125 1 1.375 1.5 2 1.5 1.125-.625 1.375-.125.75.875.375 1.75-.125.875-.75 1.375-1 .75-1.5 1-.75.25-1.25 1.125.25 2.75-1.25 2-.875-.625-1.875-1.25-1.375-.5-1.75-1.375-.375-1-.5-1.875-.375-1.5-.625-2.5-.125-1.5-.875-1.75-1.25-.75-2-.75-.125-.375-1.75 0-2.125.125-2.5.625-.625 2.875-.625 2.875.25.375-.5 1.125-1.75.875-1.75.875l-1 .75s-1.125.75-.625 1.5 1.125 1.375.875 1.875-.125.5-.75 1-1 .375-1 1.5.875 1.375.25 2.375-.375.875-.875 1.625-.75 1.375-1 2.125.5.875-.375 1.625-1.125.375-1.375 1.25.125.875-.375 1.5-.5 1-1 1.375-.5.25-1.125 1-.125 1.125-.625 1.75-.875.125-1.125 1 0 .5.125 1.375.75.875 0 1.875-1.125 1.625-1.625 2-.5-.125-.875 1 .25 1.5-.5 1.75-1.125.25-1.875.375-1.125-.125-1.625 0-.75 0-1.125.625-.75.5-.25 1.25.375.75.875 1.25l1.375 1.375c.5.5.875.75 1 1.375a6.38 6.38 0 0 1 .125 1.125s.625 1.875.125 2.125-1 .25-1.125 1-.25.5 0 1.375 0 .875.5 1.375.625.5 1.375 1.25 1.625.875 1.125 1.5-1.125.75-1.875.5-1.125.375-1.625-.75-.75-1.375-.75-1.375-.75.125-.75.75 1.875.75-.5.75-2.125.75-2.75 0-.125-1-1-1.25-1 .5-1.375-.25-.5-.75-.5-1.875.625-1.125.25-2.625-.625-1.125-.875-2 0-.875 0-2-.375-1.625-.375-1.625-.375-.25-.625-1.5-.125-1.375-.375-2.5-.125-1.5-.75-1.5-.25.5-1.25-.25-.5-1-1.375-1.375-1 .375-1.25-.875-.25-.625-.25-2.125v-2.625c0-.625.5-.625-.25-1.625s-.625-1.25-1.5-1.375-.625.875-1.375-.375-.875-2-1.875-2.25-.875.375-1.375-.25-.25-.75-.875-1.375.125-.875-1.5-.875-1.625-.875-2.5-.5-1.125 1-1.125 1.625 0 .625.125 1.5-.125 1.375.5 1.5.625-.5.75.625-.125 2.25 1.375 1.625 2.375-1.5 2.5-.75-.125.875.125 1.875 0 1.875.875 2.5 1.25.625 1.625 1.125.25.375.75.625.5 1.375 1.125 2.25 1.375.125 1 1.25-.375 1.625-.875 2-1.625.75-2.375.125-1.375-1.125-1.375-1.125.625-1.25-.875-.875-1.5.5-2.125.5-1-1-.75.375 1.25 1.875 1.25 1.875 1.125 0 1 1.25.375.875-.25 2.125-.5 1-1 2.125 0 1.125-.625 2-.875 1.375-1.75 1.75-.875-.375-1.25 1-.25 1.375-.875 1.625-2 .25-2.5.625.375.875-1 .5-1-.375-1.625-.5-.875-.125-1.375-.75-.125-1.75-.625-1.375-.875 1.75-1.375.375-.375-1.5-.875-1.75-.75 1.25-.875-.375-.375-1.625.375-2.375 1-1 1.625-1 .75.125 1.5.25.625.75 1.25.875 2.5-1 2.75-.25-.25 3 .375 1 .25-2.375 1.125-3.125 1.75-1.5 2.125-2 .75-1.25-.125-2.125-1.125 0-1.125-1.625.25-2-.25-2.875 0-.625-1-1.125-1-.75-1.5-1.375-1.375-1.125-2.25-1.375-.25.375-1.125-1-1.125-1.75-1.875-1.625-.375 1.125-1.125.25-.5-1-1-1.375-.75 0-1.375-.5-.625-.5-.75-1.5.125-1.375-.5-1.875-1.875-.875-1.875-.875.25-.25-1.375 0-1.75.25-2.25.625-.125.375-.625 1-.375.75-1.25 1-.125.75-1 .625-.75.25-1.25-.25-.125-1.125-1-1.125-1.25.125-.875-.625.875-.75-.125-.75-.875.25-2.125 0-1.75-.125-2.25-.125l-1.375 2.5s.125.5 0 1.125-.625 1.125-.625 1.125-.375.375-.375 1.125.25.875-.5 1.625-.75 1-1.25 1.25-.5.125-.875.625-.625.5-.875 1.125-.25.625.125 1.25a8.02 8.02 0 0 1 .625 1.375s.375.125.125 1.25-.375 1.875-.375 1.875 0 .5.125 1.5 1 2.125 1 2.125l.625.875s.375 1.5.5 2.25 1.25.5.125 1.5-2.75 1.625-3.875 3.5-.75 3.375-1.625 4.375-.125 1.125-1.25 1.125-2.125-1.25-2.75 0-1 2.375-1.875 2.5-1-1.375-1 .375-.375 2.875-.375 2.875-.25.875-1.125.75-1-.25-1.75-.375-.75.375-1.375-.375-.75-1.125-1-1.75-.25-.875-1.25-1-1 .25-1.5-.625-.75-1.125-1.5-1-.75.625-1.75-.375-1-1.75-1.5-1.625-1.125 1-1.125 1 .125.5-1.375.375-1.75-.375-2.875-.375-1.25.75-2.25.25-1.125-.625-1.125-1.25.125-1.5-.375-2 .125-1.125-.625-1.5-.375-.25-1.25-.25-.875.125-1.75-.375-1.25.25-.875-1.125.125-1.25.75-2.25.625-1 1-2.125.5-1.375 1.125-3 .875-1.125.875-2.375-.5-1.25.25-2.125.875-.875.75-1.875.25-.75-.25-1.5-1.75-1.875-2.25-2.375-.375.125-.625-1.375-.75-1.25-1-2.125-.25-.875-.25-2-.875-.75-.875-1.375-.375-1.125.5-1.625 1-.125 2.125-1.125 1.125-.75 1.375-1.625 1.125-1.375 1.125-1.375-.125.125.625.875.875.75 1 1.25-.375.625 1.125 1 1.125.5 2.625.5 1.875.125 2.5-.125 1.25-.625 1.25-.625.5-.375 1.375-.375 1-.125 1.75.125.125.375.875.25.875.125 1.5-.25 1 .25 1.375-.875 0-1.5 1-2.25 1.375-1 2.375-1-.625-1.625-1.25-1.75-1 .5-1-.125-.125-.75.25-1.75 1.125-1.625 1.125-1.625-.125-.5-.25-1.375 1.625-1.375.5-2.125-1.625-1.125-2.375-1.125-.625 1.25-1.25-.25-.125-1.75-.75-2.5-.875-.5-1.5-1.375.25-.75-1.125-1.75-2.25-1.25-2.875-1.25-.875.875-.75-.375.125-1.625 1-2.375 3.125-1.375 4-1.5-.5-.5 1.375-.125 1.25.375 2.125.5 2.5.625 2.5.625.25-1.875.75-2.5.625-.625 1-1.625.5-1.125 1.75-1.5 2.125.625 2.125.625-1.625 1.625-.375 1-.375-2.625 2.375-2.25 3.75 2 4.125.125 0-1.875.625-2.875.625-1 1.75-1.625.875-2.5 2.25-2.75.875 0 2.125-.25 1.125 0 1.875-.875 1.375-3.125 2-3.375 1 .375 1.375-1.625-.25-1.625.375-2.125 1.375.125 1.75-1.25.25-1.625.25-2.25-1.75-.625.625-1.125 2.5.25 3-.75.5-.75.75-1.75.75-.75 1.375-1.75.25-1 .625-1.875.375-4.125 1-4.375.625.5 1-.5 0-1.25.75-2.25.875-.875 1.625-1.375.875-.375 1.125-1-.875-.5.875-1.75 1.625-.75 1.875-1.375.5-1 .625-1.625 0-.625.125-1.5 0-.25.125-1.75.375-2.5.5-3.125.25-1-.375-.875-.75 1.125-.875 0-.375-1.5-.625-2.125-.625-1.75-.625-1.75-.5-.5 0-1.25 1.125-1.875 1.125-1.875.375-.375 1-.5.75.125 1.25-.5-.5-.75.75-.875 1.5-.125 1.5-.125l-.75 1.125-.125 1s1.375.75 1.625 2.25.5 1.625.375 2.375-.25 3.75-.25 3.75 0 1 .75 1.625 1.25.875 2 1 2.125.25 2.75 0 1.25-.375 1.875 0 1.375 0 1.875-.25 1.125-.5 1.75-.625 1.125-.125 2.375-.125 1.625.25 2.125-.25.375-.125 1-.625 1.875-1.125 2.5-1.125.625-.125 1.375-.25 1.75-.625 2.75-.25 1.375.5 2.25.625 1.25.375 1.75 0 1-.75 1-1.5.125-1.25-.375-1.75c0 0-.5-.5-.875-1.75s-1.375-1.75-.625-2.625 1.125-.75 1.375-1.875-.5-1.75.375-2.5 1-.875 1.25-2 .25-1.75 1.25-1.375.875-.75 1.5 1-.375 2.5 1.25 2.625 2.75.875 2.75-.125-.75-1.75-.5-2.875S569.5 246 569.5 246s-.625.625-1-.125-.625-.5-.75-1.75-.875-.5-.875-1.625-.5-2.125.25-2.625 1.375-.625 2.5-.375 3.25-.375 4.25-.5.625.125 1.875.25 2 .125 2.875-.125 2.5-1 2-1.375-.875-.625-1.5-.75-1.5-.5-1.875-1.25-1.25-1.625-1.875-1.375-.375.375-1.625.375-1.875-1.75-2.875-1.125-.25 1-1.5 1.25-2.625.375-3.875.375-1-.25-2.375 0-2.375 1-2.875-.25-.625-.875-.625-2.125.75-2.125 1-3.25-.5-2.25.375-3.375 1.5-1.375 1.875-2 .75-1.375.875-2.25.125-.625.125-1.5-.375-1.625-.875-2-.375-.375-1.5-.5-.75-.875-1.875.375-2.125 1.375-2.25 2.375.5 1.375-.125 2.625-.75 1.125-1 1.625.25 1.25-.25 1.75-.875.5-1.75 1-1.5.125-1.625 1.625-.375 1.125 0 2.125.625 1.125.875 1.875.75 1.125.75 2.625.375 2 .375 2 .5 1.75.375 2.625-.5 2.375-.875 3.25-.75 1.375-1.375 2-.375.75-1.125 1.5-1.625 1-2.25 1.375-.75 1.625-.75 1.625v2.375s.625 1.625-.5 2.125-1.375.625-2.125 1.75 0 2-.875 2.75-.625.875-2.125.75-1.75-.125-2.25-.75-1.125-1.75-1.875-1.875-.625.125-1.125-.125-.125-.75-.875-.75-1.125.5-1.125 0v-1.375-4.625l-1.875-2.875.625-1.625-.75-1.25-.875-.5s-1.375.5-1.5 1-.125.875-.375 1.375-1.375 2-2.25 2.125-2 .25-2 .25-.375 1-1.125.625-.5-.25-1.375-1.25-1.125-2.125-1.125-2.625.25-.625-.375-1.125-.625-.5-1.25-1.125-1.5-1.125-1.375-2.25.375-2.25.625-3.375-.375-2.25-.375-2.25l-.475-.909z"
                        style={{
                            opacity: 1,
                            fill: EUROPE_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            marker: "none",
                            markerStart: "none",
                            markerMid: "none",
                            markerEnd: "none",
                            strokeMiterlimit: 4,
                            strokeDasharray: "none",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                            visibility: "visible",
                            display: "inline",
                            overflow: "visible",

                        }}
                    />
                    <path
                        d="M429.125 209.875s.625 3.875-.25 5.5-1 .75-1.5 3.125-.125 3.25-1 4.625-.625-.875-1 2.75-.125 4.5-1 4.875.25 1.75-1.25 1.75-2 1-2.375-.375.25-2-1.25-2.125-2.375 1.625-2.625-.125.375-2.375-.875-2.875 1.25 3.625-2.875-1.25-3.375-8.25-3.375-8.25-1.25-1.375-1.25-2.25.875-3.625-.25-5.125-2.25-4.5-.875-5.375 2.75-.625 3.125-2.625.25-1.75.5-2.75.75-1.375-.25-1.5 0 .375-1.875-.125-1.625-1.25-2.125-1.375.375.75-1.25.125-2.875-1.125-1.125-1.75 2.875-.875 3.625-.625 1.125 1.625.875-.25S404.5 191 404.5 189.75v-2.25c0-1.25-.25-1.875-1.25-2.875s-.75-1-1-2.625-.25-1.5-1.125-2.5-1 .375-1.625-1.375-.625-2.125-1.875-2.125-1.125.75-2.125-.625-.75-1.625-2.375-1.5-2.875.875-3.125 1.375.375 1-1.25 1.125-2 .125-2.875.125-1.75.375-1.75-.125c0 0-1-1.5-2.625-1.125s-2 1.5-2.5.25-1.5-1.125-1.625-1.75-1.625.125-.125-1.5.5-2 2.375-1.875 1.5.25 2.5-.25 2.375-.625 1-.75c0 0 .5-.75-.875-1s-2.875.5-2.875-.5-1.25-2.125.5-2.125 2.75.5 3.625-.375.875-.625 2.125-.5 2.5.75 2.875-.25 2.375-1.125.75-1.625-2.5-.375-2.125-1.125 1.375-.875 1-1.75-2.125-1.625.375-1.75 3.75 1 4.125-.375-1-2.5 1.25-2.5 4.625-1.125 4.75-1.875-.5-1.625 1.625-1.125 1.75 1.625 2.875.25-.125-1.75 2.125-1.25 2.5.75 3.375.125-.75-.875 1.375-.625 1.75 1 2.125-.875-1.375-1.625.75-2.125 2.25 0 3.25-1.375.125-1 2-1.375 2.125 0 1.25-1.375-2.5-2.125 0-2.375 3.875-.5 4.125-1.25c0 0-.125 1 1.375.625s1.25-.875 2.125-2 .625-1.375 1.5-.75-.125 1.125 2.125 0 .5-1.125 2.75-.75 2.125.125 4.75.25 1.25.5 2.75.875 1.125.25 3 .25 1.5-.375 2.625.375.625.875 2.875.875 2.875-.625 3.25.75-.625 1.5 2.125 1.875 3.625-.125 2.125 1-4.625 1.25-3.75 2 .75.5-1.625 1-5.875 1-3 1.375 4.875-.875 5.625.375-1 1.375 2.25 1 1.875-1.125 4.5-.625 2.125 1.25 3-.375-1.5-2.5 1.375-1.875 2.25.625 4-.375 2-3 2.75-.625.625 2.875-1 3.625-1.5-.375-2 1.375-.375 2.25-1.625 3.25-1.875.125-1.625 1.875.25 1.5-.125 3.25-1.25 2.25-.125 3.25 1.125 0 1.875 1.5 1.125 1.5.375 3.25-.875.875-1.125 3-.5 3.375.375 2.75 1-2.375 1.125-.625.625 2.875-.875 3.5-1.375-.25-1.625 1 .625 1.625-.5 2.625-.125 2-1.375.875-2-2.875-3-1.75-2.375.125-1.25 1.5 1.875 1 2.125 1.5.125 1 .5 1.75.125 1.125 1.125 1 1.375.375 1.125 1.25-.375 1.375.375 2.25 1 .875.375 1.25-.75.5-1.625 1-.75 1.25-1.25 1.375-1.5.75-1.625-.5-.25-2.875-1-3.5-1.875-2.25-2.125-.75 0 2-.375 2.75-1.875-.25-.375 1 2.125 1.625 2.125 1.625 1.375.75.75 1.375.125.875-1.75 1.125-1-1.625-2.75.375-3 2.5-3 2.5l-.875-1s-.75-2.125-1-.75 0 1.25-1 3.375-.5 2.625-1.625 2.75-2-.75-2.625.125.25.625-.875 1.5-1.5 1-2.25 1 .375-2.125-1.125.125-.625 2.5-1.875 2.75-1.5.25-2.625.25-1.75.125-2.875.125-2 .125-2.75.5-1.5 1.25-1.5 1.25v.75z"
                        style={{
                            fill: NORTH_AMERICA_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                        }}
                    />
                    <path
                        d="M570.563 189.875c-9.707-.57-14.541 9.639-23.492 10.42-5.856 10.832-12.4 21.751-22.445 28.577-2.916 3.315.327 12.384 2.83 15.15 8.22-10.735 11.7 6.11 14.415 10.41 4.12-3.416 3.856-9.808 9.035-13.01-2.065-7.24-3.47-14.655 2.48-20.394.813-12.03 18.509-7.001 14.047 3.42-5.029 5.45-2.108 8.522 4.157 5.427 9.4-2.447 19.233 13.431 5.235 13.512-8.97-2.383 5.026 10.552-4.293 12.662-5.672-1.451-6.54.71-4.626 5.607-1.256 10.192-14.484 3.171-20.699 8.591-7.29.215-13.24-1.571-16.359 6.423-5.56 7.149-7.886 15.998-14.16 22.861-4.222 6.017-11.176 9.006-14.451 15.276-7.637-2.562-9.062 9.21-15.8 4.63 7.622 5.136 11.36 18.328 2.17 23.747-5.198 3.317-13.77 1.87-18.414 2.032 7.352 6.478 2.426 14.915 2.29 22.196 3.435 5.635 9.905-.008 14.384 5.964 9.44-.319 16.343-11.02 11.506-19.914 2.018-7.95 6.304-20.911 17.111-16.055 7.952-6.321 16.272 8.26 19.193 7.042-3.498-8.449 8.678-13.646 13.326-6.135 7.647 2.498 6.34 15.941 12.541 15.743 8.105-2.338 7.264-11.832 12.981-17.137 2.102-8.421 3.565-19.402 13.712-21.255 7.344 5.231 11.824-5.036 19.884-3.916 9.656-3.074 6.988 10.11 2.964 11.788 1.927 5.052 8.536 3.576 10.055 10.006 7.565-.22 4.599 13.011 12.09 5.433 2.824-6.613-.91-18.479-7.23-20.382-4.135-8.25 11.465-15.326 1.623-22.069-3.286-7.752-1.816-17.782 5.252-22.962 6.37-1.718 13.583-5.438 19.034-5.708 5.527 4.888 4.853-5.714 10.904-4.511-2.918-5.784 2.434-11.904-4.77-14.76-1.122-8.691 1.26-18.117-1.421-27.513-3.064-9.368 6.445-16.974 4.328-26.238-4.729-9.35-11.27 5.018-18.38.762-10.935-1.987-18.28 9.71-27.92 12.563-8.757.617-12.242 14.627-21.73 8.63-.55-7.285-14.177-9.956-7.595-17.866 4.051-4.072 17.205 1.98 17.325-2.258-8.02-3.652-17.414-1.401-25.498-5.317-1.85-.537-3.707-1.06-5.59-1.472zM539.28 349.531c.08.65.256-.303 0 0zm21.625 12.531c.063 6.127 4.074.202 0 0z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            marker: "none",
                            markerStart: "none",
                            markerMid: "none",
                            markerEnd: "none",
                            strokeMiterlimit: 4,
                            strokeDasharray: "none",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                            visibility: "visible",
                            display: "inline",
                            overflow: "visible",

                        }}
                    />
                    <path
                        d="M662.952 190.044c.707.442 1.414 7.16 1.414 7.16s.177 3.358-.354 4.065c-.53.707-.53 3.89-.53 3.89l-1.237 2.12-1.945 4.774s-1.237 3.889-1.06 4.773c.176.883 1.06 2.828 1.06 2.828s-1.06 1.59-.53 2.475c.53.884 1.237 3.182 1.237 4.42v4.772 4.066s1.768.354 1.768 1.237c0 .884 0 2.299-.707 3.536s-1.591 1.768-1.768 3.359a14.39 14.39 0 0 0 0 3.005l1.414.707 3.182 2.121s1.591 0 1.768 1.238c.177 1.237.884 1.768.177 3.182-.707 1.414-2.475 2.298-2.298 3.182.177.884.53 1.237.707 2.475.177 1.237.707 1.414.707 3.182 0 1.767 1.06 2.828 0 3.358-1.06.53-1.237.884-2.121 1.238-.884.353-4.066.353-4.243 1.59-.177 1.238-.354 1.592-1.06 3.006-.708 1.414-.885 1.768-1.768 1.945-.884.176-1.238 0-2.122-.177-.884-.177-2.475-.884-2.475-.884l-1.414-.177-1.237-1.237s-.707.53-1.414.884c-.708.353-2.299 1.767-2.299 1.767s-2.474.707-3.182.707c-.707 0-.707-.176-1.414 0-.707.177-1.944 0-2.475.708-.53.707.707 1.414-1.944 1.59-2.652.177-2.652.177-3.359.177-.707 0-1.944 3.713-1.944 3.713s1.414 1.237.353 1.59c-1.06.354-1.768 1.415-2.298 2.122-.53.707-.884 1.237-.707 2.121.177.884 0 1.415.353 2.475.354 1.06 1.238 3.182 1.238 3.182s.707.354.53 1.414c-.177 1.061-.707 1.591-.177 2.475.53.884 1.591 1.238 1.591 1.238l1.061 1.414s1.414-.354 1.414.884c0 1.237.177 1.768.354 3.182 0 0 1.021 1.399 1.728.868.708-.53 1.945-1.414 1.945-2.474 0-1.061-.177-1.415.707-1.591.884-.177 1.414-.177 2.298-.53.884-.354.53-.354 1.591-.354 1.06 0 .884-.53 1.414.53.53 1.06-.176.354.177 1.945.354 1.59.53 1.414.707 2.474.177 1.061 0 .708-.353 2.122-.354 1.414-.354 1.59-1.238 1.944-.884.354-2.651 1.238-2.828 2.652-.177 1.414 0-.354.177 1.944.176 2.299.176 3.006.884 3.36.707.353.883.176.883 1.237 0 1.06-.53 1.414.707 1.59 1.238.177 2.122-.176 2.122-.176s2.298.353 1.768 1.768c-.53 1.414-1.591.53-.884 2.12.707 1.592.884.354 1.06 2.122.177 1.768-.53 2.298.354 2.298s2.475.707 2.475.707l.177 2.299.353 1.414s-2.298-.884-1.944.707c.353 1.59.707 1.59.707 1.59s2.298-.176 2.298 1.415-.354 2.121-.177 3.005c.177.884.984.869.807 2.106-.177 1.238-.277 1.96-.453 3.02-.177 1.061.53 1.592-.884 1.945-1.415.354-2.475 1.415-2.475 1.415s1.59 1.59-1.768.883c-3.359-.707-2.828-1.237-4.243-1.59-1.414-.354-1.237.353-2.298-.354-1.06-.707-1.414-.354-1.767-1.414-.354-1.06-2.975-2.538-2.975-2.538s-.875 0-1 .875 1.75.875-.375 1.25c0 0-1.25.125-1.875.25s-1.25-.25-1.875.25-.625.875-1.5 1-.75 0-1.75.125-1.75 1-1.75 1 .25.5-1.375.375-2.25.25-2.25.25 0 1.5-1.375.5-2-1-2-1.5.625-1 1.125-1.5c0 0-.47-1.486-2.327-1.133-1.856.354-3.005.265-3.447.884-.442.619-.884 1.856-1.591 1.945-.707.088-2.74.265-3.27-.354-.53-.619-1.49-2.592-3.99-3.342s-4.625-1.375-5.5-.75-.125 1.375-1.875.875-3.5-1.25-4-1-2.125 0-2.125.625.75 1.625-.25 1.75-2.25.625-2.875.875-.25.5-2.5.5-4.5.375-5.375-.375-1.25-1.625-1.625-2.125-1.375-1-1.375-1h-1.25s-1.375.375-1.875 1-.5 1-1 1.375-.5.25-1.125 1-.125 1.125-.625 1.75-.875.125-1.125 1 0 .5.125 1.375.75.875 0 1.875c0 0 1.063 2.188 1.5 3.25.438 1.063 1.875 1.625.75 2s-2.5.438-2.25 1.438 2.625 3.375 3.313 4.562c.687 1.188.187 3.875 1.312 4.875s2.875 1.875 3.5 1.875 2.5-1.375 2.75-.125-.25 3.625.5 3.75 2.5 1 2.875.375-1.253-2.394-.016-2.924c1.238-.53 0-3.006 2.652-1.768 2.652 1.237 2.652 2.121 4.243 2.298 1.59.177 2.651-.354 3.712-.177 1.06.177 2.298 1.238 2.652 0 .353-1.237 1.237-1.944 2.121-1.944.884 0 2.828-.53 3.182.53.354 1.06-.53 2.298-.354 3.359.177 1.06 1.238 1.414.884 7.424-.353 6.01 1.061 9.016.177 9.546-.884.53-2.121 2.122-1.768 3.006.354.883 1.768 3.889 1.945 6.01.177 2.121.884 2.652 1.06 3.712.177 1.06-1.237 1.238.177 3.005 1.414 1.768 4.42 2.829 4.243 4.066-.177 1.238 1.944 1.768 2.828 3.006.884 1.237 2.298 4.772 2.652 6.363.354 1.591 1.591-.707 2.298 1.945.707 2.652 2.829 2.298 3.359 4.243.53 1.944 2.453 3.8 3.453 4.3s4.25 1.25 4 3 2.75 3.5 2.75 4.75-.25 3.75-.25 3.75-.5.5.5 1.5 1.75 1.75 2 3.25 1.25 1.25 1.25 1.25 9.75-1 13-2 7.25-2.75 7.25-3.75 0-.75 1.5-1.25 2.5-2.5 2.5-2.5l1.5-1.25s.25-2 1.5-1.75 2.75 1 2.75 0-.75.25 2.25-4.75 3.5-6.75 3.25-7.75-.25-1 .75-1.75 1.5-3.25 1.5-3.25l-.5-2.25 1-2.25s1.433-3.917.196-4.448c-1.237-.53-1.06-.884-1.06-2.298 0-1.414-1.592-2.298-1.592-2.298s0 .53-1.414 0-3.182-2.121-3.182-2.121-1.59.707-1.768-.354c-.176-1.06.354-2.651-.53-2.121-.884.53-1.944.353-2.475 1.06-.53.708.707 1.768-2.475 1.768s-3.889 1.061-4.596-.176c-.707-1.238-.707-1.238-1.06-2.652-.354-1.414.707-.707-.884-1.768-1.591-1.06-1.945-1.06-1.945-1.944 0-.884-.53-1.415-.53-1.415s-1.238.708-1.768-.707c-.53-1.414.707-2.298-.707-3.535-1.414-1.238-1.414-1.414-1.945-2.475-.53-1.06-1.06-1.768-1.06-1.768s-1.238-.707-.708-1.414.177-.884 1.768-1.06c1.591-.178 1.945-.531 2.652-1.061.707-.53.353-.884 1.59-1.061 1.238-.177 1.415-1.238 1.945.177.53 1.414.354 1.944.354 3.889 0 1.944-.177 3.359.354 4.42.53 1.06.883 1.59 1.06 2.297.177.707.354 1.238.354 1.238s.177.177 1.06.177c.884 0 1.061-.708 1.415.176.353.884 0 .53.53 1.238.53.707.354 1.06 1.237.707.884-.354 1.061-1.238 1.945-.884.884.354 1.591.53 1.591.53s1.237.177 1.237-.884c0-1.06-.176-1.59.354-2.298.53-.707.884-2.475 1.944-.176 1.061 2.298.53 2.651 1.061 3.535.53.884.884 1.591 1.945 1.238 1.06-.354 1.59-.354 2.298-1.061a6.104 6.104 0 0 1 1.414-1.06s-.177-1.769.884-2.122c1.06-.354 2.298-1.414 2.298-1.414l1.237-1.415 1.061-1.414h2.652c.707 0 1.414-.884 2.121-1.06.707-.177 3.005-.884 3.359.353.353 1.238.177 3.182.53 3.89.354.706 2.652 1.59 2.652 1.59h1.414c.707 0 1.06-.884 1.237.354.177 1.237-.176 1.768.177 2.475.354.707 2.652.707 2.652.707s2.298 0 1.237 1.06c-1.06 1.061-1.767 1.238-2.121 1.945-.354.707-1.06.884-.177 1.237.884.354.707-.53 1.414.707.708 1.238.53.884 1.061 1.591.53.708-.353.884 1.238 1.061 1.59.177 2.12 0 2.12 0l.708-1.768s.884-1.237 1.59.177c.708 1.414.01 1.384-.167 3.152-.177 1.768-.354 3.514-.354 4.751 0 1.238-.75 1.945-.573 3.182.177 1.238.427 2.018.427 3.432 0 1.414 1.375.863 1.375 2.1 0 1.238-.177 1.591.53 2.298.707.707 1.475 2.247 1.475 2.954 0 .707.686.987.686 2.225 0 1.237-.052 2.37.655 2.724.707.354 1.863.552 1.863 1.966 0 1.415 1.155 2.932 1.155 2.932s.56 1.28.56 1.988c0 .707 1.208 1.121 1.208 1.828 0 .707 1.414 0 2.298 4.773.884 4.773 1.414 1.768 2.828 5.834 1.415 4.066 2.122 5.126 3.005 5.126.884 0 1.945-.353 2.122-1.237.177-.884 0-.884.884-1.237.884-.354.707-.177.884-1.238.176-1.06-.708-1.237-.354-1.944.354-.708-.53-2.122.884-2.122 1.414 0 2.475-1.237 2.475-1.237s-.53-.707-.53-1.591-.708 1.768 0-2.122c.707-3.889 1.06-4.596.883-6.894-.176-2.298-1.06-1.237 0-4.242 1.061-3.006 1.591-1.591 1.591-3.89 0-2.298 1.061-4.773 1.238-6.187.177-1.414.707-.353.707-1.944s-.884-2.475.177-3.536c1.06-1.06 2.475-1.414 2.475-2.651v-2.652c0-.884.353-2.652.353-2.652s2.298-.177 1.768-1.237-.354-2.298 0-3.182c.353-.884 1.398-4.585 2.898-3.585 1.5 1 2 1 2 1s1.375-1.375 1.25-2 .5-1.75.5-1.75.25-1.75.75-1.875 2.875-.25 2.875-.25l.875 2.125s.875 2.75 2.125 3 1.25 2 1.5 3.75 6.75 8.5 7 10 3.5.5 3.5.5 1.25 3 2 2 5.25 1.75 5.25 1.75.25-.25.5 1.75 1.75 2.25 1.5 3.75-.75 3-.25 4.75.5 2.25 1.25 3.25.5 2.75.75 4-1 2.25 0 3 1 1 3.5 4.25 1.5 3.5 3 3.75 3.25 0 3.25 0 1 0 1-1.25-.5-2-.5-2 .25 3-1.5-1.75-1.75-5.5-1.75-7.5.5-1.5-.75-2.75-3-.75-1.75-2 1.75-1.25 2-2.25 0-1.25 1.25-1 1.5.5 1.5.5l2.25 1.75s0 1 1 1 2.25.75 2.25.75l-.25 2.25s.75.5 1.25 1.5 1.75 4.5 1.75 4.5 1.25 1.75 1.5.75 3.5-3.5 3.5-4.5 3.25-4.5 3.5-6.25 1.25-5 .75-7.75-.25-3.75-1.5-5.75-1.5-2-2.25-5.5-2.5-4.75-3.75-4.25-2 .75-2 .75.75-1.75.25-4 0-2.5-2.25-2.25-3.25-.25-3.5-1.25-.5-10.625 3.125-10.125 1.375 2 3.25 2.375 2.625 3.125 3.625 2.5 1.5-1.875 2.125-2.375 1.875-1.125 1.5-2-1.75.125-.5-1.125 2.75-1.625 3.125-2.375 1.25-1.5 1.75-1.375 1.375 1.125 1.625-.125.25-2.375.25-2.375 0-.625 1.375-1.875.875-.5 1.5-2.125.125-.875 1.125-1.875 1.625-1.25 1.5-2.375-.625-1 .5-1.25 2.75-.25 2.75-1.875-.375-2.625.25-3.625.75-.75 1-2.375.625-2 .625-4.125-.875-2-.125-3.625 1-4.875-.125-5-2.625.625-1.625-1.75 1.75-3.25.875-4.75-1.75-1.25-1.5-2.625.75-3-.625-3.375-3.875-.5-2.625-1.25 1.625-.5 1.25-1.25-.375-1-.875-1-1.25 1-1.5-.5.25-1.625-.75-1.875-1.125.5-1.125-.875.375-1.875-.125-2.125-.75-.125-.75-1-.875-.5-.875-1.125-.875-.625.125-1.125.875.5 2.25-1 .5-.25 1.875-2.25 3.625-2.25 1.125-2.5-2.125.5-3-.375-.125-1.125-1.625-1-1.5.375-1.875-.125.75-.875-1.125-.875-1.25.75-2.75-.125-1.625-.5-1.5-1.5.125-1.875 1.125-2.125.75 0 1.375-.5 1-.625 1-1.375 1.375-1.125 1.75-2.125.375-2.5 1.125-2.5.75-.125 1.375 1.625-.875 2.5.875 2.625 2.75.25 3.5.125.25.125 1.125 1.125.75 1.5 1.625 2.125 1 1.75 1 1.75 0 .625 1.125.375 2.875-.25 2.875-.25-.5-.625.125 1.5 1 1.625 1 3.5-.875 2.875 0 3.5a6.25 6.25 0 0 0 1.875.875s2.625-2.5 2.875-3.625 1-1.5.875-2.375-.375-.25.125-1.375.5-3.125.5-3.125-.5-.125-1-.375-.75-.125-1-1.5.25-1.375-.625-1.75-1.25-1-1.5-1.75-.125-1.25-.75-1.375-.5-.25-1.875-1.25-1.125-.5-2.125-1.125-1.25-1-1.25-1.875-.25-1.125.375-1.75 1 .75 1.125-1.5-.625-2.375.5-4.625.875-3.125 1.75-3.875 1-1 2-1.75.75.125 1.625-1.75.625-2.5 1.25-3.125 2-2.875 1.875-4.5-.625-1.5-.25-3 .5-1.5.75-3.5-.25-1.75.375-4.125.75-2.875.375-3.75-.625-1.875-.625-3.375.125-2.75 0-3.25-.25-1-.625-2.375-1.375-2.375-1.375-2.375-.25 1-.75-.625-.375-1.125-.625-2.125-1 .5-.625-2.875.25-4.5.25-4.5-.125-3.375-2.375-3.375-3 .625-3.25-1.25-1.25-2.25-2.75-2.5-1.75 0-2.5-.375-.375-.625-1.625-.625-.5.5-2.25 0-1.75.75-2-.5-.125-2.125 1.625-4.875 1.625-3.375 1.875-4.75-1.25-.75 1-2.75 1.625-2.625 4.25-2.625 3 0 4.875-.875.375-1.875 2.625-.875 2 2 3.25.875 1.625-1.875 2.25-1.875 3 1.375 3 1.375 1 .5 1.875.25 1.625 1.625 2.5-.125.5-2.25-.375-2.75-1.875 1.75-1.375-1.25 1-4.125.625-5.125-3-4.5.125-2.375 2.375 2.5 3.5 3.125.625.625 1 3 4.125 1.875 3.625 4.875-.5 3.875-.75 5.125-1.625.375-1.25 5.5.75 14.25 5.25 18.25 5.625 4.5 6.25 2.75 1.25-2.5.875-4.5-1.375-2.75-.625-4.125 1.375-2.25 1.5-3.375.375-2 .25-3.25 0-2.75-.25-3.75-.5-2.625-.625-3.625-1.125-2.75-1.5-3.625-1.5-2.625-1.75-3.875-.75-1.75.5-3.5-1.125-2.75 1.75-2.375 2.75.75 4.25.5 3 .625 3.5-1.125.125-1.5 1-2.75 1.25-1 2.25-2.5-.5-2 2-4 4-2.75 4.625-3.5 1.875-1.125.875-2.125-1.125-1.875-2.5-2.75-2.125-1.5-2.75-1.625-1.5-.375-.875-.875 1.625-1.375 2.625-1.375 1 1 2.5.25 2.125-1.25 3.125-.5.375.125 1.125 1.625-.75 1 1.25 2.125 3.875 1.375 4.5 1.375.25.75 1.75-.125 1.25-.5 2.25-1.875 1.625-1.625 1.25-3.375-1-2.875-1-3.375l-1.125-1.875s0-.875-1.75-.875-2.75.125-2.75-.5.5-1.75-.625-1.75-1.75-1-2.5-.125-1.25 1.875-2.125 1.375-1.875-1.75-1.875-1.75.25-1.25-.125-1.75-1.5-1.625-1.5-1.625l-1.625-.75s-3.375-3.375-4.625-3.5-2.375.125-2.75-.875 1.75-1-1.375-1.5-3.25 0-4.25-1.375.375-1.75-2.125-1.875-3.625.25-5.75-.625-2.125-1.75-3.125-.75-.5 1.125-1.875 2.25-.625 2.125-2.75 2.125-1.75.25-3-.25-1-.875-2.5-1-1.125 0-2.625.125-.25 1-2.625-.125-2.375-1.375-4.125-2.25-2.25-1.125-3.125-1.125-4.5-.375-5.5.5-2.125 2.875-2.625 1.75.75-1.25-1.125-2.25-2.625-.75-3.75-1.125-.875-.625-.375-2 2.125-1.5-.125-2-2.125-1.375-3.75-1.375-1.25 0-2.125.375-1 .375-1.375.875.375 1.125-.5.875-.375.125-1.25-.875-.625-1.375-1.75-1.25-.25-.125-1.875.25-2.125.375-3.25.5-3 1.625-3 1.625.125.25-1.25.375-.5-.625-2.375.75-1 1.5-2.5 1.375-.75-1-2.375-.25-1.75.375-1.75 1.375-1 1.625-1 1.625 0-.375-.375-1.625-.875-.75-.75-2-5.25-2-6-3.75-.625-1.5-.875-3.125-3.25-2.375-3.75-2.25-1.875 1.625-2.5 2.375-.875 1.375-1.875 2.125-1.125 1.25-2.125 1.625-.875 1-1.75.375-2.375-1.625-3.25-2.375-2.5-1-3.125-1-3.5.625-4.625 1.25-2.375.5-2.375.5-.625-.625-1.625-.375-2.875-.5-4.25 1-3 2.875-3.625 3.25-3 1.625-3.625 2-1.875 1.25-1.875 1.25-.75.125-.5-.75 0-2 .875-2.375 1.375.125 2.25-.875.875-1.25 2-2 1.875 0 1.875-1-.5-.625 0-1.75 1.25-2 2.125-2.75 2.125-2.25 2.125-3-2.75-1.625-3.25-4-3.625 2.125-4.75 1.375-3-2.125-3.125-2.875.25-2.5-.875-2.625-1.875-.875-2.625.25-.25.875-1.875 2.125-3 2.375-3.25 1.875-.5-1.875-.5-2.5-2.5.625-3 .875-2.125 1.375-2.625 1.625-1.875.25-3.375.375-1.5-.75-4.875 1.25-5.5 3.5-5.875 4-2 1-2 1-2.125-1.125-2.25.5-1 3.75-1 3.75h-3.25c-.625 0-2 1.375-2 1.375l-2 2.5s-.875.5-.125 1.5S689 168.5 689 168.5l3 .625s2-.875 2 .125-1 2.375-1.5 2.375-2.75-.25-2.75-.25-1.125-2-1.875-1.75-2 .5-2 .5l-1.5-1.25-.75-.375s-.25-3.375-1.125-.875-.5 3.25-.5 3.25.75 1.375 1.25 1.875 1.25.875 1.5 1.375.375 1.875.375 2.5-.5 1.375-.5 1.875 2 1.5 2 1.5.375.75-1.125.625-.5 1.875-2.5-.375-2.125-2.5-2.125-2.5l-2.25-.75-1.125-.375-1.75-.625-1 1s-.5.5 0 1.25.875-.25 1 1.25 0 2.125-.125 2.625-.625.625-.125 1.625 1.5 1.375 1.5 1.375.5 1.375.5 2.125-.75 1.75 1.125 2.125 1.5.5 2.625.375.625-.375 2.25-.375 1.375-.625 2 .125 1.125.5 1 2 .75 1.375-.375 2.125-1.625 1.75-2.25 0 0-3.25-1-2.875-.75.125-1.5.75-1.75 1.625-1.75 1.625-1.875.375-2.375-.625-1.25-1.625-1.25-1.625-.375 2-1.25.125-.625-1.125-1-2.375-.875-1.875-.875-1.875-.75 1.125-.75-.25 1-1.75 0-2.25-.5.125-1.125-.75-.875-2.375-.875-2.375-2.5-.75-1.5-1.875.875-.75 1.5-1.875 1.25-1.75 1.375-2.5.125-1.875-1-2.125-1.125 1.25-1.875-.25-.5-1.625-1-1.625-1.125.125-1.75 0-1.25-1.125-1.25-1.125l-2.875-1-.875 2.5s0 .125.125 1.125.375 1.75-.125 2-.75.625-.5 1.5 2.375 3 1.75 3-2.125 1.5-2.125 1.5l-.25 3.375 2.5.625.375 2.5 1 .875-.673 2.294z"
                        style={{
                            opacity: 1,
                            fill: ASIA_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            marker: "none",
                            markerStart: "none",
                            markerMid: "none",
                            markerEnd: "none",
                            strokeMiterlimit: 4,
                            strokeDasharray: "none",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                            visibility: "visible",
                            display: "inline",
                            overflow: "visible",

                        }}
                    />
                    <path
                        d="M595.375 395.125c-.625 0-6.375-1.25-6.875-1.5s-1.875-1-3.125-1-3.375-.75-4.125-1-2.25-.75-3.625-.25-1.375-3.375-7.375-3-7.5.5-8.375.875-3.125 1.625-4.5 1.625-1.5-.375-3.625-1.125-2.5-1-3.5-2-.75-1.75-2.375-2-2.375.625-3.25-.375-1-1.375-1.375-2.125-.625-2.125-1.875-2.25-1.125 1.125-1.5-.75-.75-3.375-1.25-3.75-1.375-.75-2.5-1.875-1.25-2.25-1.25-2.25L532.75 371s-5.5.25-6.125.25-1.75.125-2.5.625-.375.75-1.75 1.375-3.625 1.75-4.25 2-3.5.375-3.5.375 0 1-1.125 1.75-2.625 1.625-3.875 1.5-1.394-.569-2.375-.375c-1.848.365-3.059 1.582-3.75 1.5-.633-.075-1.75.375-2.875.75s.125.5-2.25.5-3.625 0-4.375-.125-1.375.25-2 .375-1.5.25-1.268.42c-1.414 0-2.121 1.06-2.121 1.06l.353 4.597-3.182 3.535s-.707 2.829-1.414 4.95-1.768 4.242-1.768 4.242l-1.414 3.89s-1.561.806-1.436 1.431.375 1.875-.125 2.25-1.125 0-1.75 1.25-1.125 2.375-1.125 2.875.625 1-.25 2-1.75 1.125-2 3.25-1.25 4-.25 5.25 1.625 2.25 1.625 3.625-.375 1.25-.25 3.25.375 1.875.375 3.25-.125 3.25-.375 4.875-.75 2.125-1.125 4-2.625 2.625-.875 4.25 1.5 3.125 2 4.5 5 1 5 3.875 3.375 3.25 3.625 4.75-.625 3.625 2.375 4.875 2.75 3.125 3.375 3.625 3.375.875 4 1.625 1.5 2 2.125 2.625 1.25 1.625 3.375 1.5 2.375 0 5.75-.375 5.75-.5 6.625-.625 2.75.5 4.125-.125 1.125-1.75 2.875-2.125 2.375 0 3.5-.25 5.5-.25 6.125.25 1.375 0 2.125 1.625-1.5 4.125 3.25 3.875 7.5-1 8.125.125-1.5 2.75-1.125 4.25.875 1.875.375 2.625-1.625 1.125-1.25 2.25 1.375 1.625.875 2.125-1.125 2-1.75 2.875-3.25 2.125-2.25 3.25 7.625 6.375 9 9.5S553 510.25 551.25 513s-4 4.125-3.5 5.5 2.375 3.75 2.5 4.5.375 1.5.25 2.5 1 .625.25 1.75-1.25 1.625-1.5 2.125-1 1.5-1 2.625-.625 1.75-1 2.5-.5.75-.625 1.625 0 .5-.125 2-.5 1.75-.75 2.75-.125 2.25-.125 2.25 1.25 2.75 1.375 3.375.375 1.625.25 2.625-.625 1 .5 2.375 1.75 1.875 1.875 2.625.5 1 .5 1 3.25 3.125 3.25 3.75.75 1.125.625 2-.25.75-.25 1.875.125 1.625.25 2.5 1.625 3.5 1.875 4.125 1 1 1 2v2.375c0 1.25-.625 1.125-.125 2.625s1.125 2 1.375 2.5 1.5-.125 1.5 1-.25 1.625 0 3 1.25 2.25 1.625 3 .375.875.375 2.25.125 1.375.125 2.625v2.75c0 1 .75 3 .75 3.625s-1.125 1-.25 2.125 1 1.25 1.875 1.375 2-.25 2.5.625 1 1.125 1 1.125.5-1 1.125-1.375 1.375-.875 2.375-.875 1.625 0 2.5-.375-.75-.875 4.125-.875 4.75-.375 6.5-1.625-.375-1.75 3.125-2.5 4-.625 4.75-1.25.875-1 1.625-1 2 1 1.625-.25-2-.5-.5-2.375S598 586.25 598 586.25s-1 .125-1.25-.875 2.125-3.75 2.875-4.25 2.125.375 2.375-1.25.25-2.25-.125-2.75-1.625-.375-.25-1.625 2.125-3.75 2.125-4.5-.375-2.75.75-3.25 1.5-.375 1.875-1.375 2.75-4.375 3.125-5.25-1.125-1.75-.375-6.375 2.125-5.875 2.625-6 1.125-1.375 2.25-1.75.625.875 1.75-.875.5-1.125 1.25-2.25.5-1.125 1.625-2.25 1.25-1.875 1.75-2.375 1.25-.5 1.5-1.125 1-2.875.875-3.875-.375-1.625-.25-2.375.625-1.25.5-2.25 0-1.125-.25-2.125-.375-1.75-.375-1.75-1.375-3.625-.875-4.625-2.375-.125-2.375-.125.875-4.5-.5-5.25-1.375-1.125-1.375-1.125.25-2 .25-2.875-.875-3.375-.5-3.875.75-2.125.75-2.875-.25-1.75 1.125-2.75 2-.5 3-1.75 1.5-1.625 2-1.875 1.5-1.25 1.75-1.75 2.625-5.125 6.5-8.875 10.125-8.75 12.375-13.75 7.5-15.375 6-18-4.75-.25-7.25.375-6 .25-6.5.625-.375.625-1.5 1.25-4.125.875-4.125.875-3.375.125-4-.875-1.375-1.125-.75-3.25 1.25-1.875.625-2.875-.75-.5-1.75-2-3.375-2-3.375-3.5-.125-1.875-.75-1.875-.875.25-1.375-.75-.625-1.625-1.125-3 .375-.625-.625-2.25-2-1.125-2-3.125.75-1.875-.25-2.75-1.125-.125-1.625-1.625-.875-3.75-.875-4.375-.25-.125-.5-.875-2.25-2.25-2.25-2.25-.875.125-1.25-1-.25 0-.5-2.25-1.125-2.75-2-4.25 3 1.5-1.375-4.5-6.875-9.375-6.75-9.875c0 0-1.125-3.25 0-2.5s1.875 2.125 2.625 2.625 1.375.75 1.875.625.625-2 .625-2.75 1-3.375 1-3.375l-2.25-4.375-2 1.25s-.25.875-.75.875-1.5-.5-1.5-.5l-1.25-.375-1.625 1.5zM659.75 534c.25 1 1 .75 1 3s.5 5.5-1 3.5-1.5-2.75-1.5-1.5.25 3.5.25 3.5 1.23 1.7-.36 1.7c-1.591 0-1.768-.176-1.768.531 0 .707.177 2.121.177 2.121l-1.061 1.061-.53 2.298s1.767.177.707 1.945c-1.06 1.767-1.414 2.298-1.414 2.298s.176-1.591-.177 1.944c-.354 3.536-.354 4.066-.354 4.066s1.06-.353-.353 1.414c-1.415 1.768-1.945 2.298-2.298 3.182-.354.884.353 1.768-.708 2.652-1.06.884-1.59 1.591-1.59 1.591l-1.061 1.06s-.354 1.415-.354 2.122c0 .707-.53 1.237-.53 1.237s-.53.53-.53 1.238c0 .707.176 1.06-.708 1.768-.883.707-.53.884-1.59 1.767-1.061.884-1.415-.353-1.415 1.591 0 1.945-.53 2.829-1.414 2.829-.884 0-9.37.177-10.783 0-1.415-.177.884-7.248-1.061-8.485-1.945-1.238-3.182-5.48-1.945-6.364 1.238-.884.53 0 1.415-.884.884-.884.884-.884 1.414-1.945.53-1.06 1.414-1.06 1.414-1.06s-1.06-2.299-.353-2.299c.707 0 .353-2.651.353-2.651s.354-1.238.884-2.122c.53-.883-.53-1.767.884-1.944 1.414-.177 2.121.177 2.121-.707 0-.884-.884-1.06-1.59-1.238-.708-.176-1.061 0-1.061-1.237 0-1.238-.53-.707-.884-1.945-.354-1.237-1.415-.53-.177-2.121 1.237-1.591 1.237-.53 1.59-2.121.354-1.591-1.06-2.652.708-2.652s2.298.53 4.066-.177c1.768-.707-.177-.884 2.652-.707 2.828.177 3.005 1.06 4.065 0 1.061-1.06 1.591-.707 1.768-1.944.177-1.238 0-1.591 1.238-2.122 1.237-.53 1.237 0 2.12-.707.885-.707 1.592-1.59 1.415-2.651-.177-1.061-1.06-1.591.53-1.591 1.591 0 1.415.53 2.122-.354.707-.884.53-.884.884-2.475.353-1.59 0-1.944.884-2.475.883-.53 2.474-2.298 2.474-2.298s.53-1.59 1.238.884c.707 2.475 0 2.121.884 2.828.884.708 1.06.177 1.06 1.061 0 .884-.353 2.652-.353 2.652l-1.395.936z"
                        style={{
                            fill: AFRICA_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                        }}
                    />
                    <path
                        d="M450.5 439.75c-.25 1.25.5 2.75-1 4.25s-1.5 4-3.25 4-4 1-4 1v1.75s1 2.25-.5 3.25-2.5 1.5-2.75 2.5.125 3 .125 3l-.25 1.75s1 2 .25 3-.75 1.125-.75 2.75.75 4.25 0 5-.25 2-1.125 2.375-2 .625-2.375 1.375.25 1.625-.375 2.5-.5 1.625-1.125 1.875-.875-.125-1.125 1 .375 2-.625 2.5-2.25 1.625-2.625 2.125-3.25 1.5-3.75 1.625-11.5 1-13 4.125-1.5 5.875-2.125 6.5-.875-.25-.75 1.125.25 1.875.25 3.25.5.5.375 1.75 0 2.75-1.375 3.25-2.875.625-3 1.875 0 1.625-.25 2.375-.5.875-1 1.375-.875 1.125-1.125 1.875.125.75-.5 1.625-.625.75-.875 1.5.5.875-.875 1.25-4.625 1.875-4 2.75 1.5 1.125 0 1.5-1.25.25-2.75.5-1.25.125-2.875.5-1.875.875-2.875 1-1.5-.125-2.125-.125-1.125 0-1.125.625-.125.75.5 1.25 2.375 1 2.5 1.5.125.875.125 1.75.125 1 .625 1.125.625.25.75.75-1.25 2.25-2 2.75-1.375 1.125-3.125 1.25-1.375-.125-2.5.5-1.125.75-2.375.75-1.625 0-2.875.25-2.125.5-2.125.5.5.75.625 1.5.75.875.25 2-1.375 1.625-1.75 2.125-.375.25-.375 1.25l-2.625.375s-.875-.75-1.125.375 1 2.125 1 2.125-1.75 2.625-1.5 3.25.875 1.625.625 2.125-.125.75-.75 1.25-.125 1-.5 1.5-.75 1.25-1.625 1.625-1.125 1-1.125 1L365.25 560s-.5.625.125 1.375 1.25.25.875 1.625-.25 1.75-.25 1.75 1.25-1.375 1.125 2.375-.75 4.625-.75 4.625-.625-.125-.375 1 .75 2.125.125 2.75-.5-.375-1.5 1.625 0 4.75.625 5.375 1.125.75 1 2-.75 1.375-.25 2.25 2.125 1.5 2.375 2.375-.25 1.5.25 2.125a8.226 8.226 0 0 0 1.125 1.125s-.25 1-.25 2.125-.5 1-.5 2 0 2.25.5 1 .375-1.25.875-1.75 2.125-.5 2.625-.5 1-.75 1.875-.375 1 0 1.5 1.25.25 1.5 1.25 1.75 1.875.125 2.875.125 1.25-.75 1.5.375 1.75 1.5.25 2-1.75 0-3.25.5-1.5.5-2 .625-.5.5-1.375.875-.375.75-2 .375-1 .125-2.125-.625-1.625-1.125-1.625-1.625-.75-1-.75-1l-2.875-2.5h-3.375c-.75 0-1.25-.625-1.25-.625l-1.75.063s-.438-.438-.188-1c.25-.563.25-.563-.062-.625-.313-.063-1.188-.125-1.75-.313-.563-.188 0-1-.125-1.25s-1.313-.25-1.938-.313c-.625-.062-1.5-.375-2-1s-.375-.812-1.437-1.687c-1.063-.875-.75-1-1.688-1.313-.937-.312-1.25-.25-1.437-1-.188-.75-.938-.875-1.25-1.625-.313-.75 0-1.25-.875-1.812-.875-.563-1.063-.125-1.188-1.313-.125-1.187.188-1.75-.125-2.375-.312-.625-.125-.125-.625-.875s-.75-.875-.937-1.75c-.188-.875-.188-1.312-.5-1.875-.313-.562-.875-.812-.938-1.437-.062-.625-.062-.875-.062-1.438 0-.562.188-1-.125-2.25s-.125-1.562-.75-2.312c-.625-.75-.688-.25-1.188-1.875s-1.062-1.875-.75-2.688c.313-.812.5-.937.563-1.562.063-.625.438-.5.5-1.375.063-.875.063-.625.063-1.813 0-1.187-.75.313.125-2.937s.875-3.125.937-3.875c.063-.75 1.25-.875.813-2.188-.438-1.312-.688-1.312-.563-2.187.125-.875.625-1.25.5-1.688-.125-.437.063-.25-.125-.75s.5-.25-.313-.875c-.812-.625-1.062-.5-1.187-1.437-.125-.938-.125-1.688-.063-5.375.063-3.688-.187-3.938.438-5 .625-1.063.938-1.188.938-2.063 0-.875.5-2 .125-3.062-.375-1.063-.688-1.188-.313-1.813.375-.625.688-.625.688-1.375s0 .313.062-1.312c.063-1.625-.438-.438.188-2.563.625-2.125.875-4.25.937-5.312.063-1.063.125-1.375-.188-2-.312-.625-.75-3.625-.75-4.625s.188-.75.438-1.75.313-1.188.25-1.5c-.063-.313 0-.625.188-1.438.187-.812-.188-2.5.5-4.25.687-1.75.875-1.062.687-2.312-.188-1.25-1.625-3.25-1.188-4.625.438-1.375.875-1.125.813-2.938-.063-1.812-.25-4.25.188-5.25.437-1 .687-4.437.5-5.25-.188-.812.562-5.187-1.688-5.937s-2.25-.5-2.875-1.125-1.875-3.375-2.625-3.625-1.875-.5-2.75-1.125-2.125-1.75-2.125-1.75-.875-.125-1.75-.625-2.25-1.5-2.75-2.25-.75 0-1.25-1-2-3.25-1.875-4.25 1.125-2.875-.25-3.375-2.75-2.625-3.375-3.125S319.75 449 319.25 448s-1.375-.25-1.875-2.25-.25-3.625-.25-3.625-2-2.25-2.5-2.75-1.375-3.125-1.375-3.125-.25-4 .125-5.25 1.375-.125.625-2.25-1.75-1.625-1.125-3.625 1.25-2.75 2-4.625.625-4.375 2.5-5.625 1.5-3.75 1.5-4.5v-3.125c0-1-.125-1.75 1-3s1.75-2.375 1.75-2.375l1.25-1.125v-2l.75-2.25s.5-1.125.625-1.625-.25-2.5-.25-2.5l.25-1.625 3.125-.875s.375.375 1.375 0 2-1.25 2-1.25l2.25-1.25s1.5-1 2-1.5 2.25-1.125 2.25-1.125.875-.25 1.5-.25 2.75-.625 2.75-.625.125-.625.875-1.125 1.25-1.125 1.875-1.25 4-.625 4-.625 1.25.875 1.375 2.125-.375 2 .625 1.875 2-.375 2.5-.625.25-1.375 1.5-.5 1.375 1.125 1.875 1.125S358 384.5 358 384.5l5.5 1.875 1.875-.375c.625-.125 3.75-.375 3.75-.375s1.375.375 1.875.875 3.625 2.375 4.625 3.875 2.5 2 2.75 2.625 1.25 1.25 1.75 1.25.5 1 1.125 1.125 2 .125 2 .125.125.5.625 1.125 1.625-.625 1.875.75-.125 2.125.625 2.125 1.5-.5 1.5-.5l1.25-.5s0-1 1 0 1.75.75 2.625 1-.375.875 1.75 1.375 4.125.75 4.625.75.5-2 2.25-.375 3 2.375 3 2.375.25-.25 1 2.375.875 3.375 1.375 4.25 3.125 2.25 1.25 4.5-4.25 1.875-3 2.375 2.75 2 3.625 2 2.75-.375 3.375-.375 2.375.375 3.125.5 1.625-.125 2.375 0 1.625.5 2.375.875 1.625.125 2.375.5.75.5 1.25 1.375 1.5 1.25 2.625 1.25 1.5-.25 2.25.25 1.75 0 2.375 0 1.125-.625 2 .375 1 .875 2.875 1.125 5.25 2.625 6.125 2.875 1.375 1.875 2.25 2.125 2.25 0 3.25 1 2 1.75 2.25 3.5 0 2.25.375 3.375.875 2.375.625 1.875z"
                        style={{
                            fill: SOUTH_AMERICA_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                        }}
                    />
                    <path
                        d="M778.125 511.375C779 512.75 778.5 513 780.5 513s3.25-.375 4.375-.125.625.625 1.875.5 2.375-.875 3.375-1 2.25-.25 3 0 1.875 1.125 3.25 1.25 4.5.125 5 .25 2.125 1.375 2.875.5 1-.625 1.25-2 .25-2.125-.625-2.375-.25-.75-2.375-.875-2.75-.375-3.375-.625-1.625-1.25-2.375-1.5-2.875-1.125-4.25-1.125-4.125-.25-5.5-.25-1.625-.625-3.125.5-2.75 1.625-3.625 2.25-.625.125-1 1.375-.75 1.875-1.125 1.625z"
                        style={{
                            fill: "#950d98",
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                        }}
                    />
                    <path
                        d="M801.5 503.25c.5-1.75.125-1.5.25-3s.5-1.125 1.125-2.125.25-2.625 1.375-.75.75 2.625 2.125 3.75 1.625 2.375 2.75 1.25 3.25-2.25 2-3.625-2 0-2.125-3.25-.25-4.375-1.125-4.25-1.625 1.375-1.75-.375-.625-3.875.75-4 2.75.75 3.625-.875 1.875-2.125.25-2.375-2.875-.5-3.75-.375-1.5.125-1.375-.625-.875-1.5.875-1.5 1.375.375 3 .25 3.25-1 3.75-1.5 1.125-2.75 1.875-3.25 1.25-.875 1.125-1.5-.375-1.125-1.125-1.375-2-.5-2.375 0-1.25 1.875-2.125 2.25-5.125.125-6.125.625-1.875 1.125-2.5 1.5-2 1-1.75 2.5.25 2.75.25 3.375-1.25 2.375-1.5 3 .125 2.5-.25 3.375-.625.375-.625 1.625-.25 1.5.125 2.375 1 .875.625 2.125-1 .5-.5 1.875 1.125.875 1.25 2.125-.25 1.75 0 2.75 2 .125 1.875 0z"
                        style={{
                            fill: OCEANA_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                        }}
                    />
                    <path
                        d="m767.388 479.854.707-1.768s.177 1.945.353 3.005c.177 1.061-.353 2.475.177 3.182.53.708.177 1.061 0 2.122-.177 1.06.707 2.828.707 2.828l1.293 1.527L772 491s.625.875.875 1.5 1.125 1 1.125 1v2.25c0 .875-1 1.375.125 1.625s2.5.25 3.25.25.5.375 1 1.375 1 1.125 1.125 2.5.125 2.375-.375 3-.125 1.125-.75 1.875-1.625.875-2.375 1-1 .125-1.25 1 1.625 1.75-.75 1.625-2.25.5-2.75-.75.875-1.75-.875-2.375-.25 1.875-2.875-1.625-3.5-1.125-3.875-4.25-1.5-3.875-3-6.25-2.125-4-3.375-4.375-1.75 1.125-2.375-.5-.625-.75-.625-2.625-.125-1.75-1-3.5-1-1.625-1.5-3.5-.25-1-2.5-3.875-2.5-3.125-4.5-4.625-2.5-1.75-2.375-3.75-1.25-4 0-4.375 1.5-.75 2.75 0 1.375 1.625 2.375 1.875 1.625.125 2.375.125.5-1 1.75.5 1.5 1.5 2.125 2.875.625 1.875 1.25 2.625 1.125.75 1.75.375 1.25-1.5 1.625-.75.375 1.125.625 1.625 1-1.125 1 1-.75 3.125.375 2.375l2.25-1.5s-.125-.375.375.875.625 2.375 1.75 2.875 1.5.5 1.5.5l1.138.854zM791 496.875s-.25-1.25 1.875-3.375 2.75-2.25 2.75-4.375-.125-2-1.125-3-2.375-1.625-1.125-3.125 1.125-1.875 2.75-2.25 3.25-2.75 3.375-3.625.25-1.375-.125-2.5-1.375-3.125-1.5-4.5-.25-2.375-.125-3.375 1-1 2.125-2.375 1.375-.75 1.375-2.75-.125-4.5-.75-5-.875-.25-2.25-.75-2-1.75-3.875-2.875-3.125-1.25-3.5-.625.375-1.5-.375 1.625-.625 3.875-1.5 4.5-2.25 1-2.625 2.25 1 2.125-1 4.25-5.625 6.125-8.25 6.625-4.5 1.125-4.5 2 1.125 2 .875 3-2 2-1.75 2.5.875 0 1.375 1.125.5 4.625.5 4.625L776 487.5s-1.75 2.625-.875 3.375 1.25.875 2.25 2 2.25 2.375 3.75 2.5 2.375.875 3.5 1.375 1.5 0 2.875-.125 3.875.375 3.5.25z"
                        style={{
                            fill: OCEANA_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                        }}
                    />
                    <path
                        d="M829.436 335.25c0-1.237.53-4.419-.177-4.596-.707-.176-.707-.707-1.944-.53-1.238.177-2.652-.53-2.652-.53s-.353-1.238 1.768-2.475c2.121-1.238 3.359-1.945 3.359-1.945l-1.06-.707s-2.299-.177-1.238-.884c1.06-.707 1.237-1.59 2.121-2.651.884-1.06 3.005-6.541 4.243-8.662 1.237-2.122 4.066-1.415 4.066-1.415l1.944-4.95s-1.59-3.712 1.06-4.949c2.652-1.237 2.83.177 3.536-2.828.707-3.006 2.829-2.475 3.182-3.536.354-1.06.707-1.06.177-2.828-.53-1.768-1.945-3.36-1.945-3.36s-.707-2.65-.707-4.065c0-1.414-.353-3.712.884-4.243 1.238-.53-1.06-3.358-1.06-3.358s.707-1.061-.177-1.768c-.884-.707-1.414-1.591-1.414-2.475 0-.884.176-3.182.176-3.182s.884-1.414 1.591-1.591c.707-.177 1.415.177 1.415-1.591s-.884-4.42-.884-4.42-3.713-5.48-4.42-5.833c-.707-.354-.707-.707-.176-1.768.53-1.06 4.065 4.243 6.54 4.596 2.475.354 4.773 0 4.773 0l2.298-1.06 4.597.176s1.944.177 2.298 2.122c.353 1.944 2.828 1.237 1.59 3.005-1.237 1.768-1.06 2.652-2.297 2.475-1.238-.177-1.061-1.06-1.945-.884-.884.177-1.591 0-1.591 1.945 0 1.944 1.414 2.12.177 3.712-1.238 1.59-.707 2.298-2.475 2.298-1.768 0-3.359-.177-5.127.177-1.767.353-2.651-.884-2.651.707 0 1.59 0 1.944.884 2.121.883.177 1.59 0 1.237 1.06-.354 1.061-1.414 1.769-.707 2.122.707.354 1.59-.53 1.59.354l3.006.176.53 1.768s.354 0 1.415.177c1.06.177 1.767-.707 2.121.53.354 1.238.884 1.768.884 1.768s.53 0 .707 1.238c.177 1.237.354 1.59.354 2.474 0 .884-.884 3.713-.884 3.713s-.707.707-.53 2.121c.176 1.414.883 0 1.06 1.768.177 1.768.177 2.298.177 3.535 0 1.238-.177 1.061.884 1.945 1.06.884 1.414 1.768 1.414 1.768s.884.53.884 1.767v2.298s-.53.177-1.238.177c-.707 0-1.59-.177-1.59-.177s-.177.53-.531 1.768c-.354 1.238-1.945 1.945-1.945 1.945s0 1.768-.707 1.944c-.707.177-1.237.177-1.944.354-.707.177-1.238 0-1.591.884-.354.884 0 1.06-.884 1.237-.884.177-1.768-1.414-1.945.884-.176 2.298 1.238 3.182-.53 3.712-1.768.53-2.828.884-2.828.884s.353 1.415-.884 1.061c-1.238-.354-2.652-1.591-2.652-2.475 0-.884-.177-1.414-.177-1.414l-2.475 1.59s.354.885-1.414.885c-1.768 0-2.475-1.945-2.121 0 .353 1.944 1.06 3.358 1.237 4.066.177.707 1.238.176 1.061 1.237-.177 1.06.177 1.06-.53 1.768-.707.707-2.122.884-2.829.884-.707 0-.884-.177-2.298 0-1.414.176-2.127 6.829-2.127 6.829l-1.25 1.125h-.689z"
                        style={{
                            fill: ASIA_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                        }}
                    />
                    <path
                        d="M832.75 455.5s.5-2.75 1.5-3.5.25-1 .25-2.25-1-2.5.25-2.75 1.5 0 3.25-.25 3.5-1.25 3.5-1.25l1.5 1.5s.75.75 3 .75 3 1 4 2.75.5 2.5 3.25 4.25 5.5 2.5 7 3 2.75 1.25 2.5 2.75 1.5 2.25-.5 2.75c0 0 5.724 2.462 6.43 4.053.708 1.59 1.945 2.298.531 3.182-1.414.884-3.005.177-2.828 1.237.176 1.06 1.237 1.768 1.59 3.005.354 1.238 1.592 1.945 1.592 3.36 0 1.413-.354 2.297 1.06 3.181 1.414.884 1.591.884 1.591 1.945v2.475s-1.06 1.06-2.828 1.06c-1.768 0-2.652-1.414-3.359-1.414-.707 0-2.475-.353-2.475-.353s-1.237-4.95-4.773-5.834c-3.535-.884-3.535-1.414-3.535-.707s1.237 2.298-.177 2.828c-1.414.53-2.121.53-3.005.53-.884 0 3.005 1.592-1.415 1.415-4.419-.177-4.773-1.768-6.717-.53-1.945 1.237-7.778-3.713-7.778-3.713s-2.652.177-2.652-1.237c0-1.415-.707-1.591.177-2.829.884-1.237.884-1.414.884-2.828s.353-1.768.353-3.182.884-1.945-.353-2.475c-1.238-.53-2.298-.884-2.475-2.121-.177-1.238-.177-1.415-1.06-1.415-.885 0 0 .177-1.415.177-1.414 0-2.475 1.06-3.712-.53-1.238-1.591-1.414-1.591-3.713-1.591-2.298 0-7.247 3.359-3.358 0s4.596-3.536 4.596-3.536-4.066 0-4.243-1.414c-.177-1.414-.53-3.712-1.414-4.066-.884-.353-1.945-.884-1.591-2.121.354-1.237 1.06-5.657 4.596-5.48 3.536.177 4.243 1.59 5.303 2.121 1.061.53 3.006-1.414 3.36.354.353 1.768 0 4.773 0 4.773s1.237.884 1.59 2.651l1.723 1.279z"
                        style={{
                            fill: OCEANA_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                        }}
                    />
                    <path
                        d="M474 212.5s2 1.875 2.5.875-.625-2.25.875-1.125 1.375.75 1.875 1.375 3.5-1.5 2.375.5-1.875 2.75-1.125 2.625-.125-.75.875.5.875 2.25 2.25 1.125l1.25-3.875s3.5.125 3.25 1.375-1.125 1.125.75.125.875-2.75 2.125-1.625 1.875 2.25 2.375 1.125-1.125-2.375.375-2.125 1.625 1.625 2.5 0-.125-2.5 1.25-2.25.75.625 1.75-.25.75-1.75 1.75-.875 1 1.25 1 1.25 2 .25 2.5.5-.25-1 .25 1 .625 2.625 1.25 2.375 1-1.125 1 .5-1.125 2.125.375 1.875 1.875-.375 2 .75.75 2 .75 2 .125.875 0 1.375-.375.75-.125 1.375.5 1.625 0 1.875-1.25.75-2.125.875-1.375.75-1.625 1.375.75.25-.375 1.625-.75 1.625-1.5 1.875-1.625.75-1.625.75l-3.375.5-.75-1.375s-.5-1.125-1-.625.125 1.5-.375 1.625-1.75-2.125-1.75-1.125.625 2.75.625 2.75.125 1.5-.5 1.75-.625 1-2.25 1.125-1.75.875-2.625 1-1.125 1.875-2.75.625-6.125-3.25-7-3-1.25.625-3 .125-2.5.625-2.875-.125-.5.375-.125-1.375 2-2.625 2-2.625.625-.375.5-1 0-.875-.75-1-.5-.5-.875-1.5-.75-.875-1.75-.625-1.25 1.375-2.375.125-1.625-1-1.125-1.75.375-1 1.625-1.25 1.375 1 1.875-.5 1-2.125 1-2.125-.5-.25-1.375-.125-.625 1.125-1.625-.875-2.125-2-2.125-2-.25 0 .375-1 1.25-1 1.875-2-.5-1.875.375-2.75 1.125-.25 1.125-.25l.25.5zM466.514 294.238s-.354.53-1.768.53c-1.414 0-1.591-.176-2.475.354-.884.53-1.944.707-2.828.884-.884.177-1.945 1.238-1.945 1.238s0 .707-1.237 1.06c-1.238.354-1.061.177-2.298.177-1.238 0-.884-1.06-1.061-1.768 0 0-4.152.412-2.902-.338s2.25-.25 1.375-.875-2.25-.75-.75-1 1.875 0 1.875-.5-1 .625 0-1 1.25-1.625 1.875-2.125.25-2 1.125-1.75 1.875.5 1.875.5l.5-1s-3.125-.125-3.375-.625c0 0-1.625-1.125-2.125-1.125s-1.625.125-1.25-.375 1.125-2 1.125-2-1.625-1.25-1-1.75.75-.375.75-1.25-1.125-1 .125-2.25 1.5-1 2.375-1.75.875-.875 1.5-.25.625 1.625 1.75.25 1.25-2.125 1.25-2.125-.5.125 1.375-.875.375-1.875 3.125-1.5 2.25.5 2.875.375 1-1.75 1.375-.375-.5 1.625 1.25 2.125 2.5.25 2 1.125-.625.75-.125 1.5.875 1.125.875 1.75-.375 1.125-1.25 1.5-.75-.125-1.875 1-1.75.875-1.75.875-.25-.625-1-.125-.375 1.25-1.5.5-2.5-.75-2.5-.75-.5 0-.375.75.75 3.25.75 3.25 1.125 2 .75 2.875-2.25 1.375-.625 1.5 1.5-.25 1.5.875 0 1.75 1 1.625 1.75 1 1.639.863z"
                        style={{
                            fontStyle: "normal",
                            fontVariant: "normal",
                            fontWeight: 400,
                            fontStretch: "normal",
                            letterSpacing: "normal",
                            wordSpacing: "normal",
                            textAnchor: "start",
                            fill: EUROPE_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "#000",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10.43299961,
                            strokeDasharray: "none",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <g
                        style={{
                            fontStyle: "normal",
                            fontVariant: "normal",
                            fontWeight: 400,
                            fontStretch: "normal",
                            letterSpacing: "normal",
                            wordSpacing: "normal",
                            textAnchor: "start",
                            fill: EUROPE_COLOR,
                            fillOpacity: 1,
                            stroke: "#000",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10.43299961,
                            strokeDasharray: "none",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    >
                        <path
                            d="M478.711 283.278c-.53-.618-.265-.53-.442-1.149-.176-.618.089-.707.089-1.326 0-.618.088-.883.353-1.679.265-.795-1.414-1.503-1.414-2.121 0-.619-1.06-1.414-1.237-1.768-.177-.354-.707-.796-1.326-.707-.619.088-.619.442-1.326.795-.707.354-.707-.176-1.237-.618-.53-.442-.442-.973-.442-1.945 0-.972.088-.53.442-.972.353-.442.442-.354.972-.972.53-.62.265-.442.265-1.061s0-1.15-.265-1.856c-.265-.707-.972-.177-1.238-.884-.265-.707-.353-.53-.795-.796-.442-.265-.619-.088-1.591-.176-.972-.089-.265-.62-.354-.973-.088-.353-.088-.53-.265-1.502-.177-.973-.619-.265-1.149-.177-.53.088-.707.088-.884-.796-.177-.883 0-.53-.088-.972-.089-.442-.177-.442-.796-1.414-.618-.972.089-.442.796-.972.707-.53.619-.796 1.237-1.238.619-.442 0-.618-.176-1.326-.177-.707-.53-.883-.53-.883s-.62.176-1.68.176-.972-.176-1.503-.884c-.53-.707.089-.707.884-1.325.796-.62.53-.973 1.326-1.857.795-.883 1.237-.795 2.21-.972.972-.177.53-.707.972-1.768.442-1.06.619-1.237.884-1.856.265-.618.795-1.414.972-2.563.177-1.15 1.625.759 4.625-.241s3 0 3 0 1.5 2.5-1 3.5-1 5-1 5l.739.05s.884-.708 1.591-.796c.707-.088.619.354 1.503.354.883 0 .707-.53 1.767-1.238 1.061-.707.796.796.796 1.414 0 .619 1.414 2.387 1.414 2.387l-.353.619s-.62.353-.62 1.325c0 .973-.264.707-.441 1.15-.177.441-.53.441-.972.707-.442.265.088.441.265 1.325.177.884-.089.442-.53.53-.442.089-.884.089-1.238.708-.354.618-.088.707-.619 1.414-.53.707-.442.442-1.59.795-1.15.354-.62.354-.354 1.68.265 1.326 1.149-.442 2.74-.619 1.59-.177 1.237 0 2.298 0 1.06 0 .619.089 1.326.619.707.53.176.795.53 1.414.354.619.707.265 1.15.884.441.619 0 1.237 0 2.121v.796s1.06 3.182 2.474 3.977c1.414.796.884.796 1.503 1.326.618.53 1.767 3.447 2.12 3.89.354.441.354.795.531 2.386.177 1.59 0 1.237-.177 1.856-.176.619-.265.53-.53 1.502-.265.973 0 1.15 0 1.503 0 .354.53.619 2.298-.265s1.06-.619 2.21-.972c1.149-.354.884-.442 1.944-.177 1.061.265.884.442 1.857 1.414.972.972.353 1.149.618 1.856.265.707-.088.619-.353 1.326-.265.707-.265.619-.707 1.503-.442.883-.177.707-.53 1.237-.354.53-.62.265-1.68.53-1.06.266-.884.884-1.414 1.415-.53.53-.354.707-.442 1.149-.089.442.442 1.237.442 1.237s.795.354 1.237.796c.442.441.265.795-.265 1.679s-.707.442-1.768.884c-1.06.442-1.414 0-2.475-.089-1.06-.088-.972.354-2.475.884-1.502.53-1.414.089-2.563 0-1.149-.088-1.06-.088-2.21 0-1.149.089-1.06.442-2.386 1.238-1.326.795-.795 0-1.237-.354-.442-.353-.707-.442-1.326-1.06-.619-.62-.619-.354-1.15-.177-.53.177-1.679 2.21-2.474 2.563-.796.354-.884.177-2.033.177-1.15 0-.796 0-1.326.088-.53.089-.884.972-1.59 1.768-.708.795-.531.265-1.857.442s-1.237-.089-1.414-.442c-.177-.354.177-.354.618-.972.442-.62 1.238-1.768 1.768-2.652.53-.884.796-.442 2.122-1.237 1.325-.796.265-.354.883-1.68.62-1.326.708-1.326 2.033-1.768 0 0 .572-1.17-.553-1.795s-1.625-.375-2.75-.875-2-.25-1.75-.938c1.125-1.312 1.375-1.937 1.75-2.562.375-.625.125-1.25.625-1.25s.75.25 1.375-.125.75-.625.75-1.375-.125-1 .125-1.75 1-1.375.375-1.875-.125-.375-.875-.625-1.25-.75-1.25-.75l.25-1 .188-1.75s.187.125 1.437.625 2 2.125 2 2.125c.266.472.651.46.336-.222z"
                            style={{
                                fill: EUROPE_COLOR,
                                fillOpacity: 1,
                                fillRule: "evenodd",
                                stroke: "#000",
                                strokeWidth: 1,
                                strokeLinecap: "butt",
                                strokeLinejoin: "miter",
                                strokeOpacity: 1,
                            }}
                        />
                    </g>
                    <path
                        d="M500.406 213.094c-.046.04-.066.077-.125.125-.126.102-.294.243-.656.406-.255.115-.627.133-.969.156-.09.26-.108.487-.25.75-.298.554-.542 1.115-1.437 1.656-.387.235-.9.275-1.375.282-.005.012.005.02 0 .031-.263.59-2.494 2.136-3.742 2.431l-4.147-.513c-.147.442-2.186 1.54-2.549 1.832-.466.382-.886.765-1.781.969-.895.204-2.246-.277-2.75-.781-.796-.796-.768-1.03-.906-1.313-.002-.003-.03.003-.031 0-.646-.164-1.698-1.09-1.875-1.938-.178-.846.023-1.257.125-1.53.006-.018.024-.015.03-.032a2.581 2.581 0 0 1-.28-.219c-.18.137-.27.351-.47.438a3.096 3.096 0 0 1-1.656.219c-.518-.071-.75-.253-1.062-.407-.079.216-.055.414-.188.625-.352.564-.698.826-1.03 1.125.255.307.52.668.75 1.063.433-.01.901-.032 1.218.031.48.096.969.313.969.313a2.434 2.434 0 0 1 .812 3.718s-.183.145-.594 1.375c-.035.106-.186.24-.218.344.461.209.973.447 1.25.781.374.452.54.86.687 1.25.069.183.013.122.063.281.036.018.056.012.094.032.462.245.976.765 1.218 1.25.485.969.324 1.214.344 1.312.387 1.936-.797 2.904-1.281 3.25.022.006.04-.006.062 0 1.353.387.371.251 1.688-.125.786-.224 1.155-.122 1.531-.062.376.06.707.143 1.063.25.71.214 1.467.534 2.25.875a22.29 22.29 0 0 1 3.687 2.031c.342-.29.736-.668 1.531-.781-.22.031-.45.17.063-.156.513-.327 1.54-.785 2.719-.875.44-.034.157.035.125.062-.008.007.3-.193.343-.25-.069-.211-.094-.26-.187-.594-.181-.652-.406-1.399-.406-2.406 0-.379-.182-1.026.78-1.969.482-.471 1.337-.749 1.907-.719.348.019.488.108.688.188.672-.388 1.568-.642 2.25-.438.858.258 1.213.671 1.468.97.377.44.424.64.5.812l1.375-.188c.22-.124.575-.269 1.125-.5.176-.32.33-.683.844-1.312.102-.125.044-.033.063-.063.01-.346-.156-.704-.063-.937.458-1.145 1.66-2.608 3.531-2.875.02-.003.13-.086.156-.094-.1-.542-.218-1.128-.125-1.531.133-.576.195-.716.188-.688-.013.052.005-.048 0-.031-.145-.256-.188-.583-.344-1-.291.09-.628.162-1.531-.156-.633-.223-1.563-1.227-1.688-2-.067-.424.02-.512.063-.719a3.122 3.122 0 0 1-1.125-1.344c-.318-.694-.456-1.28-.625-2l-.813-.125a2.434 2.434 0 0 1-1.28-.562zm-17.187 3.844c-.033.192-.153.403-.25.625l.031.03.219-.562s-.007-.052 0-.094z"
                        style={{
                            fontStyle: "normal",
                            fontVariant: "normal",
                            fontWeight: 400,
                            fontStretch: "normal",
                            letterSpacing: "normal",
                            wordSpacing: "normal",
                            textAnchor: "start",
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10.43299961,
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <g
                        style={{
                            fontStyle: "normal",
                            fontVariant: "normal",
                            fontWeight: 400,
                            fontStretch: "normal",
                            letterSpacing: "normal",
                            wordSpacing: "normal",
                            textAnchor: "start",
                            fillOpacity: 1,
                            stroke: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10.43299961,
                            strokeDasharray: "none",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    >
                        <path
                            d="M476.563 246.406c-2.194.593-4.35-.267-4.782 2.625-.318 2.567-2.058 3.723-4.156 4.438 2.105 1.073 3.94 5.195.875 6.906 1.237.698 2.398 2.413 2.875 3.781 3.33 1.002 5.73 5.712 2.813 8.438 3.544-.31 5.236 3.77 6.625 6.312-1.55 2.7 1.587 6.283-2.125 7.375-.858 2.227-.494 5.412-3.594 5.969-.97 1.739 4.495 1.367 3.719 4.375.134 2.546-2.907 2.597-2.97 5.188 1.79-.083 3.842-4.946 6.47-2.094 1.515 1.66 3.878-1.382 6.125-.219 2.286.692 4.275-1.807 6.656-.688-2.658-3.175.649-6.766 3.281-7.906 2.274-2.367-.82-4.631-2.938-2.281-3.811 2.875-6.805-2.17-4.437-5.375.379-3.977-2.954-6.624-5.281-9.25-1.931-2.233-.397-7.12-3.906-7.25-2.378 1.65-5.65 1.252-5.813-2.219-.125-2.782 3.39-2.385 3.938-4.906-.019-1.451 3.538-3.516 1.812-5.125-2.596-.67-6.244 2.29-6.906-1.656-.738-2.24-.081-5.392 1.719-6.438z"
                            style={{
                                fill: DEFAULT_TERRITORY_COLOR,
                                fillOpacity: 1,
                                fillRule: "evenodd",
                                stroke: "none",
                                strokeWidth: 1,
                                strokeLinecap: "butt",
                                strokeLinejoin: "miter",
                                strokeOpacity: 1,
                            }}
                        />
                    </g>
                    <path
                        d="M467.469 272.625c3.176 2.562-2.724 3.457-4.563 2.313-2.7 1.305-3.782 6.57-7.437 4.78-2.207-.501-2.016 3.645-.688 4.188-2.755 4.592 8.519.836 5.366 4.645-.631 3.786-3.117 2.146-4.96 4.23 3.216-5.657 8.383-13.698 12.282-20.156zm-1.344 2.875c-.529-.223-.145-1.993 0 0zm1.719 1.313c.747-2.353.899-2.63 0 0zm2.25-1.313c1.632-.897 1.145 2.8-1 1.719-1.396.266.35-3.332 1-1.719zm.062 3.469c2.183-.579 1.348 2.195.375.812.521 1.193-.774-.631-.312 1.313-.323-2.497-1.165.527-.313-2.031.706-.443 2.384-1.492.25-.094zm-.875 2.469c-1.743-2.043-1.62-2.16 0 0zm-1.844-.657c2.479 1.182-1.201 3.031-.437 1.25-1.075-.515-.165-1.57.438-1.25zm-1.312 1.844c-1.008-.796-1.068 1.995-1.281.563-2.526-.064-.217-3.034.781-1.5-.927-2.723.76.432.5.937zM460 285.656c2.32-.678 2.824-.68 0 0zm.813 2.438c1.46-1.033 2.583-1.106 0 0zm.75.031c1.647.243 1.083 2.885.968 1.844-2.247-.384-.965-1.98-1.656-1.719.926-.278 3.396-1.19.688-.125zm.28 2.375c-2.208-1.908-1.58-2.685 0 0zm-.937 2.031c.025-1.303 1.847-2.727 0 0zM463.75 291c-.506.793.053 2.446 1.625 1.688 3.371 3.061-3.968 3.777-3.219.28-.289-.36-1.201-3.068 1.594-1.968zm-9 2.25-.063.063.063-.063zm7.188 2.063c-1.058-1.831-1.02-.69-.404-.9l.404.9zm-7.407-1.75c.026 1.62-1.16 4.584-3.625 4.53-2.026-1.571-1.204-4.682 2.09-4.13l.969-.253.566-.147zm-4.406 1.312c.123-.21-.402-.133 0 0zm11.094.719c-.908-2.426-.688-2.838 0 0zm-1.094.281c-.892-2.804-.338-2.519 0 0zm-.844.188c-1.054-2.478-.8-2.561 0 0zm-3.062.468c2.051 1.686-.196 1.437-.688.469-.217-.533.442-1.04.688-.469zm-2.313-.062c2.72-.725.91 3.757 1.094 1.031-2.104 1.052-1.537.726-1.625.281.84.007-.144-1.455.531-1.312z"
                        style={{
                            fontStyle: "normal",
                            fontVariant: "normal",
                            fontWeight: 400,
                            fontStretch: "normal",
                            letterSpacing: "normal",
                            wordSpacing: "normal",
                            textAnchor: "start",
                            fill: "none",
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10.43299961,
                            strokeDasharray: "none",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M463.063 275.594c-.388.431-.865.896-1.47 1.219-.434.231-.262.139-.437.25-.271.568-.694 1.262-1.375 2.093-.38.465-.712.877-1.469 1.281-.756.405-2.412.344-3.156-.187-.023-.016-.01-.015-.031-.031-.099.056-.323.22-.375.25-.072.041-.217.175-.281.219.063.282.156.457.156.812 0 .356-.072.89-.25 1.438.455.62.615 1.408.438 2.156l.156.094c.493.296.817.532.906.593.155.034.415.09.719.125.688.08 1.375.094 1.375.094.6.026 1.174.258 1.625.656-.124-.477-.513-1.92-.688-2.969-.155-.934.172-2.357 1.031-3.093.86-.737 1.938-.719 1.938-.719s1.233.133 2.625.656c.604-.37 1.457-.447 2.281-.375a5.726 5.726 0 0 1 1.75-1.187 3.952 3.952 0 0 1-.281-.531c-.082-.174-.067-.551-.125-.844-.485-.14-.913-.28-1.469-.656-.29-.197-.41-.627-.656-1-.326-.003-.652.033-.813 0-.333-.07-.715-.165-2.03-.344-.087-.012-.022.007-.094 0zm-3.688 15.75a2.623 2.623 0 0 1-2.625.812l-.156-.031c-.195.276-.232.523-.594.813-.615.492-.671.686-.875 1V294c0 .226-.041.616-.188 1.031v.031c.173.217.31.46.407.72.082-.134.176-.26.281-.376 0 0 .386-.377.906-.781s1.16-.938 2.406-1.188c.714-.142 1.09-.274 1.47-.406-.295-.173-.589-.439-.907-.969-.126-.209-.063-.465-.125-.718z"
                        style={{
                            fontStyle: "normal",
                            fontVariant: "normal",
                            fontWeight: 400,
                            fontStretch: "normal",
                            letterSpacing: "normal",
                            wordSpacing: "normal",
                            textAnchor: "start",
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10.43299961,
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M722.688 151.813c-8.52 1.772-27.938 4.1-27.875 13.125 8.55 5.218-2.406 11.56-5.852 11.747 8.598 9.738-13.486 6.82-7.611 8.401 17.634-.105 5.005 21.387-7.125 10.63-5.333-2.914-9.439-20.117-6.456-4.571 1.34 15.159-6.519 26.99-2.617 41.275 3.305 7.589-3.626 12.698 5.723 17.699-1.542 8.894 1.54 19.418-8.844 23.684-7.446 6.99-28.02.108-28.468 15.161-.178 13.007 19.521-.082 16.055 15.983-1.485 6.012-6.712 9.097 1.53 12.518 2.635 9.57 13.35 28.796-2.829 34.189-12.472-7.404-25.18.82-37.412-1.465-10.32-11.66-21.757 4.367-33.156-3.158-3.402 4.236-1.098 22.399 9.972 17.058 8.242 4.375 23.82-4.75 20.707 12.024-1.598 15.281.883 28.306 11.32 39.98 6.394 8.928 16.419 14.725 17.719 26.22 15.06-.29 27.282-12.785 31.169-25.655 7.219-18.346-18.672-4.673-20.82-19.314-9.045-7.128-10.232-22.921 5.026-21.327 5.781 3.473 1.415 19.195 11.218 9.764 5.677 5.219 8.667.185 12.89-2.723 11.179-4.226 17.68 6.518 23.267 13.66 11.141 4.743-.01 23.214 10.75 31.5 2.228 7.778 10.183 23.445 10.452 6.179.937-12.626 5.722-24.601 9.054-36.208 5.522-11.964 20.429-12.296 22.431 2.28 4.42 10.029 20.947 8.075 19.219 23.062 5.941-12.834 16.41 7.266 18.98 3.748 5.54-9.567-1.204-20.845-8.846-21.215 4.063-6.89-10.25-10.43-3.164-19.862 5.464-7.966 16.992.742 20.999-12.17 9.122-9.373 9.252-22.324 5.71-33.778-9.66-6.583-2.697-20.367-12.982-22.479-4.201-9.516 10.698-21.502 16.581-11.821-3.333-13.504 12.57-22.418 10.586-36.307-.56-10.827-2.128-25.201-12.052-28.99-17.813-.364-3.992-27.058 8.523-25.49 8.707.57 11.652-1.788 10.515-10.657 10.706-7.323 13.902 20.255 19.896 6.033 7.126 3.833 14.697-9.276 13.781-12.372-12.25-8.007 13.461-8.67 3.192-15.296-9.155-6.817-19.481-11.954-29.727-6.218-9.843-1.383-17.915-5.115-26.878-3.417-8.098-11.259-23.463-6.495-34.042 1.776-3.742-5.48-8.83-17.263-16.757-8.239-11.088-6.157-20.719 1.253-31.128 5.473-13.342-6.927 15.635-16.314-1.068-19.379l-1.557-1.059zm-57.594 23.03c-.575 2.671 2.557.95 0 0zm207.281 13.626c4.714 11.298 8.856.006 0 0zM843.25 222.28c-4.875 7.13 1.975 32.792 3.807 13.219.283-4.693-1.737-9.136-3.807-13.219zm-31.531 86c3.457 5.813 4.507.717 0 0z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M858.25 260.875c.022.006-.218-.055-.813.188-.255.11-.538.142-.812.093-.936-.19-1.64.04-2.688.625-.928.526-1.822.52-2.656.5-.724-.016-1.353-.069-1.875-.094.024.051.045.103.063.157.558 1.593.79 3.44.343 5.187-.141.554-.519 1.029-.843 1.531.228.025.456.117.687.188 1.515-.226 3.168-.088 4.125-.25.519-.088.646-.233.594-.156-.052.077.116.003-.188-.75l-.03-.031c-.904-2.405.182-4.728 1.812-5.907.722-.522 1.554-.842 2.406-1.031a1.517 1.517 0 0 1-.125-.25zm-9.25 21.25c-.673.983-.68 2.064-.219 3.531.504 1.6 1.54 3.383 2.282 5 .885 1.944.483 3.938-.407 5.375-.792 1.28-1.887 2.203-2.906 2.969-.25 1.57-1.02 2.87-2.063 3.625-.927.672-1.854.997-2.75 1.344.281 3.474-1.061 6.52-2.375 9.469-.293.64-1.009.97-1.687.78-1.082-.296-1.75-.147-2.219.157-.272.177-.515.485-.718.906a4.714 4.714 0 0 1 1.937-.062c.239.037.465.133.656.281.093.074.051.065.125.063.074-.003.26-.047.532-.188.543-.282 1.304-.917 2.062-1.5.379-.292.761-.579 1.219-.813.457-.233 1.053-.468 1.812-.28.76.186 1.339.843 1.594 1.468.248.608.353 1.28.406 2.125.19-.13.377-.317.438-.438.076-.15.107-.07 0-.25a1.432 1.432 0 0 1-.219-.718c-.032-1.06.278-2.015.813-2.719.534-.704 1.196-1.102 1.812-1.406 1.231-.608 2.234-.955 2.656-1.438.28-.327.694-.511 1.125-.5.871.028.775-.026 1.157-.531.297-.393.821-1.13 1.625-1.781.221-1.592 1.27-2.73 2.218-3.438-1.658-2-2.776-4.5-2.343-7.5-.734-1.06-1.095-2.247-1.032-3.344.077-1.328.474-2.536.782-3.625.307-1.088.532-2.04.468-2.687-.06-.616-.23-1.02-1-1.531-1.69-.148-2.98-.864-3.812-1.469-.744-.54-1.258-.82-1.969-.875zm-15.313 38.438c-.041.069-.084.15-.125.218-.673 1.13-.973 2.008-1.062 2.375.08.068.055.072.219.156.369.191.913.37 1.437.47.163.03.251.014.407.03a19.348 19.348 0 0 1-.875-3.25zm-3.656 6.75c-.015-.005-.042.032-.062.03.06.122.067.224.187.344.026.026.066.009.094.032-.002-.052.045-.125.031-.156-.073-.174-.088-.2-.25-.25z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M653.969 539.219c-2.257 1.582-4.05 3.092-5.5 5.437-3.122 3.266-8.285.989-11.532 2.875-.424 1.502-1.511 2.118.563 3.063 3.464 1.942 2.088 7.457-1.469 8.468-2.068 4.125 1.357 7.758 3.407 11.063-2.629-1.326-7.188-3.844-8.032.469 2.038 2.328 3.623 5.82 2.688 8.625 3.03.483 4.743-.672 6.125-3.032 4.1-2.239 2.86-8.287 6.812-10.968.918-3.772 4.065-6.724 3.375-10.813.84-4.316.852-9.41 3.5-13.031 1.194-.526.278-1.58.063-2.156z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M531.156 374.875c-10.263 1.677-18.746 9-29.31 9.793-13.464-1.382-13.152 15.946-18.883 24.896-8.098 8.174-1.344 17.877-3.303 27.868-6.032 10.523 8.001 13.736 9.056 23.167 7.253 8.176 16.747 10.858 27.423 6.445 7.457-4.257 15.887-.202 21.119 3.928 12.676-2.147 8.474 14.326 5.314 20.444 3.469 7.215 14.866 13.922 12.2 23.342-4.9 5.556 3.898 13.545-3.197 19.646-4.953 9.392 1.944 17.844 6.412 25.46.525 10.668 6.567 18.901 7.776 29.488-3.075 12.02 10.109 5.179 15.936 4.338 5.604-3.725 11.884-4.633 12.734-12.94 4.94-5.935 5.088-14.888 10.88-20.852-2.737-8.585 4.366-14.768 9.56-20.005 8.002-5.98 1.786-13.988.08-19.903-2.124-6.536-4.326-18.27 3.86-22.334 6.363-5.813 10.063-14.028 17.456-18.874 3.735-4.531 11.218-15.648 8.184-18.54-9.478 4.237-23.7 4.876-23.173-8.11-6.574-5.965-8.61-15.226-12.012-23.146-6.125-5.852-5.63-16.236-12.53-21.949-1.887-6.826-4.19-9.782-11.8-10.288-8.554-.935-15.65-7.212-24.255-2.745-10.51 1.807-22.077-6.288-25.945-15.727-1.692-.804-2.251-2.296-3.582-3.402z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M845.375 501.938c-4.387.654-9.464 2.201-8.843 7.79-.593 4.508-5.916 4.616-9.063 2.71-2.399 3.892-5.995 5.903-9.026 8.773-5.225.836-5.75 6.356-9.963 8.587-3.113 2.886-6.38 4.555-10.692 4.11-1.298 4.442-11.01 4.008-6.497 9.103.348 4.054-.613 8.769-3.644 10.888 1.917 4.195 3.838 8.721 3.948 12.894 4.756 3.714 3.84 9.15 2.31 14.1-3.765 4.65 3.902 5.196 6.106 1.86 4.48-3.391 9.605-7.42 15.637-6.14 2.056-1.386 4.895-5.595 8.988-5.397 4.898-1.848 9.605-5.12 15.143-2.996 3.983.212 8.207 3.335 8.034 7.624 2.495-2.167 3.204-7.922 8.226-5.485 5.078 1.748 3.941 7.313 2.658 10.916 2.484 4.004.492 10.428 4.055 13.345 3.42-4.638 8.914 1.907 11.702-2.51 3.35-2.025 7.56.19 7.679-4.933 1.237-3.784 2.444-7.451 4.424-10.952 3.119-2.85 1.006-8.534 6.085-10.207 2.858-4.342 3.407-12.504 1.819-18.152-3.02-4.367-5.95-8.852-8.483-13.203.287-5.687-6.338-4.83-8.757-8.64-2.762-3.852 1.365-9.274-2.002-12.68-2.295 1.306-5.936-3.845-4.718 1.49-.258 4.98-6.282 6.601-10.254 5.072-4.012-1.396-4.468-6.836-9.125-5.508-5.846-1.68-2.554-10.56-2.883-12.192-.96-.043-1.897-.332-2.864-.267z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M748.594 469.5c.658 1.391 2.328 1.69.732.103l-.226-.105-.506.002zm5.312 6.375c1.72 3.427 4.087 6.761 4.282 10.719 5.453 2.478 7.384 8.638 9.75 13.656 1.832 1.538 5.906 5.477 7.615 2.325-.933-2.556-6.376-.673-5.535-4.887.346-3.101-2.511-4.341-4.107-6.356-1.647-2.76-.894-6.15-1.973-9.082-2.183-1.136-4.356-2.313-6.711-2.548-1.467-1.01-.866-4.315-3.32-3.827z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M793.844 457.844c-1.75 3.093-3.972 5.916-5.067 9.27-2.78 3.931-6.725 7.232-11.433 8.511-.915 3.543-.251 7.604 2.281 10.344.007 2.84.73 5.803 3.974 6.35 3.051 1.494 7.424-.276 7.901-3.819-3.018-1.503-3.107-5.607-1.273-8.067.993-2.974 6.824-3.111 4.798-6.902-2.204-3.214-2.253-7.756.646-10.58 1.785-1.567 2.322-3.652-.455-4.325-.462-.253-.928-.5-1.372-.782z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M820.906 448.313c-1.053 1.91 2.45 3.481 2.187 5.105 1.609.522 3.787.048 2.542-1.972-.616-1.868-3.068-2.544-4.729-3.134zm19.5 2c-2.208-.04-2.184 2.645-2.777 4.163-.85 1.568-1.895 3.104-1.68 5.02.033 2.11 1.01 4.166 2.582 5.567 1.44 3.479-.231 7.135-.562 10.656 2.293 1.487 4.86 3.652 7.788 2.782 2.005-.516 5.05.385 6.024-2.157 1.661-2.399 5.014-2.526 7.483-1.45 2.458 1.005 4.793 2.564 6.33 4.762-.446-3.183-3.613-5.6-3.076-8.978.728-1.287 1.2-2.955-.688-3.444-2.068-.816-4.286-1.262-6.17-2.5-1.408-.93-3.61-1.755-3.78-3.637.785-1.285 3.573-.437 3.968-.537-4.459-1.423-8.03-4.903-10.317-8.904-1.774-.07-3.58-.436-5.125-1.344zm-10.687 7.812c-1.08.612-1.201 1.463.177.85 1.427-.202.698-.299-.177-.85z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M812.125 477.438c-2.95 1.69-7.265-.242-9.488 2.844.529 3.572-1.95 6.913-1.918 10.53-1.707 1.663.954 5.984.163 6.38.986-3.566 5.326-3.024 5.695.6-.004 1.473 3.356 3.24 1.28 1.113-1.157-2.202-.333-5.725-3.341-6.314-1.348-2.4-.203-5.843.393-7.644-3.53-2.227.115-7.706 3.59-5.586 1.227.063 3.753-.269 3.626-1.923z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M785.375 507.531c-1.038 1.118-5.15 2.313-3.756 3.352 3.326.106 6.601.433 9.768-.654 3.468.079 6.64 2.568 10.176 1.646 1.606 1.657 2.912-.983.466-.682-4.383-.242-7.841-4.392-12.404-3.443-1.417-.063-2.832-.18-4.25-.219z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M432.906 141.063c-2.974 1.518-7.019 3.331-9.344 4.093-.747 4.23-6.421 3.65-8.03 6.906-1.726 5.092-8.35 1.788-11.344 4.625-3.98.095-7.723 1.848-10.045 5.116-1.271 1.01-.327 4.49-2.827 5.299 1.817-2.424-2.044 3.204-4.128 1.742 1.275 2.248-3.804 5.46.633 3.302 3.55-3.524 8.4-1.609 11.741.417 3.073 2.311 5.906 5.633 6.47 9.687 2.456 2.926 1.593 6.795 5.44 8.55.56 3.5 4.438 5.454 3.275 9.353.18 3.074-2.794 5.806-3.528 7.722 2.103 3.955.898 8.257 2.713 12.296.999 3.547 5.348 3.482 6.92 6.382 1.443-.318.768-4.77 2.503-6.243-.196-4.212 3.368-6.421 2.051-10.435-.31-4.397 4.822-6.59 8.58-6.238 4.005 1.257 4.077-4.724 7.983-4.168 2.339-1.904 5.14-2.08 4.946-5.864.975-2.625 4.279-2.543 6.116-2.074-1.33-3.16 1.029-7.765 3.594-9.406-3.66-3.583 1.409-8.056 5.219-7.938 2.123-1.013-.05-6.462 2.344-8.656-4.957-1.8-1.595-6.857-2.242-10.327 1.964-4.365-4.44-2.09-6.915-1.923-2.895-.802-5.125-1.923-8.375-1.844-4.082-.756-3.666-7.156.344-7.656-.821-1.708-6.409-.793-9.063-2.437-1.679-.076-3.37.051-5.03-.281zm34.406 4.25.188.812-.188-.813zm-6.218 33.5-.281.812.28-.813zm-36.313 41.28c-.19-.062-.722.393 0 0zm-7.5 4.688.25.281-.25-.28z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M224.656 178c-5.546 2.204-17.73 4.261-8.422 11.322-1.107 5.925-7.418 6.39-5.397 12.991-1.78 7.887-18.127 2.013-10.087 11.45 2.215 4.463 9.536-.458 11.594 5.674 4.993-10.034 16.477-5.393 23.936-3.595 5.565 5.453 15.756 5.56 17.323 14.784 2.839 8.346 9.247 15.808 12 24.543 3.677 8.722 3.124 17.48-1.221 26.26-2.382 10.613-5.336 22.63 2.277 31.86-.419 10.756 9.903 15.682 9.09 26.776 1.37 9.638 10.938 5.183 17.938 6.06-5.726 2.007-6.025 3.964-3.16 8.316-5.006 10.29 8.518 7.931 13.56 12.65 6.386 1.903 6.95 21.657 11.255 7.936-1.244-2.513-4.837-9.965-.018-12.935-9.447 6.205-21.566-3.82-17.512-14.217-1.21-8.242 7.765-16.244 15.142-19.147 9.242-3 18.695-2.483 27.952-.694 6.51-4.055 10.094 9.718 10.483-1.217 1.496-8.016 17.347-7.766 11.973-17.656 4.433-8.054 13.504-12.566 14.587-22.613 3.39-6.437 19.258-7.465 10.272-13.56-9.874 5.521-11.764-12.545-1.193-13.037 5.808-2.655 12.926 1.671 16.012-5.618 5.683-.458 9.747-3.845 3.522-7.52-1.607-5.658-5.537-.405-6.18-7.772-.707-6.956-5.893-8.701-11.2-4.907-8.508-.748-2.814-19.758-11.5-14.531-.61 5.61-7.473 8.13-2.656 14.379.866 8.618-10.685 9.945-7.971 18-2.615 3.686-4.792 21.467-10.051 11.492-4.552-5.793-3.309-14.283-7.704-19.096-8.372 4.27-17.038-8.03-21.009-15.843-1.958-10.85 6.873-19.57 14.584-25.722-1.84-6.418 4.445-12.994 8.688-5.157 7.539-5.205-3.485-6.658-5.97-10.687-7.386 5.234-16.985 4.536-24.324 3.655-9.254 4.057-19.568 5.208-26.934-3.524-7.15-4.36-13.274-4.787-21.168-1.133-9.707 4.57-18.548-1.7-28.727-.503-6.719-2.179-14.065-3.733-19.784-7.464zm134.75 13.781c-2.335.25.95.63 0 0zm-155.25 2.25c-1.559 2.696 3.93.872 0 0z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                    <path
                        d="M345.656 385.375c-5.808 5.107-17.985 4.866-18.534 14.228-4.82 7.768-4.57 16.227-9.332 24.056-.34 6.76-1.105 13.714 3.78 19.737 2.864 5.946 9.827 10.154 10.254 17.14 6.176 3.914 12.388 7.599 16.986 13.085 2.426 8.843-1.229 18.344.065 27.067-2.733 7.236.298 14.991-1.7 22.346 1.102 7.22-5.466 15.963.294 21.872-.226 8.388-5.561 17.352-.916 25.267.712 9.374 6.372 17.86 15.307 21.185 6.642 4.966-1.541-5.648-.9-8.546-.645-8.04 2.403-16.284.541-24.539 6.36-4.658 2.268-16.242 9.524-18.411-9.033-7.658 12.982-4.45 13.133-8.492-7.964-6.417 1.96-11.547 8.404-11.058 7.41-3.286 7.944-11.86 13.033-16.719-.817-7.779 2.935-18.753 12.356-19.048 10.09.63 14.528-9.912 16.522-17.354.086-8.184 1.544-16.437 6.376-22.01 10.099-1.463 4.306-13.363-2.731-14.672-8.227-2.64-16.242-5.365-24.391-7.435-7.892 2.077-16.899-5.61-10.627-11.561-1.348-10.47-14.967-4.95-20.814-10.439-6.109-2.894-9.728-11.636-17.08-11.304-5.632-1.903-16.565 1.522-19.55-4.395zm47.938 134.313z"
                        style={{
                            opacity: 1,
                            fill: DEFAULT_TERRITORY_COLOR,
                            fillOpacity: 1,
                            fillRule: "evenodd",
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeOpacity: 1,
                            display: "inline",
                        }}
                    />
                </g>

                <GameTerritories/>
            </svg>
        </Box>
    )
}
