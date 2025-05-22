document.addEventListener('DOMContentLoaded', function () {
    const videoContainers = document.getElementById('videoContainers');
    const clockContainers = document.getElementById('clocksContainer');
    const startContainers = document.getElementById('startContainer');
    const cameraSelect = document.getElementById('cameraSelect');
    const startButton = document.getElementById('startButton');
    let previousFrame = null;
    let stream = null;
    let motionDetectionActive = true;  // Flag to control motion detection
    const sampleSize = 50;
    const threshold = 30;
    const activeThreshold = 0.3; // Higher for higher ratio
    let motionDetectedPreviously = false; // Flag to track motion detection state

    // Enumerate all video input devices (cameras)
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length === 0) {
            console.error('No cameras detected.');
            return;
        }

        // Populate the camera select dropdown with video devices
        videoDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Camera ${cameraSelect.length + 1}`;
            cameraSelect.appendChild(option);
        });
    }).catch(function (err) {
        console.error('Error enumerating devices: ', err);
    });

    startButton.addEventListener('click', function () {
        const selectedCameraId = cameraSelect.value;
        startContainers.style.display = 'none';

        toggleBrokenState(false);

      
        if (!selectedCameraId) {
            alert('Please select a camera first.');
            return;
        }

        if (stream) {
            // Stop any existing stream before starting a new one
            stream.getTracks().forEach(track => track.stop());
        }

        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        video.autoplay = true;
        video.width = 640;
        video.height = 480;
        canvas.width = 640;
        canvas.height = 480;

        videoContainers.innerHTML = ''; // Clear previous video/canvas elements
        videoContainers.appendChild(video);
        videoContainers.appendChild(canvas);

        // Access the media stream for the selected video input device
        startCameraStream(selectedCameraId, video, ctx, canvas);
    });

    function startCameraStream(cameraId, video, ctx, canvas) {
        navigator.mediaDevices.getUserMedia({ video: { deviceId: cameraId } })
            .then(function (mediaStream) {
                stream = mediaStream;
                video.srcObject = stream;

                video.addEventListener('play', function () {
                    function drawFrame() {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        if (motionDetectionActive) {
                            motionDetection(ctx, canvas);
                        }
                        requestAnimationFrame(drawFrame);
                    }
                    drawFrame();
                });
            })
            .catch(function (error) {
                console.error(`Error accessing camera:`, error);
            });
    }

    function motionDetection(ctx, canvas) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let blackPixelsCount = 0;

        for (let y = 0; y < canvas.height; y += sampleSize) {
            for (let x = 0; x < canvas.width; x += sampleSize) {
                const pos = (x + y * canvas.width) * 4;
                const r = imageData[pos];
                const g = imageData[pos + 1];
                const b = imageData[pos + 2];
                const isBlack = r < threshold && g < threshold && b < threshold;

                if (isBlack) {
                    blackPixelsCount++;
                }

                if (previousFrame) {
                    const colorDifference = Math.abs(previousFrame[pos] - r) + Math.abs(previousFrame[pos + 1] - g) + Math.abs(previousFrame[pos + 2] - b);
                    if (isBlack && colorDifference > threshold) {
                        ctx.fillStyle = `rgb(${r},${g},${b})`;
                        ctx.fillRect(x, y, sampleSize, sampleSize);
                    }
                }
            }
        }

        const totalPixels = (canvas.width / sampleSize) * (canvas.height / sampleSize);
        const blackRatio = blackPixelsCount / totalPixels;

        // Trigger behavior based on the motion detection ratio
        handleMotionDetection(blackRatio);

        previousFrame = new Uint8Array(imageData); // Update the previous frame
    }

    function handleMotionDetection(blackRatio) {
        const isMotionDetected = blackRatio < activeThreshold;

        // Call the appropriate function based on whether motion was detected
        if (isMotionDetected && !motionDetectedPreviously) {
            onMotionDetected();
        } else if (!isMotionDetected && motionDetectedPreviously) {
            onNoMotionDetected();
        }

        // Update the motion detected state
        motionDetectedPreviously = isMotionDetected;
    }

    function onMotionDetected() {
        console.log('Motion detected');
        toggleBrokenState(true);
    }

    function onNoMotionDetected() {
        console.log('No motion detected');
        toggleBrokenState(false);
        
    }

    function toggleMotionDetection(state) {
        motionDetectionActive = state;
    }
});
