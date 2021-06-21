#include <Servo.h>

/*
  Manually select each pin that we want to enable
*/
int inputPinList[] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28};
int numberOfActiveInputPins;


/*
  {pin, inputMin, inputMax, servoMin, servoMax}

  input: The min/max values that Prosim will supply. Configurable in Prosim.
  servo: The min/max range that the servo is able to move eg. 0 to 180deg
*/
int servoList[][5] = {
  {44, 0, 180, 180, 4}
};

int numberOfActiveServos;
int servoConfig[54][4];

Servo myservo;


/*
  @intent(atridge): 54 is the maximum number of inputs on the Mega.
  There is likely a better solution that is more optimised like vectors
  but this should do fine for now.
*/
int pinStore[54];



void setup() {
  Serial.begin(115200);

  // Digital pins
  numberOfActiveInputPins = sizeof(inputPinList) / sizeof(int);

  for (int ii = 2; ii < numberOfActiveInputPins; ii++) {
    int pinNumber = inputPinList[ii];
    pinMode(pinNumber, INPUT_PULLUP);
    pinStore[pinNumber] = -1;
  }

  // Servos
  numberOfActiveServos = sizeof(servoList) / sizeof(int) / 5;

  int servoPin;
  int inputMin;
  int inputMax;
  int servoMin;
  int servoMax;

  for (int ss = 0; ss < numberOfActiveServos; ss++) {
    servoPin = servoList[0][0];
    inputMin = servoList[0][1];
    inputMax = servoList[0][2];
    servoMin = servoList[0][3];
    servoMax = servoList[0][4];

    servoConfig[servoPin][0] = inputMin;
    servoConfig[servoPin][1] = inputMax;
    servoConfig[servoPin][2] = servoMin;
    servoConfig[servoPin][3] = servoMax;
  }

  pinStore[44] = 0;

  pinStore[44] = 30;

  myservo.attach(44);
  updateServo(44);
}

void loop() {
  for (int ii = 2; ii < numberOfActiveInputPins; ii++) {
    syncState(inputPinList[ii]);
  }

  readSimOutput();

  delay(50);
}

/*
  Send message via serial bus

  output format: {pin type analog (a) or digital (d)}{pin number}={value}
  eg. d9=1
*/
void sendMessage(int pin, int value) {
  String msg = "d";
  Serial.println(msg + pin + "=" + value);
}

void syncState(int pinNumber) {
  int reading = digitalRead(pinNumber);
  int currentValue;

  if (reading == LOW) {
    currentValue = 0;
  }
  else {
    currentValue = 1;
  }

  if (currentValue != pinStore[pinNumber]) {
    // Send new value to the serial port
    sendMessage(pinNumber, currentValue);

    pinStore[pinNumber] = currentValue;
  }
}

void readSimOutput() {
  while (Serial.available()) {
    String message = Serial.readStringUntil('\n');

    logger(message);

    String pinString = "";
    String valueString = "";
    String SEPARATOR = "=";
    bool foundSeparator = false;
    String character = "";

    for (int ii = 0; ii < message.length(); ii++) {
      character = message[ii];

      if (character == SEPARATOR) {
        foundSeparator = true;
      }
      else if (foundSeparator == false) {
        pinString = pinString + character;
      }
      else {
        valueString = valueString + character;
      }
    }

    if (valueString == "") {
      return;
    }

    int pin = pinString.toInt();
    int value = valueString.toInt();

    pinStore[pin] = value;

    // TODO: If we move this outside the while loop, we can optimise the number
    // of time we need to request the servo to move
    updateOutputComponent(pin);
  }
}

void updateOutputComponent(int pin) {
  // TODO: Update displays

  // TODO: Update LED's

  // Update servos
  updateServo(pin);


}

void updateServo(int pin) {
  int servoValue = pinStore[pin];
  int inputMin = servoConfig[pin][0];
  int inputMax = servoConfig[pin][1];
  int servoMin = servoConfig[pin][2];
  int servoMax = servoConfig[pin][3];

  if (servoValue > inputMax) {
    servoValue = inputMax;
  }
  else if (servoValue < inputMin) {
    servoValue = inputMin;
  }

  int val = map(servoValue, inputMin, inputMax, servoMin, servoMax);

  //  Serial.print("servo: ");
  //  Serial.print(pin);
  //  Serial.print(" -> ");
  //  Serial.println(val);


  myservo.write(val);
}

void logger(String l) {
  Serial.print("arduino log: ");
  Serial.println(l);
}
