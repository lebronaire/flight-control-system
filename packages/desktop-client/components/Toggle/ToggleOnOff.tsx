import { useState, useEffect } from 'react';

import {
    Radio,
    RadioGroup,
    Stack,
} from "@chakra-ui/react";

import { ControlsConfigControl } from '../../shared/types';
import { api } from '../../shared/Api';
import { useControlValue } from '../../hooks/api'

interface Props {
    control: ControlsConfigControl
};

export const ToggleOnOff = (props: Props) => {
    const { control } = props;

    const controlValue = useControlValue(control.iocpVariable);

    const updateState = (val: string) => {
        api.setValue(control.iocpVariable, parseInt(val));
    };

    return (
        <RadioGroup onChange={updateState} value={controlValue !== undefined && controlValue !== null ? controlValue : control.defaultValue}>
            <Stack direction="row">
                {control.valueOptions.map(vv => (
                    <Radio key={vv[1]} value={vv[1]} colorScheme="pink">
                        {vv[0]}
                    </Radio>
                ))}
            </Stack>
        </RadioGroup>
    );
};