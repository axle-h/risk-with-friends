import {SignInOptions} from "next-auth/react";
import {
    Flex,
    Heading,
    Button,
} from '@chakra-ui/react';
import {LoginIcon} from "@/components/icons";
import {signIn} from '@/auth'

export default async function LoginPage({ searchParams: searchParamsPromise }: { searchParams: Promise<SignInOptions> }) {
    const { callbackUrl, redirectTo } = await searchParamsPromise
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
            <form action={async () => {
                'use server'
                await signIn('axh-sso', { redirectTo: redirectTo || callbackUrl || '/' })
            }}>
                <Button
                    colorScheme="teal"
                    variant="outline"
                    type="submit"
                >
                    <LoginIcon />
                    Login with ax-h.com
                </Button>
            </form>

        </Flex>
    )
}