import {
    Stack,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
} from '@chakra-ui/react';

import { ControlsConfigGroup } from '../../shared/types';

import { Control } from './Control'

export const ControlGroup = (props: { controlGroup: ControlsConfigGroup }) => {
    const { controlGroup } = props;

    return (
        <Stack my={10}>
            <Heading fontSize={18}>{controlGroup.groupName}</Heading>

            <Table variant="striped" size="sm" colorScheme="orange">
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th>States</Th>
                        <Th>IOCP #</Th>
                    </Tr>
                </Thead>

                <Tbody>
                    {controlGroup.items.map(c => <Control key={c.prosimName} control={c} />)}
                </Tbody>
            </Table>
        </Stack>
    );
};