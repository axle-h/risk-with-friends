'use client'

import { ChakraProvider} from '@chakra-ui/react'
import {system} from "@/components/theme";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ChakraProvider value={system}>
            {children}
        </ChakraProvider>
    )
}