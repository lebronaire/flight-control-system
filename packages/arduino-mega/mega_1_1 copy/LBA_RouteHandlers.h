#include "LBA_Servo.h"
#include "LBA_Led.h"

void handleInitialize(int pin, String type, String val) {
  if (type == TYPE_LED) {
    ledInitialize(pin);
    return;
  }

  Serial.println("ERROR: Unkown component type");
}

void handleUpdateState(int pin, String type, String val) {
  if (type == TYPE_LED) {
    ledUpdateState(pin, val);
    return;
  }

  Serial.println("ERROR: Unkown component type");
}
