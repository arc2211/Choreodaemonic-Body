const { ipcRenderer } = require("electron");

console.log("renderer.js is loaded");

let startOSC = false;  // Track whether OSC is enabled
let selectedKeypoints = []; // Stores checked keypoints
const visualizationDiv = document.getElementById("visualization");
const ctx = canvas.getContext("2d");

// Handle StartOSC checkbox toggle
document.getElementById("startOSC").addEventListener("change", (event) => {
    startOSC = event.target.checked;

    if (startOSC) {
        selectedKeypoints = getSelectedKeypoints(); // Fetch selected keypoints
        ipcRenderer.send("startOSC", { startOSC, selectedKeypoints });
        console.log("OSC Started, sending keypoints:", selectedKeypoints);
    } else {
        ipcRenderer.send("stopOSC");
        console.log("OSC Stopped.");
    }
});

// Function to fetch selected keypoints from UI checkboxes
function getSelectedKeypoints() {
    return Array.from(document.querySelectorAll(".keypoint-checkbox:checked")).map(el => el.value);
}


