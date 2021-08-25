#ifndef LBA_UTILS
#define LBA_UTILS

#include <Arduino.h>

const int MAX_PINS = 70;

enum ComponentType {
  TYPE_LED,
  TYPE_SERVO,
  TYPE_SWITCH
};

enum InputCommand {
  CMD_INITIALIZE,
  CMD_UPDATE,
  CMD_ERROR
};

void logger(String msg);
void sendMessage(int pin, int value);

#endif
