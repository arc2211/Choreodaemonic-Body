# Choreodaemonic-Body

**MovementOSC6** - Update to MovementOSC for Choreodaemonic project

See movementosc6/README.md for details about what is done and need to dos 

To Run: 
1) download movementosc6
2) npm install
3) npm start
4) scroll down and check boxes of keypoints desired (note: neck and pelvis not yet working)
5) check Start OSC
6) View: graph and datatable for results and terminal console for read out of osc messages 

-----------------

**OSCTest4** - Listens at port 7500 and prints incoming OSC messages. Example of how to link between movementosc6 UI in JS to Tighe's robot controller code in C++

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
