# Choreodaemonic-Body

MovementOSC6 - Update to MovementOSC (https://github.com/lichen-community-systems/movementosc/) that makes more of a user interface and changes the OSC messages to only be with selected keypoints. 


OSCTest4 - Listens at port 7500 and prints incoming OSC messages

Prep MovementOSC:
1) download MovementOSC: https://github.com/lichen-community-systems/movementosc/tree/main 
2) npm install

Prep OSCTest4:
1) download OSCTest4
2) install liblo: https://github.com/radarsat1/liblo.git

Run OSCTest4 to receive messages from port 7500:
1) g++ -o osc_receiver osc_receiver.cpp -L/opt/homebrew/lib -I/opt/homebrew/include -llo -lpthread
2) ./osc_receiver

Run MovementOSC to begin sending OSC message on Port 7500 in a seperate terminal window:
1) npm start
2) osc_receiver should begin recieving messages
