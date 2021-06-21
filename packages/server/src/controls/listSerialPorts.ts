import SerialPort from 'serialport';

export const listSerialPorts = async () => {
    const ports = await SerialPort.list();
    return ports
        .map(pp => ({
            path: pp.path,
            manufacturer: pp.manufacturer
        }))
        .sort((a, b) => {
            // Use toUpperCase() to ignore character casing
            const pathA = a.path.toUpperCase();
            const pathB = b.path.toUpperCase();

            let comparison = 0;
            if (pathA > pathB) {
                comparison = 1;
            } else if (pathA < pathB) {
                comparison = -1;
            }
            return comparison;
        });
};
