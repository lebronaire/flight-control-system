#include "LBATypes.h"

String getLatestSerialMessage() {
  String message = Serial.readStringUntil('\n');

  return message;
}

command getCommandFromSerialMessage(String msg) {
  String cmd = msg.substring(0, 1);

  if (cmd == "I") {
    return CMD_INITIALIZE;
  }
  else if (cmd == "U") {
    return CMD_UPDATE;
  }

  return CMD_ERROR;
}

int getPinFromSerialMessage(String msg) {
  String pin = msg.substring(1, 3);

  return pin.toInt();
}

String getValueFromSerialMessage(String msg) {
  String val = msg.substring(3, msg.length());

  return val;
}

String getTypeFromSerialMessage(String val) {
  return val.substring(0, 1);
}

String getComponentValue(String val) {
  String componentVal = val.substring(1, val.length());

  return componentVal;
}
