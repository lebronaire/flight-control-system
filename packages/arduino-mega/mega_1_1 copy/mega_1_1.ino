//#include "LBATypes.h"
//#include "LBA_Logger.h"
//#include "LBASerial.h"
//#include "LBA_RouteHandlers.h"



void setup() {
  Serial.begin(115200);

  logger("Ready...");
}

void loop() {
  while (Serial.available()) {
//    String msg = getLatestSerialMessage();
//    command cmd = getCommandFromSerialMessage(msg);
//    int pin = getPinFromSerialMessage(msg);
//    String val = getValueFromSerialMessage(msg);
//    String type = getTypeFromSerialMessage(val);
//    String componentVal = getComponentValue(val);
//
//    if (cmd == CMD_INITIALIZE) {
//      handleInitialize(pin, type, val);
//      return;
//    }
//    else if (cmd == CMD_UPDATE) {
//      handleUpdateState(pin, type, componentVal);
//      return;
//    }
  }

  delay(1000);
}
