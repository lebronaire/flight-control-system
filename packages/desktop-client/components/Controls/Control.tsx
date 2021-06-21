import { ControlsConfigControl } from '../../shared/types';

import {
    Tr,
    Td,
    Text
} from '@chakra-ui/react';

import { ToggleOnOff } from '../Toggle/ToggleOnOff';

export const Control = (props: { control: ControlsConfigControl }) => {
    const { control } = props;

    const ControlComponent = ToggleOnOff;

    let displayName = control.name || control.prosimName;
    let prosimName = control.name ? control.prosimName : '';

    return (
        <Tr>
            <Td>
                {displayName}
                {/* <Text textColor="gray.400" fontSize={10}>{prosimName}</Text> */}
            </Td>
            <Td><ControlComponent control={control} /></Td>
            <Td>{control.iocpVariable}</Td>
        </Tr>
    );
};