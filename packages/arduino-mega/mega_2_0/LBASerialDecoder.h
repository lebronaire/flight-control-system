#ifndef LBA_SERIAL_DECODER
#define LBA_SERIAL_DECODER

#include <Arduino.h>
#include "LBAUtils.h"

class LBASerialDecoder
{
  String message;

  public:
    void readFromSerial();
    InputCommand getCommand();
    int getPin();
    ComponentType getType();
    String getVal();
    String getComponentVal();

   private:
};

#endif
