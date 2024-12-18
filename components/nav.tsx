'use client'

import {
    Text,
    Flex,
    FlexProps,
    HStack, Box,
} from '@chakra-ui/react'
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from '@/components/ui/menu'
import { Avatar } from '@/components/ui/avatar'
import { Button } from "@/components/ui/button"
import { useColorMode } from "@/components/ui/color-mode"
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useRouter} from "next/navigation";
import {
    SunIcon, MoonIcon,
    AppIcon, AppName,
    LogoutIcon,
} from "@/components/icons";
import React, {useState} from "react";
import {Session} from "next-auth";
import {GameMenu, GameUserMenuItems} from "@/components/game/menu";
import {useGame} from "@/state/hooks";


export interface NavProps extends FlexProps {
    session?: Session
}

function UserMenu({ session }: { session: Session }) {
    if (!session.user) {
        return <></>
    }

    let displayName = ''
    if ('given_name' in session.user) {
        displayName += session.user.given_name + ' '
    }
    if ('family_name' in session.user) {
        displayName += session.user.family_name
    }

    if (!displayName) {
        displayName = session.user.name || ''
    }

    return (
        <>
            <MenuRoot closeOnSelect>
                <MenuTrigger asChild>
                    <Button
                        rounded={'full'}
                        variant={'plain'}
                        cursor={'pointer'}
                        minW={0}>
                        <Avatar size={'sm'} name={displayName} colorPalette={"blue"} />
                    </Button>
                </MenuTrigger>
                <MenuContent>
                    <MenuItem value="logout" asChild>
                        <LogoutButton />
                    </MenuItem>
                    <GameUserMenuItems />
                </MenuContent>
            </MenuRoot>
        </>
    )
}

function LogoutButton() {
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)

    return (
        <DialogRoot role="alertdialog">
            <DialogTrigger asChild>
                <Button variant="plain">
                    <LogoutIcon /> Logout
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle fontSize='lg' fontWeight='bold'>Logout</DialogTitle>
                </DialogHeader>

                <DialogBody>
                    <Text>
                        Are you sure you want to logout?
                    </Text>
                </DialogBody>

                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button>
                            Cancel
                        </Button>
                    </DialogActionTrigger>
                    <Button colorPalette="red"
                            loading={isLoading}
                            loadingText="Logging out..."
                            onClick={() => {
                                setLoading(true)
                                router.replace('/logout');
                            }}
                            ml={3}>
                        <LogoutIcon />
                        Logout
                    </Button>
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    )
}

export function Nav({ session, ...rest }: NavProps) {
    const { colorMode, toggleColorMode } = useColorMode()
    const { data: game } = useGame()

    return (
        <Flex
            px={4}
            height="20"
            alignItems="center"
            bg='white'
            borderBottomWidth="1px"
            borderBottomColor='gray.200'
            justifyContent='space-between'
            _dark={{
                bg: 'gray.900',
                borderBottomColor: 'gray.700'
            }}
            {...rest}>

            {!!game ? <GameMenu /> : (
                <>
                    <Box />
                    <Flex alignItems="center">
                        <AppIcon />
                        <AppName />
                    </Flex>
                </>
            )}

            <HStack gap={{ base: '1', md: '3' }}>
                {!!session ? <UserMenu session={session} /> : <></>}

                <Button
                    onClick={toggleColorMode}
                    variant="ghost"
                    aria-label="change colour mode"
                >
                    {colorMode === 'light' ? <MoonIcon  /> : <SunIcon />}
                </Button>
            </HStack>
        </Flex>
    )
}
