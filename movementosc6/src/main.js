const {app, BrowserWindow, ipcMain} = require("electron");
const osc = require("osc");
const path = require("node:path");
const UDPManager = require("./main/udp-manager.js");

// let udpPort = new osc.UDPPort({
//     remotePort: 57122,
//     metadata: true
// });

// udpPort.on("error", (error) => {
//     console.error("OSC Error:", error);
// });

// udpPort.open();

let udpPort = new UDPManager();


let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "main/preload.js"),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    // mainWindow.setBackgroundColor("#000000");
    mainWindow.loadFile("src/renderer/index.html");
    mainWindow.maximize();

    // return mainWindow;
}

app.whenReady().then(() => {
    createWindow();

    console.log("Started");

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    let oscEnabled = false;
    let specificKeypoints = [];

    ipcMain.on("startOSC", (event, { isChecked, selectedKeypoints }) => {
            oscEnabled = isChecked;
            specificKeypoints = selectedKeypoints;
            console.log("OSC Enabled:", oscEnabled);
            console.log("Selected keypoints:", specificKeypoints);
    }); 

    ipcMain.handle("send", async (event, poses, ip, port) => {
    // console.log("handling"); // Debugging log

    if(oscEnabled){

        // Loop through each pose
        for (let i = 0; i < poses.length; i++) {
            let pose = poses[i];
            let posePrefix = `/pose/${i}/`;

            let keypointsMap = {};

            // Extract relevant keypoints
            pose.keypoints.forEach((keypoint, index) => {
                if (!specificKeypoints.includes(keypoint.name)) return;

                // if(keypoint.name == "neck"){
                //     let neck = calculateMidpoint(keypointsMap["left_shoulder"], keypointsMap["right_shoulder"]);

                //     keypointsMap[keypoint.name] = {
                //     id: index,  // The index is used as the keypoint ID
                //     name: keypoint.name,
                //     x: keypoint.x ?? null,
                //     y: keypoint.y ?? null,
                // };

                // }

                keypointsMap[keypoint.name] = {
                    id: index,  // The index is used as the keypoint ID
                    name: keypoint.name,
                    x: keypoint.x ?? null,
                    y: keypoint.y ?? null,
                };
            });

            // Send OSC messages for each keypoint
            Object.entries(keypointsMap).forEach(([key, point]) => {
                if (!point) return;

                // Log the keypoints before sending (for debugging)
                // console.log(`Sending OSC: ${posePrefix}${key}/id = ${point.id}, ${posePrefix}${key}/name = ${point.name}, ${posePrefix}${key}/x = ${point.x}, ${posePrefix}${key}/y = ${point.y}`);

                // Send OSC messages for each keypoint as a single bundled message
                // Construct a single OSC message per keypoint
                udpPort.sender.send(
                    {
                        address: `${posePrefix}${key}`,  // Use a single address for each keypoint
                        args: [
                            { type: "i", value: point.id },   // ID
                            { type: "s", value: point.name }, // Name
                            { type: "f", value: point.x ?? 0 }, // X
                            { type: "f", value: point.y ?? 0 }, // Y
                        ],
                    },
                    ip,
                    port
                );
            });
            console.log("--------------");
            console.log("Keypoints Sent:", keypointsMap);
        }
    }
    });

    udpPort.listener.on("message", (message) => {
        mainWindow.webContents.send("osc-message", message);
        console.log("listening osc-message", message);
    });
});



app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
