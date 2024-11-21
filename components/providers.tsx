'use client'

import { Provider as ChakraProvider } from '@/components/ui/provider'
import React from "react";
import {SessionProvider} from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ChakraProvider>
            <SessionProvider>
                {children}
            </SessionProvider>
        </ChakraProvider>
    )
}