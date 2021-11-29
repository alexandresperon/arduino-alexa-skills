# Alexa and Arduino skills

This projects aims a criation of new skills for Alexa to be used with automations made with Ardunio.

## Requisites

### **arduino-action-websocket-connect**
Responsible to creates a new connection, stores the client's IP in a DynamoDB table to be able to send back notification to user. 

### **arduino-action-websocket-disconnect**
Removes a client IP from DynamoDB database

### **arduino-action-websocket-sendaction**
Invokes the function based on the action requested

## Skills

### **light-switch-arduino-skill**
Just turns on/off the lights com base in this two commands

To more information about how create new skills in Alexa, see: https://github.com/alxiong/alexa-skill-with-arduino-webclient