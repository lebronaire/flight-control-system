import {
    Stack,
    Box,
    IconButton,
} from "@chakra-ui/react";

import { CheckCircleIcon } from '@chakra-ui/icons'
import { SettingsIcon } from '@chakra-ui/icons';

import Link from 'next/link';

import { useStatus } from '../../hooks/api'


export const StatusBar = () => {
    const { status } = useStatus();

    if (!status) {
        return null;
    }

    return (
        <Stack direction="row">
            <Box fontSize={12}>
                <IconButton size="xs" aria-label="Settings" bgColor="white" icon={<CheckCircleIcon color={status.iocp === 'connected' ? 'green.500' : 'red.500'} />} />
                IOCP
            </Box>

            <Box fontSize={12}>
                <IconButton size="xs" aria-label="Settings" bgColor="white" icon={<CheckCircleIcon color={status.arduino1 === 'connected' ? 'green.500' : 'red.500'} />} />
                Arduino
            </Box>

            <Link href="/settings">
                <Box fontSize={12}>
                    <IconButton size="xs" aria-label="Settings" bgColor="white" icon={<SettingsIcon />} />
                    Settings
                </Box>
            </Link>
        </Stack>
    );
};