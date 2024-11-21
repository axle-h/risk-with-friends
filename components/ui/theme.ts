import {createSystem, defaultConfig} from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
            fonts: {
                heading: { value: `var(--font-rubik)` },
                body: { value: `var(--font-rubik)` },
            },
        },
    },
})