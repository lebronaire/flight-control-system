#ifndef LBA_LED
#define LBA_LED

#include <Arduino.h>
#include "LBAUtils.h"

class LBALed
{
  public:
    void initialize(int pin);
    void update(int pin, String val);
    void onLoop();

   private:
};

#endif
