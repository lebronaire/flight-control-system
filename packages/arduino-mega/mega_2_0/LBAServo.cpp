#include "LBAServo.h"
#include "LBAUtils.h"
#include <Servo.h>

Servo s;

LBAServo::LBAServo() {
  for (int ii = 0; ii < MAX_PINS; ii++) {
    // Set default values to -1
    state[ii] = -1;
  }
}

void LBAServo::initialize(int pin) {
  s.attach(pin);
  s.write(0);
  String msg = "";
  logger(msg + "Init Servo:" + pin);
};

void LBAServo::update(int pin, String val) {
  int nextState = val.toInt();

  s.attach(pin);
  s.write(nextState);
  delay(15);

  // detach servo power from pin to stop buzzing
  if (nextState == 0) {
    delay(15);
    s.detach();
  }
};
