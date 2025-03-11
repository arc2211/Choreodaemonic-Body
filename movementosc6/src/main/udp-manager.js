const osc = require("osc");

class UDPManager {
    constructor() {
        this.listener = this.initListener();
        this.sender = this.initSender();
    }

    initListener() {
        let listener = new osc.UDPPort({
            localPort: 7500,
            metadata: true
        });

        listener.on("error", (e) => {
            console.log("OSC UDP listener error: " + e);
        });

        listener.open();

        return listener;
    }

    initSender() {
        let sender = new osc.UDPPort({
            remotePort: 57123,
            metadata: true
        });

        sender.on("error", (e) => {
            console.log("Error sending OSC message. " + e);
        });

        sender.open();

        return sender;
    }
};

module.exports = UDPManager;
