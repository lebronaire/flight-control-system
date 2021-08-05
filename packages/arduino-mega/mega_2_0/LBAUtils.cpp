#include "LBAUtils.h"
#include <Arduino.h>

void logger(String msg) {
  Serial.print("arduino log: ");
  Serial.println(msg);
}

void sendMessage(int pin, int value) {
  String msg = "";
  Serial.println(msg + pin + "=" + value);
};
