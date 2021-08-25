#ifndef LBA_SERVO
#define LBA_SERVO

#include <Arduino.h>
#include "LBAUtils.h"
#include <Servo.h>

class LBAServo
{
//    Servo servoList[54] = {};
    int state[70] = {};

  public:
    LBAServo();
    void initialize(int pin);
    void update(int pin, String val);

  private:
};

#endif
