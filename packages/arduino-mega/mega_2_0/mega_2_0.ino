#include "LBAUtils.h"
#include "LBASerialDecoder.h"
#include "Router.h"

LBASerialDecoder lbaDecoder;

void setup() {
  Serial.begin(115200);

  logger("Ready...");
}

void loop() {
  checkStateChanges();
  readSimOutput();

  delay(30);
}

void readSimOutput() {
    while (Serial.available()) {
      lbaDecoder.readFromSerial();
      InputCommand cmd = lbaDecoder.getCommand();
  
      if (cmd == CMD_INITIALIZE) {
        handleInitialize(
          lbaDecoder.getPin(),
          lbaDecoder.getType(),
          lbaDecoder.getVal()
        );
        return;
      }
      else if (cmd == CMD_UPDATE) {
        handleUpdateState(
          lbaDecoder.getPin(),
          lbaDecoder.getType(),
          lbaDecoder.getComponentVal()
        );
        return;
      }
    }
}
