#include "Switch.h"
#include "LBAUtils.h"

LBASwitch::LBASwitch() {
  for (int ii = 0; ii < MAX_PINS; ii++) {
    // Set default values to -1
    state[ii] = -1;
  }
}

void LBASwitch::initialize(int pin) {
  pinMode(pin, INPUT_PULLUP);
  state[pin] = 0;

  String msg = "";
  logger(msg + "Init SWITCH:" + pin);
};

void LBASwitch::onLoop() {
  for (int ii = 0; ii < MAX_PINS; ii++) {
    int currentVal = state[ii];

    if (currentVal > -1) {
      // Only check state of active/initialised pins
      checkStateChanges(ii);
    }
  }
};

void LBASwitch::checkStateChanges(int pin) {
  int reading = digitalRead(pin);
  int stateValue = state[pin];
  int currentValue = 0;

  if (reading == HIGH) {
    currentValue = 1;
  }

  if (currentValue != stateValue) {
    // Send new value to the serial port
    sendMessage(pin, currentValue);

    state[pin] = currentValue;
  }
}
