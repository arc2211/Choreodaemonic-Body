const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("osc", {
    send: (poses, ip, port) => ipcRenderer.invoke("send", poses, ip, port),
    onMessage: (callback) => ipcRenderer.on("osc-message",callback),
    startOSC: (isChecked, selectedKeypoints) => ipcRenderer.send("startOSC", { isChecked, selectedKeypoints }),
    stopOSC: () => ipcRenderer.send("stopOSC"),
    onUpdateKeypoints: (callback) => ipcRenderer.on("updateKeypoints", (_, data) => callback(data)),
});



// const {contextBridge, ipcRenderer} = require("electron");

// contextBridge.exposeInMainWorld("osc", {
//     send: (message, ip, port) => ipcRenderer.invoke(
//         "send", poses, ip, port),
//     onMessage: (callback) => ipcRenderer.on("osc-message",callback)
// });


// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("electron", {
// 	startOSC: (selectedKeypoints) => ipcRenderer.send("startOSC", selectedKeypoints),
// 	stopOSC: () => ipcRenderer.send("stopOSC"),
//     onUpdateKeypoints: (callback) => ipcRenderer.on("updateKeypoints", (_, data) => callback(data)),
//     send: (message, ip, port) => ipcRenderer.invoke("send", message, ip, port),

// });

// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("electronAPI", {
//     startOSC: (isChecked, selectedKeypoints) => ipcRenderer.send("startOSC", isChecked, selectedKeypoints),
//     stopOSC: () => ipcRenderer.send("stopOSC"),
//     onUpdateKeypoints: (callback) => ipcRenderer.on("updateKeypoints", (_, data) => callback(data)),
//     send: (message, ip, port) => ipcRenderer.invoke("send", message, ip, port),

// });
