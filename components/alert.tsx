'use client'

import {
    Alert,
    Box,
    Center,
    Spinner,
} from "@chakra-ui/react";
import React, {useEffect} from "react";

export function ErrorAlert({ error, title = 'Something went wrong', ...props }: Alert.RootProps & { error: any, title?: string }) {
    useEffect(() => console.log(error), [error]);
    return (<Alert.Root {...props} status='error' variant='outline'>
        <Alert.Indicator />
        <Box>
            <Alert.Title>{title}</Alert.Title>
            <Alert.Description>
                {error.toString()}
            </Alert.Description>
        </Box>
    </Alert.Root>)
}

export function Loading() {
    return <Center py={4}><Spinner /></Center>
}

export function NotFound({ entity, id }: { entity: string, id: string }) {
    return (<Alert.Root status='error' variant='outline'>
        <Alert.Indicator />
        <Box>
            <Alert.Title style={{ textTransform: 'capitalize' }}>{entity} not found</Alert.Title>
            <Alert.Description>
                No {entity} exists with id {id}
            </Alert.Description>
        </Box>
    </Alert.Root>)
}

export function NoData() {
    return (<Alert.Root status='info' variant='outline'>
        <Alert.Indicator />
        <Alert.Title>No data</Alert.Title>
    </Alert.Root>)
}