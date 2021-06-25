import {
    Box,
    Heading,
    Flex,
    Spacer,
} from '@chakra-ui/react';

import { ControlList } from '../components/Controls/ControlList';
import { StatusBar } from '../components/StatusBar/StatusBar'

export default function Home() {
    return (
        <Box py={2} px={2}>
            <Flex>
                <Spacer />
                <StatusBar />
            </Flex>

            <Box py={8} px={3}>
                <Flex>
                    <Heading>LébrønAIRE</Heading>
                    <Spacer />
                </Flex>

                <Box my={10}>
                    <ControlList />
                </Box>
            </Box>
        </Box>
    )
}
