void ledInitialize(int pin) {
  pinMode(pin, OUTPUT);
  digitalWrite(pin, HIGH);
}

void ledUpdateState(int pin, String val) {
  int nextState = val.toInt();

  if (nextState == 1) {
    digitalWrite(pin, HIGH);
  }
  else {
    digitalWrite(pin, LOW);
  }
}
