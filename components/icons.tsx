import {Icon, IconProps, BoxProps, Text, Box} from "@chakra-ui/react"
import { FiMenu, FiArrowRight, FiPlus, FiSun, FiMoon, FiLogIn, FiLogOut, FiHome, FiExternalLink } from "react-icons/fi"
import {IconType} from "react-icons";
import NextImage from "next/image";

function toChakraIcon(IconType: IconType) {
    return function ChakraIcon(props: IconProps) {
        return <Icon {...props}><IconType /></Icon>
    }
}


export const MenuIcon = toChakraIcon(FiMenu)
export const ArrowRightIcon = toChakraIcon(FiArrowRight)
export const PlusIcon = toChakraIcon(FiPlus)
export const SunIcon = toChakraIcon(FiSun)
export const MoonIcon = toChakraIcon(FiMoon)
export const LoginIcon = toChakraIcon(FiLogIn)
export const LogoutIcon = toChakraIcon(FiLogOut)
export const HomeIcon = toChakraIcon(FiHome)
export const ExternalLinkIcon = toChakraIcon(FiExternalLink)

export function AppIcon(props: BoxProps) {
    return (
        <Box {...props} asChild>
            <NextImage src="/assets/icon.png" alt="" width={10} height={10} unoptimized />
        </Box>
    )
}

export function AppName() {
    return <Text ml={1}><b>RISK</b> With Friends</Text>
}