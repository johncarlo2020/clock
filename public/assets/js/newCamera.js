let calibrationData = JSON.parse(localStorage.getItem('bottleCalibration')) || {
    withBottle: null,
    withoutBottle: null
  };

  const video = document.getElementById('webcam');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });

  const calibrateWithBtn = document.getElementById('calibrateWith');
  const calibrateWithoutBtn = document.getElementById('calibrateWithout');
  const startBtn = document.getElementById('startBtn');
  const clocksContainer = document.getElementById('clocksContainer');

  let detectionEnabled = false;
  let detectionPaused = false;
  let lastStatus = null;

  function calculateBrightness(data) {
    let totalBrightness = 0;
    const totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      totalBrightness += (r + g + b) / 3;
    }

    return totalBrightness / totalPixels;
  }

  async function startStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (error) {
      console.error('Camera error:', error);
    }
  }

  const calibrationStatus = document.getElementById('calibrationStatus');

async function calibrate(type) {
  const duration = 10000;
  const interval = 200;
  const samples = [];

  // Disable buttons during calibration
  calibrateWithBtn.disabled = true;
  calibrateWithoutBtn.disabled = true;
  startBtn.disabled = true;
  calibrationStatus.textContent = `Calibrating ${type === 'withBottle' ? 'with bottle' : 'without bottle'}... Please wait.`;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  console.log(`Calibrating for ${type}...`);

  const sampleInterval = setInterval(() => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    samples.push(Math.round(calculateBrightness(frame.data)));
  }, interval);

  await new Promise(resolve => setTimeout(resolve, duration));
  clearInterval(sampleInterval);

  if (samples.length === 0) {
    calibrationStatus.textContent = 'Calibration failed: no data collected.';
    calibrateWithBtn.disabled = false;
    calibrateWithoutBtn.disabled = false;
    return;
  }

  const frequencyMap = {};
  samples.forEach(v => frequencyMap[v] = (frequencyMap[v] || 0) + 1);
  const mostFrequent = parseInt(Object.entries(frequencyMap).reduce((a, b) => a[1] > b[1] ? a : b)[0]);

  calibrationData[type] = {
    min: Math.min(...samples),
    max: Math.max(...samples),
    mostFrequent
  };

  localStorage.setItem('bottleCalibration', JSON.stringify(calibrationData));
  console.log(`Calibrated ${type}:`, calibrationData[type]);

  calibrationStatus.textContent = `Calibration complete for ${type === 'withBottle' ? 'with bottle' : 'without bottle'}.`;

  // Re-enable buttons if calibration still needed
  if (!calibrationData.withBottle) calibrateWithBtn.disabled = false;
  if (!calibrationData.withoutBottle) calibrateWithoutBtn.disabled = false;

  if (calibrationData.withBottle && calibrationData.withoutBottle) {
    startBtn.style.display = 'inline-block';
    startBtn.disabled = false;
    calibrationStatus.textContent += ' You can now start detection.';
  }
}


  function startDetection() {
    detectionEnabled = true;
    calibrateWithBtn.style.display = 'none';
    calibrateWithoutBtn.style.display = 'none';
    startBtn.style.display = 'none';
    clocksContainer.style.display = 'block';
    calibrationStatus.style.display = 'none';
    setInterval(() => {
      if (detectionEnabled && !detectionPaused) detectBottle();
    }, 200);
  }

  function detectBottle() {
    if (!calibrationData.withBottle || !calibrationData.withoutBottle) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    const currentBrightness = calculateBrightness(frame.data);

    const threshold = (calibrationData.withBottle.mostFrequent + calibrationData.withoutBottle.mostFrequent) / 2;
    const bottlePresent = currentBrightness < threshold;

    if (bottlePresent !== lastStatus) {
      lastStatus = bottlePresent;
      console.log(bottlePresent ? 'Bottle is in place.' : 'Bottle is removed.');
      toggleBrokenState(bottlePresent);
      pauseDetectionTemporarily();
    }
  }

  function pauseDetectionTemporarily() {
    detectionPaused = true;
    setTimeout(() => detectionPaused = false, 1000);
  }


  // On page load
  window.addEventListener('DOMContentLoaded', async () => {
    await startStream();

    // Wait until video ready
    const checkReady = setInterval(() => {
      if (video.readyState >= 2) {
        clearInterval(checkReady);

        if (calibrationData.withBottle && calibrationData.withoutBottle) {
          // Calibration exists, skip calibration UI, start detection immediately
          calibrateWithBtn.style.display = 'none';
          calibrateWithoutBtn.style.display = 'none';
          startBtn.style.display = 'none';
          clocksContainer.style.display = 'block';

          startDetection();
          console.log('Calibration found. Skipping calibration, starting detection...');
        } else {
          // Calibration missing, show calibration buttons
          calibrateWithBtn.style.display = 'inline-block';
          calibrateWithoutBtn.style.display = 'inline-block';
          startBtn.style.display = 'none';
          clocksContainer.style.display = 'none';
        }
      }
    }, 100);
  });

  // Button event listeners
  calibrateWithBtn.addEventListener('click', () => calibrate('withBottle'));
  calibrateWithoutBtn.addEventListener('click', () => calibrate('withoutBottle'));
  startBtn.addEventListener('click', () => startDetection());
