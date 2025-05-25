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

// Detect black or bright white frame areas
function detectBlackOrBright() {
    if (detectionPaused) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;
    let blackPixels = 0;
    let whitePixels = 0;
    const totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r < 30 && g < 30 && b < 30) {
            blackPixels++;
        }

        // Check for bright white pixels (all channels near 255)
        if (r > 240 && g > 240 && b > 240) {
            whitePixels++;
        }
    }

    const blackPercentage = (blackPixels / totalPixels) * 100;
    const whitePercentage = (whitePixels / totalPixels) * 100;

    // Detect camera covered
    const isCovered = blackPercentage > 90;

    // Detect bright white flash/light
    const isBright = whitePercentage > 80;

    let newStatus = lastStatus;

    if (isBright) {
        console.log('Bright light detected');
        newStatus = false;
    } else {
        newStatus = isCovered;
    }

    if (newStatus !== lastStatus) {
        lastStatus = newStatus;

        if (newStatus) {
            console.log('Camera Covered Detected');
        } else {
            console.log('Camera Not Covered or Bright Light Detected');
        }

        toggleBrokenState(newStatus);
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
            setInterval(detectBlackOrBright, 100);
        }
    }, 100);
})();
