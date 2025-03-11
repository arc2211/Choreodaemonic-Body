console.log("index.js is loaded");

// Store all received keypoint data
const keypointsData = {}; 

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    const keypoints = [
        "nose", "left_eye", "right_eye", "left_ear", "right_ear",
        "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
        "left_wrist", "right_wrist", "left_hip", "right_hip",
        "left_knee", "right_knee", "left_ankle", "right_ankle",
        "left_eye_inner", "left_eye_outer", "right_eye_inner", "right_eye_outer",
        "mouth_left", "mouth_right", "left_pinky", "right_pinky",
        "left_index", "right_index", "left_thumb", "right_thumb",
        "left_heel", "right_heel", "left_foot_index", "right_foot_index",
        "neck", "pelvis"
    ];

    const keypointListDiv = document.getElementById("keypointList");
    const startOSCCheckbox = document.getElementById("startOSC");

    // Check if the checkbox is found
    if (!startOSCCheckbox) {
        console.error("Error: Start OSC checkbox not found in the DOM!");
        return;
    }

    keypoints.forEach((keypoint, index) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.value = keypoint;
        checkbox.id = `keypoint-${index}`;
        checkbox.classList.add("keypoint-checkbox");

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${index}: ${keypoint}`));
        keypointListDiv.appendChild(label);
        keypointListDiv.appendChild(document.createElement("br"));
    });

    startOSCCheckbox.addEventListener("change", () => {
        const selectedKeypoints = keypoints.filter((_, index) =>
            document.getElementById(`keypoint-${index}`).checked
        );

        console.log("Sending to main.js:", startOSCCheckbox.checked, selectedKeypoints);
        
        if (window.osc) {
            console.log("yes osc");
            window.osc.startOSC(startOSCCheckbox.checked, selectedKeypoints);
        } else {
            console.error("window.osc is undefined. Check preload.js.");
        }
    });
});

// Listen for OSC messages
osc.onMessage((event, message) => {

    console.log("🎯 Received OSC Data in index:", message);
    const tableBody = document.getElementById("osc-table-body");

    const { address, args } = message;
    if (args.length < 4) return; // Ensure all 4 values are present

    const id = args[0].value;   // ID (integer)
    const name = args[1].value; // Name (string)
    const x = args[2].value;    // X coordinate (float)
    const y = args[3].value;    // Y coordinate (float)

    // Store keypoint data
    keypointsData[id] = { id, name, x, y };

    // Find existing row or create a new one
    let row = document.querySelector(`#row-${id}`);
    if (!row) {
        row = document.createElement("tr");
        row.id = `row-${id}`;
        row.innerHTML = `<td>${id}</td><td>${name}</td><td class="x"></td><td class="y"></td>`;
        tableBody.appendChild(row);
    }

    // Update row with new values
    row.querySelector(".x").textContent = x.toFixed(5);
    row.querySelector(".y").textContent = y.toFixed(5);

    // Redraw keypoints
    drawKeypoints();
});

// Function to draw keypoints on the canvas
function drawKeypoints() {
    // Get canvas and context
    const canvas = document.getElementById("poseCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    Object.values(keypointsData).forEach(({ id, x, y }) => {
        const canvasX = x * canvas.width; // Scale x
        const canvasY = y * canvas.height; // Scale y

        // Draw keypoint circle
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "black"; // Point color
        ctx.fill();
        ctx.closePath();

        // Draw ID label next to the keypoint
        ctx.fillStyle = "black"; // Text color
        ctx.font = "14px Arial";
        ctx.fillText(id + " (" + x.toFixed(3) + ", " + y.toFixed(3) + ")", canvasX + 8, canvasY - 8); // Offset text slightly
    });
}
