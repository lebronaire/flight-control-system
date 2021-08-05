#include "LBATypes.h"

String getLatestSerialMessage();

command getCommandFromSerialMessage(String msg);

int getPinFromSerialMessage(String msg);

String getValueFromSerialMessage(String msg);

String getTypeFromSerialMessage(String val);

String getComponentValue(String val);
