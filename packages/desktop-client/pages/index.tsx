import {
    Box,
    Heading,
    Flex,
    Spacer,
    IconButton,
} from '@chakra-ui/react';

import Link from 'next/link';

import { SettingsIcon } from '@chakra-ui/icons';
import { ControlList } from '../components/Controls/ControlList';

export default function Home() {
    return (
        <Box py={10} px={5}>
            <Flex>
                <Heading>LébrønAIRE</Heading>
                <Spacer />

                <Link href="/settings">
                    <IconButton aria-label="Settings" icon={<SettingsIcon />} />
                </Link>
            </Flex>

            <Box my={10}>
                <ControlList />
            </Box>
        </Box>
    )
}
