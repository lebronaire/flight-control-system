import {
    Box,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Stack
} from '@chakra-ui/react';

import { useControlsConfig, useControlValues } from '../../hooks/api';

import { ControlGroup } from './ControlGroup';

export const ControlList = () => {
    const { fetching, controlsConfig } = useControlsConfig();
    const controlValues = useControlValues();

    if (fetching || controlValues.fetching) {
        return (
            <Box p={5}>
                <Spinner />
            </Box>
        );
    }
    else if (!controlsConfig) {
        return (
            <Box p={5}>
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>Unable to load config</AlertTitle>
                    <AlertDescription>Could not find the list of flight controls.</AlertDescription>
                </Alert>
            </Box>
        );
    }
    else if (!controlValues.values) {
        return (
            <Box p={5}>
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>Unable to control values</AlertTitle>
                    <AlertDescription></AlertDescription>
                </Alert>
            </Box>
        );
    }

    return (
        <Stack>
            {controlsConfig.map(cc => <ControlGroup key={cc.groupName} controlGroup={cc} />)}
        </Stack>
    );
};