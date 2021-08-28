#include "Potench.h"
#include "LBAUtils.h"

Potench::Potench() {
  for (int ii = 0; ii < MAX_PINS; ii++) {
    // Set default values to -1
    state[ii] = -1;
  }
}

void Potench::initialize(int pin) {
  pinMode(pin, INPUT);
  state[pin] = 0;

  String msg = "";
  logger(msg + "Init POTENCH:" + pin);
};

void Potench::onLoop() {
  for (int ii = 0; ii < MAX_PINS; ii++) {
    int currentVal = state[ii];

    if (currentVal > -1) {
      // Only check state of active/initialised pins
      checkStateChanges(ii);
    }
  }
};

void Potench::checkStateChanges(int pin) {
  int currentValue = analogRead(pin);
  int stateValue = state[pin];

  int THRESHOLD = 5;
  int minThreshold = stateValue - THRESHOLD;
  int maxThreshold = stateValue + THRESHOLD;

  if (currentValue < minThreshold || currentValue > maxThreshold) {
    // Send new value to the serial port
    sendMessage(pin, currentValue);

    state[pin] = currentValue;
  }
}
