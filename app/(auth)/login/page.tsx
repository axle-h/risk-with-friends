'use client'

import {
    Flex,
    Heading,
} from '@chakra-ui/react';
import {LoginIcon} from "@/components/icons";
import {Button} from "@/components/ui/button";
import { useFormStatus } from 'react-dom'
import {signInOnServer} from "@/app/(auth)/login/actions";
import {useSearchParams} from "next/navigation";

export default function LoginPage() {
    const searchParams = useSearchParams()

    const redirectTo = searchParams.get("redirectTo") || searchParams.get('callbackUrl') || '/'

    return (
        <Flex
            alignItems="center"
            flexDirection="column"
            bg='white'
            _dark={{
                bg: 'gray.900'
            }}
            py={20}
            borderRadius={8}
            boxShadow="lg"
        >
            <Heading mb={6}>Login</Heading>
            <form action={signInOnServer}>
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <LoginButton />
            </form>

        </Flex>
    )
}

function LoginButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            colorScheme="teal"
            variant="outline"
            type="submit"
            loading={pending}
            loadingText="Signing you in"
        >
            <LoginIcon />
            Login with ax-h.com
        </Button>
    )
}