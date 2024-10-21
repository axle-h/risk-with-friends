import {SVGProps} from "react";
import * as React from "react";

export interface DiceGroupProps extends SVGProps<SVGSVGElement> {
    count: number
    diceSize: number
}

export function DiceGroup({ count, diceSize, ...props }: DiceGroupProps) {
    const dice = Array.from({length: count}, (_, i) =>
        <DiceVector key={`dice-${i}`} width={diceSize} height={diceSize} x={i * diceSize} y={0}/>
    )
    return (
        <g {...props}>
            {dice}
        </g>
    )
}

export function DiceVector(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props}>
            <path
                d="M16.409 5.691l-.242.141-6.105 3.552c-.348.202-.738.303-1.127.303s-.778-.101-1.127-.303L1.705 5.831l-.242-.141a.79.79 0 0 1 0-1.364L7.807.635c.349-.203.739-.304 1.129-.304s.78.101 1.129.304l6.344 3.691a.79.79 0 0 1 0 1.364"
                fill="#e2ede9"/>
            <path
                d="M8.936 10.565v7.854a.92.92 0 0 1-1.376.794l-6.115-3.559C.754 15.252.329 14.513.329 13.713V6.611a.92.92 0 0 1 1.378-.78l6.105 3.551.671.39c.282.164.456.466.456.792"
                fill="#c9e0da"/>
            <path
                d="M17.546 6.611v7.102c0 .8-.425 1.539-1.116 1.941l-6.115 3.558c-.611.355-1.376-.086-1.376-.793v-7.854c0-.326.174-.628.456-.792l.671-.39.999-.581 5.106-2.97a.92.92 0 0 1 1.378.78"
                fill="#a8beb8"/>
            <path d="M16.409 5.691l-.242.141-.371.216s-.734-1.949-3.918-4.356l4.53 2.636a.79.79 0 0 1 0 1.364"
                  fill="#c9e0da"/>
            <path d="M8.936 18.419a.92.92 0 0 1-1.376.794l-4.345-2.529c.099.054 3.379 1.832 5.723 1.735"
                  fill="#b1c7c2"/>
            <path
                d="M17.546 6.611v7.102c0 .8-.425 1.539-1.116 1.941l-6.115 3.558c-.611.355-1.376-.086-1.376-.793 1.515-.062 3.882-1.873 5.402-3.181.926-.797 1.459-1.958 1.459-3.18V6.047l.371-.216a.92.92 0 0 1 1.378.78"
                fill="#8d9f9c"/>
            <g fill="#fff">
                <path
                    d="M8.417 1.371l-3.322 1.88c-.105.06-.115.207-.02.28h0c.043.033.1.044.152.028.554-.166 3.749-1.106 5.566-1.241.179-.013.225-.255.064-.333l-1.326-.648c-.354-.173-.771-.16-1.114.034M2.688 7.14c.128.075.102.266-.042.305-1.226.326-1.337 2.344-1.436 2.809-.01.024-.016.047-.032.066a.15.15 0 0 1-.058.044c-.102.044-.216-.029-.218-.141L.863 6.768c0-.307.329-.5.594-.346l1.231.718M1.28 11.148c0 .115-.093.208-.208.208s-.208-.093-.208-.208.093-.208.208-.208.208.093.208.208"/>
                <path
                    d="M4.491 3.969c-.122.071-.268.047-.326-.053s-.01-.238.117-.309.268-.047.326.053.01.238-.117.308"/>
            </g>
            <g fill="#131c32">
                <path
                    d="M16.267 15.371l-5.492 3.195-.625.363a.58.58 0 0 1-.591 0c-.185-.107-.296-.298-.296-.512v-7.854a.59.59 0 0 1 .293-.51l.671-.39 1.59-.925 4.512-2.625a.58.58 0 0 1 .591 0c.185.106.295.296.296.509v7.092c0 .68-.365 1.315-.952 1.658zM.654 13.713V6.622c.001-.213.111-.403.296-.51s.406-.106.591 0l1.279.744 4.823 2.806.671.39a.59.59 0 0 1 .293.51v7.854c0 .214-.111.405-.296.512s-.406.106-.591 0l-6.117-3.559c-.587-.343-.952-.977-.952-1.658zM7.971.918a1.92 1.92 0 0 1 .965-.26c.334 0 .667.087.965.26l6.344 3.691h0a.46.46 0 0 1 .23.4.46.46 0 0 1-.229.399l-4.742 2.759-1.606.934a1.92 1.92 0 0 1-1.924 0L2.489 5.909l-.862-.501h0a.46.46 0 0 1-.23-.4.46.46 0 0 1 .23-.4h0zm9.901 5.706v-.35a2.58 2.58 0 0 0-1.279-2.223L10.23.348c-.798-.464-1.789-.464-2.587 0L1.279 4.051A2.58 2.58 0 0 0 0 6.274v.34 7.1h0c0 .905.489 1.749 1.27 2.208h0 .01l6.364 3.704a2.57 2.57 0 0 0 2.587 0l6.364-3.703.01-.001h0a2.58 2.58 0 0 0 1.27-2.208h0v-7.1"/>
                <use href="#B"/>
                <use href="#B" x="3.719" y="2.147"/>
                <path
                    d="M2.675 14.617c.496.286.899.056.901-.514a1.98 1.98 0 0 0-.895-1.55c-.496-.286-.899-.057-.901.513a1.98 1.98 0 0 0 .895 1.55m3.719 2.148c.496.286.899.056.901-.513A1.98 1.98 0 0 0 6.4 14.7c-.496-.286-.899-.056-.901.513a1.98 1.98 0 0 0 .895 1.55"/>
                <path
                    d="M4.541 13.48c.496.286.899.057.901-.514a1.98 1.98 0 0 0-.895-1.55c-.496-.286-.899-.056-.901.513a1.98 1.98 0 0 0 .895 1.55m10.639-5.2c-.496.286-.897.981-.895 1.55s.405.8.901.513.897-.98.895-1.55-.405-.8-.901-.513M11.473 14.7c-.496.286-.897.98-.895 1.55s.405.8.901.513.897-.98.895-1.55-.405-.8-.901-.513m1.853-3.283c-.496.286-.897.98-.895 1.55s.405.8.901.514.897-.98.895-1.55-.405-.8-.901-.513m-5.293-5.88c.496.286 1.297.286 1.79 0s.49-.751-.01-1.037-1.297-.286-1.79 0-.49.75.01 1.037"/>
            </g>
            <defs>
                <path id="B"
                      d="M2.687 10.343c.496.286.899.057.901-.513a1.98 1.98 0 0 0-.895-1.55c-.496-.286-.899-.056-.901.513a1.98 1.98 0 0 0 .895 1.55"/>
            </defs>
        </svg>
    )
}