import {Icon, IconProps} from "@chakra-ui/react"
import { FiMenu, FiArrowRight, FiPlus } from "react-icons/fi"

export function MenuIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <FiMenu />
        </Icon>
    )
}

export function ArrowRightIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <FiArrowRight />
        </Icon>
    )
}

export function PlusIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <FiPlus />
        </Icon>
    )
}