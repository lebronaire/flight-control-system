#include "Led.h"
#include "LBAUtils.h"

void LBALed::initialize(int pin) {
  pinMode(pin, OUTPUT);
  digitalWrite(pin, HIGH);

  String msg = "";
  logger(msg + "Init LED:" + pin);
};

void LBALed::update(int pin, String val) {
  int nextState = val.toInt();

  if (nextState == 1) {
    digitalWrite(pin, HIGH);
  }
  else {
    digitalWrite(pin, LOW);
  }
};

void LBALed::onLoop() {
  // Nothing to do for every loop
};
