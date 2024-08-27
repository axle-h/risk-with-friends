'use client'

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertProps,
    AlertTitle,
    Box,
    Center,
    Spinner,
} from "@chakra-ui/react";
import React, {useEffect} from "react";

export function ErrorAlert({ error, title = 'Something went wrong', ...props }: AlertProps & { error: any, title?: string }) {
    useEffect(() => console.log(error), [error]);
    return (<Alert {...props} status='error' variant='left-accent'>
        <AlertIcon />
        <Box>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {error.toString()}
            </AlertDescription>
        </Box>
    </Alert>)
}

export function Loading() {
    return <Center py={4}><Spinner /></Center>
}

export function NotFound({ entity, id }: { entity: string, id: string }) {
    return (<Alert status='error' variant='left-accent'>
        <AlertIcon />
        <Box>
            <AlertTitle style={{ textTransform: 'capitalize' }}>{entity} not found</AlertTitle>
            <AlertDescription>
                No {entity} exists with id {id}
            </AlertDescription>
        </Box>
    </Alert>)
}

export function NoData() {
    return (<Alert status='info' variant='left-accent'>
        <AlertIcon />
        <AlertTitle>No data</AlertTitle>
    </Alert>)
}

export function UpToDate() {
    return (<Alert status='success' variant='left-accent'>
        <AlertIcon />
        <AlertTitle>You&apos;re all up to date!</AlertTitle>
    </Alert>)
}
