# LBA CLI

The official CLI of Lebronaire

## About

lba-cli provides a flexible set of commands for connecting any Lebronaire compatible flight controls with Microsoft Flight Simulator 2020. This feat of engineering greatness was made possible in collaboration with LBA's group of companies, most notably Wavo Panels, CBF and their Avionics division.


## Getting Started
```bash

# Install Cli
npm install lba-cli -g

# Create a default config.toml
lba init

# Update config.toml with your own settings

# Launch the daemon with full debug logs
lba start --verbose

```

### Available Commands
```

Lebronaire CLI
---------------

help                            Display basic commands and arguments
init                            Create a 'config.toml' file in the current directory
listArduinoPorts                Display a list of all connected usb ports and their path
start [--verbose]               Connect arduino to iocp/prosim

```

## Contributions

All contributions are welcome but typically rejected. Please feel free to submit a PR and we will promptly reject with an entertaining comment.
