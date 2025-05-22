const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const statusText = document.getElementById('status');
const startContainer = document.getElementById('startContainer');

let stream;
let lastStatus = null; // Track the last detection status
let detectionPaused = false; // Flag to control detection pause

// Start video stream using the default camera
async function startStream() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Stop previous stream
    }

    stream = await navigator.mediaDevices.getUserMedia({
        video: true // Use default camera
    });

    video.srcObject = stream;
}

// Detect black frame areas
function detectBlack() {
    if (detectionPaused) return; // Skip detection if paused

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;
    let blackPixels = 0;
    let totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Stricter threshold for black pixel detection
        if (r < 30 && g < 30 && b < 30) {
            blackPixels++;
        }
    }

    const blackPercentage = (blackPixels / totalPixels) * 100;
    // Detect if camera is covered: 90% or more pixels black
    const isCovered = blackPercentage > 90;

    if (isCovered !== lastStatus) {
        lastStatus = isCovered;

        if (isCovered) {
            console.log('Camera Covered Detected');
            toggleBrokenState(true);  // true means broken/covered
        } else {
            console.log('Camera Not Covered');
            toggleBrokenState(false);
        }

        pauseDetectionTemporarily();
    }
}


// Temporarily pause detection after change
function pauseDetectionTemporarily() {
    detectionPaused = true;
    setTimeout(() => {
        detectionPaused = false;
    }, 1000); // 1 second delay
}

// Automatically run on page load
(async () => {
    await startStream();

    const checkReady = setInterval(() => {
        if (video.readyState >= 2) {
            clearInterval(checkReady);
            setInterval(detectBlack, 100);
        }
    }, 100);
})();
