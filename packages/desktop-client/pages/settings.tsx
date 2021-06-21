import { useState } from 'react';

import {
    Box,
    Heading,
    Stack,
    Button,
    Input,
    Text,
    Select,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';

import Link from 'next/link';

import { useSettings } from '../hooks/api';
import { api } from '../shared/Api';
import { SettingsStore } from '../shared/types';

const LABEL_PROPS = {
    py: 2,
    width: 250,
};

export default function Settings() {
    const [iocpHost, setIocpHost] = useState<string | undefined>();
    const [iocpPort, setIocpPort] = useState<string | undefined>();
    const [serialPath, setSerialPath] = useState<string | undefined>();
    const [configXmlPath, setConfigXmlPath] = useState<string | undefined>();
    const [saving, setSaving] = useState(false);
    const { fetching, settings } = useSettings();

    const onSave = async () => {
        try {
            setSaving(true);

            const nextSettings: SettingsStore = {
                ...settings,
                iocp: {
                    host: iocpHost !== undefined ? iocpHost : settings?.iocp.host,
                    port: iocpPort !== undefined ? iocpPort : settings?.iocp.port,
                },
                serial: {
                    path: serialPath !== undefined ? serialPath : settings?.serial.path,
                    availablePorts: settings?.serial.availablePorts || []
                },
                prosim: {
                    configXMLPath: configXmlPath !== undefined ? (configXmlPath) : settings?.prosim.configXMLPath,
                }
            };

            await api.updateSettings(nextSettings);
        } catch (err) {
            console.log(err);
        }
        finally {
            setSaving(false);
        }
    };

    if (fetching) {
        return (
            <Box p={5}>
                <Spinner />
            </Box>
        );
    }
    else if (!settings) {
        return (
            <Box p={5}>
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>Unable to load settings</AlertTitle>
                    {/* <AlertDescription>Could not find the list of flight controls.</AlertDescription> */}
                </Alert>

                <Stack direction="row" mt={10}>
                    <Link href="/">
                        <Button variant="outline">Cancel</Button>
                    </Link>
                </Stack>
            </Box>
        );
    }

    return (
        <Box py={10} px={5}>
            <Heading>Settings</Heading>

            <Stack my={10} maxWidth={800} spacing={5}>
                <Stack direction="row">
                    <Text {...LABEL_PROPS}>IOCP Host:</Text>
                    <Input required placeholder="eg. 192.168.1.123" defaultValue={settings.iocp.host} onChange={(ee) => setIocpHost(ee.currentTarget.value)} />
                </Stack>

                <Stack direction="row">
                    <Text {...LABEL_PROPS}>IOCP Port:</Text>
                    <Input required type="number" placeholder="eg. 8092" defaultValue={settings.iocp.port} onChange={(ee) => setIocpPort(ee.currentTarget.value)} />
                </Stack>

                <Stack direction="row">
                    <Text {...LABEL_PROPS}>USB Port:</Text>
                    <Select placeholder="Select option" isRequired defaultValue={settings.serial.path} onChange={(ee) => setSerialPath(ee.currentTarget.value)}>
                        {
                            settings.serial.availablePorts.map(pp => (
                                <option key={pp.path} value={pp.path}>{`${pp.path} ${pp.manufacturer || ''}`.trim()}</option>
                            ))
                        }
                    </Select>
                </Stack>

                <Stack direction="row">
                    <Text {...LABEL_PROPS}>Prosim config.xml path:</Text>
                    <Input required placeholder="eg. C:\windows\really\sucks\config.xml" defaultValue={settings.prosim.configXMLPath} onChange={(ee) => setConfigXmlPath(ee.currentTarget.value)} />
                </Stack>
            </Stack>

            <Stack direction="row" mt={10}>
                <Button colorScheme="pink" isLoading={saving} onClick={onSave}>Save</Button>

                <Link href="/">
                    <Button variant="outline" disabled={saving}>Cancel</Button>
                </Link>
            </Stack>
        </Box>
    )
}
