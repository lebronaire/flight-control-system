#include "LBASerialDecoder.h"

void LBASerialDecoder::readFromSerial() {
  message = Serial.readStringUntil('\n');
};

InputCommand LBASerialDecoder::getCommand() {
  String cmd = message.substring(0, 1);

  if (cmd == "I") {
    return CMD_INITIALIZE;
  }
  else if (cmd == "U") {
    return CMD_UPDATE;
  }

  return CMD_ERROR;
}

int LBASerialDecoder::getPin() {
  String pin = message.substring(1, 3);
  return pin.toInt();
}

String LBASerialDecoder::getVal() {
  String val = message.substring(3, message.length());
  return val;
}

String LBASerialDecoder::getComponentVal() {
  String val = getVal();
  String componentVal = val.substring(1, val.length());

  return componentVal;
}

ComponentType LBASerialDecoder::getType() {
  String val = getVal();
  String type = val.substring(0, 1);

  if (type == "L") {
    return TYPE_LED;
  }
  else if (type == "S") {
    return TYPE_SWITCH;
  }
  else if (type == "O") {
    return TYPE_SERVO;
  }
}
