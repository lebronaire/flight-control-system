#ifndef LBA_SWITCH
#define LBA_SWITCH

#include <Arduino.h>
#include "LBAUtils.h"

class LBASwitch
{
    int state[54] = {};

  public:
    LBASwitch();
    void initialize(int pin);
    void onLoop();

  private:
    void checkStateChanges(int pin);
};

#endif
