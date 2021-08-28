#ifndef LBA_POTENCH
#define LBA_POTENCH

#include <Arduino.h>
#include "LBAUtils.h"

class Potench
{
    int state[70] = {};

  public:
    Potench();
    void initialize(int pin);
    void onLoop();

  private:
    void checkStateChanges(int pin);
};

#endif
