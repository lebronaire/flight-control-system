#include "LBAUtils.h"
#include "Led.h"
#include "Switch.h"
#include "LBAServo.h"

LBALed led;
LBASwitch toggleSwitch;
LBAServo servos;

void checkStateChanges() {
  toggleSwitch.onLoop();
}

void handleInitialize(int pin, ComponentType type, String val) {
  if (type == TYPE_LED) {
    led.initialize(pin);
    return;
  }
  else if (type == TYPE_SWITCH) {
    toggleSwitch.initialize(pin);
    return;
  }
  else if (type == TYPE_SERVO) {
    servos.initialize(pin);
    return;
  }

//  logger("ERROR: Unkown component type");
}

void handleUpdateState(int pin, ComponentType type, String val) {
  if (type == TYPE_LED) {
    led.update(pin, val);
    return;
  }
  else if (type == TYPE_SERVO) {
    servos.update(pin, val);
    return;
  }

//  logger("ERROR: Unkown component type");
}
