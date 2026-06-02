/* ==========================================================================
   COLOR COLOR - WEB GAME IMPLEMENTATION
   ========================================================================== */

// --- 1. Sound FX System using Web Audio API ---
class SynthSFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  
  toggle(state) {
    this.enabled = state;
    if (state) this.init();
  }
  
  playClick() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }
  
  playTick(isCritical = false) {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const pitch = isCritical ? 900 : 450;
    const dur = isCritical ? 0.08 : 0.04;
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + dur);
    gain.gain.setValueAtTime(isCritical ? 0.06 : 0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }
  
  playShutter() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    
    // Mechanical focus lens: high click
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.frequency.setValueAtTime(2200, now);
    osc1.frequency.linearRampToValueAtTime(900, now + 0.04);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    
    // Shutter curtain sweep noise
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400;
    
    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.06, now);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    noise.connect(filter);
    filter.connect(gain2);
    gain2.connect(this.ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.04);
    noise.start(now);
    noise.stop(now + 0.12);
  }
  
  playScan() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(550, this.ctx.currentTime + 0.7);
    osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 1.4);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(1400, this.ctx.currentTime + 0.7);
    
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.7);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.4);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 1.4);
  }
  
  playSuccess(score) {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = score > 800 ? [523.25, 659.25, 783.99, 1046.50] : [261.63, 329.63, 392.00, 523.25];
    const duration = score > 800 ? 0.08 : 0.06;
    
    let time = now;
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.05, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.3);
      time += duration;
    });
  }
  
  playFail() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.45);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, now);
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.45);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.45);
  }
  
  playGameOver() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    // Chords / retro arpeggio: C major -> F major -> G major -> C major
    const melody = [
      { f: 523.25, d: 0.1 },  // C5
      { f: 659.25, d: 0.1 },  // E5
      { f: 783.99, d: 0.1 },  // G5
      { f: 880.00, d: 0.1 },  // A5
      { f: 987.77, d: 0.1 },  // B5
      { f: 1046.50, d: 0.4 }  // C6
    ];
    let time = now;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, time);
      gain.gain.setValueAtTime(0.04, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + note.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + note.d);
      time += 0.08;
    });
  }
}

const sfx = new SynthSFX();

// --- 2. Database (IndexedDB) Manager ---
const DB_NAME = 'ColorColorGalleryDB';
const DB_VERSION = 1;
const STORE_NAME = 'captures';
let dbConnection = null;

function initGalleryDB() {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = (e) => {
      dbConnection = e.target.result;
      resolve(true);
    };
    request.onerror = (e) => {
      console.warn("IndexedDB initialisation failed, falling back to session-only storage.", e);
      resolve(false);
    };
  });
}

function saveCaptureToGallery(colorId, colorName, score, rating, imgDataUrl) {
  return new Promise((resolve) => {
    if (!dbConnection) {
      resolve(null);
      return;
    }
    try {
      const transaction = dbConnection.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.add({
        colorId,
        colorName,
        score,
        rating,
        imgDataUrl,
        timestamp: Date.now()
      });
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (e) {
      console.warn("Write to DB failed:", e);
      resolve(null);
    }
  });
}

function fetchGalleryCaptures() {
  return new Promise((resolve) => {
    if (!dbConnection) {
      resolve([]);
      return;
    }
    try {
      const transaction = dbConnection.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = req.result || [];
        list.sort((a, b) => b.timestamp - a.timestamp);
        resolve(list);
      };
      req.onerror = () => resolve([]);
    } catch (e) {
      console.warn("Read from DB failed:", e);
      resolve([]);
    }
  });
}

function deleteGalleryCapture(id) {
  return new Promise((resolve) => {
    if (!dbConnection) {
      resolve(false);
      return;
    }
    try {
      const transaction = dbConnection.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.delete(Number(id));
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch (e) {
      console.warn("Delete from DB failed:", e);
      resolve(false);
    }
  });
}

function clearGalleryDatabase() {
  return new Promise((resolve) => {
    if (!dbConnection) {
      resolve(false);
      return;
    }
    try {
      const transaction = dbConnection.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch (e) {
      console.warn("Clear DB failed:", e);
      resolve(false);
    }
  });
}

// --- 3. Game Spectrum & Settings ---
const PRIDE_COLORS = [
  { id: 'red', name: 'Red', meaning: 'Life', hue: 0, hex: '#ff3344', satRange: [40, 100], ligRange: [20, 80], glow: 'rgba(255, 51, 68, 0.4)' },
  { id: 'orange', name: 'Orange', meaning: 'Healing', hue: 30, hex: '#ff9933', satRange: [40, 100], ligRange: [25, 80], glow: 'rgba(255, 153, 51, 0.4)' },
  { id: 'yellow', name: 'Yellow', meaning: 'Sunlight', hue: 58, hex: '#ffff33', satRange: [35, 100], ligRange: [25, 85], glow: 'rgba(255, 255, 51, 0.4)' },
  { id: 'green', name: 'Green', meaning: 'Nature', hue: 125, hex: '#33cc66', satRange: [25, 100], ligRange: [15, 75], glow: 'rgba(51, 204, 102, 0.4)' },
  { id: 'blue', name: 'Blue', meaning: 'Harmony', hue: 220, hex: '#3399ff', satRange: [25, 100], ligRange: [15, 75], glow: 'rgba(51, 153, 255, 0.4)' },
  { id: 'violet', name: 'Violet', meaning: 'Spirit', hue: 285, hex: '#b266ff', satRange: [25, 100], ligRange: [15, 75], glow: 'rgba(178, 102, 255, 0.4)' },
  { id: 'pink', name: 'Pink', meaning: 'Sexuality & Diversity', hue: 330, hex: '#ff66b2', satRange: [35, 100], ligRange: [30, 85], glow: 'rgba(255, 102, 178, 0.4)' }
];

// Active State
let currentScreen = 'welcome';
let activeColorIndex = 0;
let currentTimer = 30;
let timerInterval = null;
let activeStream = null;
let activeCameraFacingMode = 'environment';
let isMaskEnabled = true;

// Session cache
let sessionScores = {};
let sessionCaptures = {};
let currentMatchScoreDetails = null;

// --- 4. Core Navigation Control ---
const screens = {
  welcome: document.getElementById('screen-welcome'),
  play: document.getElementById('screen-play'),
  analysis: document.getElementById('screen-analysis'),
  result: document.getElementById('screen-result'),
  summary: document.getElementById('screen-summary'),
  gallery: document.getElementById('screen-gallery')
};

function navigateToScreen(screenName) {
  // Teardown processes when moving away from Gameplay
  if (screenName !== 'play') {
    deinitializeCamera();
    stopCountdownTimer();
  }
  
  Object.keys(screens).forEach((key) => {
    screens[key].classList.remove('active');
  });
  
  if (screens[screenName]) {
    screens[screenName].classList.add('active');
    currentScreen = screenName;
    screens[screenName].scrollTop = 0;
  }
  
  // Theme indicator in header
  const prideIndicator = document.querySelector('.pride-indicator-dot');
  if (screenName === 'play') {
    const activeColor = PRIDE_COLORS[activeColorIndex];
    document.body.style.setProperty('--active-color', activeColor.hex);
    document.body.style.setProperty('--active-color-glow', activeColor.glow);
    prideIndicator.style.backgroundColor = activeColor.hex;
    prideIndicator.style.boxShadow = `0 0 10px ${activeColor.hex}`;
  } else {
    document.body.style.setProperty('--active-color', '#ff007f');
    document.body.style.setProperty('--active-color-glow', 'rgba(255, 0, 127, 0.4)');
    prideIndicator.style.backgroundColor = '#ff007f';
    prideIndicator.style.boxShadow = '0 0 10px rgba(255, 0, 127, 0.6)';
  }
}

// Custom alert popup
function showDialogAlert(title, message) {
  document.getElementById('dialog-alert-title').innerText = title;
  document.getElementById('dialog-alert-message').innerText = message;
  document.getElementById('dialog-alert').showModal();
}

// --- 5. Timer Controls ---
function startCountdownTimer() {
  stopCountdownTimer();
  currentTimer = 30;
  updateTimerUI();
  
  timerInterval = setInterval(() => {
    currentTimer--;
    updateTimerUI();
    
    if (currentTimer <= 5 && currentTimer > 0) {
      sfx.playTick(true);
    } else if (currentTimer > 0) {
      sfx.playTick(false);
    }
    
    if (currentTimer <= 0) {
      stopCountdownTimer();
      sfx.playFail();
      handleTimeOut();
    }
  }, 1000);
}

function stopCountdownTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerUI() {
  document.getElementById('timer-label').innerText = currentTimer;
  const path = document.getElementById('timer-path-remaining');
  if (path) {
    const fraction = currentTimer / 30;
    const dashoffset = Math.round(283 * (1 - fraction));
    path.style.strokeDashoffset = dashoffset;
  }
}

function handleTimeOut() {
  showDialogAlert("Time's Up! ⏱️", "You ran out of time for this color stripe. Let's process what was in the viewfinder!");
  
  // Try to capture whatever is in viewfinder
  const fallbackUploader = document.getElementById('upload-fallback');
  if (activeStream) {
    captureImageFromStream();
  } else {
    // If no stream (file input mode), give them a zero score
    const targetColor = PRIDE_COLORS[activeColorIndex];
    const scores = {
      coverage: 0,
      avgEdge: 0,
      stdS: 0,
      stdL: 0,
      coverageScore: 0,
      textureScore: 0,
      varianceScore: 0,
      totalScore: 0,
      grade: 'D-Rank',
      rating: 'Time Limit Expired'
    };
    
    // Create simple blank 1x1 black canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 100;
    tempCanvas.height = 100;
    const ctx = tempCanvas.getContext('2d');
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 100, 100);
    const dataUrl = tempCanvas.toDataURL('image/jpeg');
    
    currentMatchScoreDetails = {
      colorId: targetColor.id,
      colorName: targetColor.name,
      imgDataUrl: dataUrl,
      scores: scores
    };
    
    showResultScreen(currentMatchScoreDetails);
  }
}

// --- 6. Camera Controller ---
async function initializeCamera() {
  deinitializeCamera();
  
  const video = document.getElementById('camera-stream');
  const uploader = document.getElementById('upload-fallback');
  const toggleBtn = document.getElementById('btn-toggle-camera');
  
  uploader.classList.remove('active');
  video.style.display = 'block';
  
  const constraints = {
    audio: false,
    video: {
      facingMode: activeCameraFacingMode,
      width: { ideal: 640 },
      height: { ideal: 640 }
    }
  };
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    activeStream = stream;
    video.srcObject = stream;
    
    // Detect multiple camera options to show Toggle button
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(d => d.kind === 'videoinput');
    if (videoDevices.length > 1) {
      toggleBtn.style.display = 'flex';
    } else {
      toggleBtn.style.display = 'none';
    }
  } catch (err) {
    console.warn("Unable to start stream facing:", activeCameraFacingMode, err);
    // Try fallback to any video stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      activeStream = stream;
      video.srcObject = stream;
    } catch (e) {
      console.warn("Hardware camera stream unavailable. Activating file uploader.", e);
      video.style.display = 'none';
      toggleBtn.style.display = 'none';
      uploader.classList.add('active');
    }
  }
}

function deinitializeCamera() {
  const video = document.getElementById('camera-stream');
  if (video && video.srcObject) {
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
  }
  activeStream = null;
}

function captureImageFromStream() {
  if (!activeStream) return;
  
  sfx.playShutter();
  
  // Visual Flash Indicator
  const flash = document.getElementById('shutter-flash');
  flash.classList.add('flash-active');
  setTimeout(() => flash.classList.remove('flash-active'), 350);
  
  const video = document.getElementById('camera-stream');
  
  const canvas = document.createElement('canvas');
  // Determine cropping to keep 1:1 aspect ratio
  const size = Math.min(video.videoWidth, video.videoHeight);
  canvas.width = 480;
  canvas.height = 480;
  
  const ctx = canvas.getContext('2d');
  const sx = (video.videoWidth - size) / 2;
  const sy = (video.videoHeight - size) / 2;
  
  ctx.drawImage(video, sx, sy, size, size, 0, 0, 480, 480);
  
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  
  deinitializeCamera();
  stopCountdownTimer();
  
  processCapturedImage(canvas, dataUrl);
}

// --- 7. Computer Vision Analyzer & Scoring ---
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { 
    h: Math.round(h * 360), 
    s: Math.round(s * 100), 
    l: Math.round(l * 100) 
  };
}

function getHueDistance(h1, h2) {
  const diff = Math.abs(h1 - h2);
  return Math.min(diff, 360 - diff);
}

function isColorMatch(hsl, targetColor) {
  let maxHueDiff = 20;
  if (targetColor.id === 'green') maxHueDiff = 35;
  if (targetColor.id === 'blue') maxHueDiff = 30;
  if (targetColor.id === 'violet') maxHueDiff = 24;
  if (targetColor.id === 'yellow') maxHueDiff = 16;
  if (targetColor.id === 'orange') maxHueDiff = 15;
  
  const matchesHue = getHueDistance(hsl.h, targetColor.hue) <= maxHueDiff;
  const matchesSat = hsl.s >= targetColor.satRange[0] && hsl.s <= targetColor.satRange[1];
  const matchesLig = hsl.l >= targetColor.ligRange[0] && hsl.l <= targetColor.ligRange[1];
  
  return matchesHue && matchesSat && matchesLig;
}

function computeScoringMatrix(canvas, targetColor) {
  const size = 150; // Performance dimensions
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = size;
  tempCanvas.height = size;
  const ctx = tempCanvas.getContext('2d');
  ctx.drawImage(canvas, 0, 0, size, size);
  
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  
  let matchCount = 0;
  let sumS = 0, sumS2 = 0;
  let sumL = 0, sumL2 = 0;
  const matchPixels = [];
  
  // Edge detection Accumulators
  let edgeSum = 0;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      
      const hsl = rgbToHsl(r, g, b);
      const matched = isColorMatch(hsl, targetColor);
      
      if (matched) {
        matchCount++;
        sumS += hsl.s;
        sumS2 += hsl.s * hsl.s;
        sumL += hsl.l;
        sumL2 += hsl.l * hsl.l;
        matchPixels.push(idx);
      }
      
      // Calculate spatial edge (Difference with right & down pixel)
      if (x < size - 1 && y < size - 1) {
        const intensity = (r + g + b) / 3;
        const rightIdx = idx + 4;
        const intensityRight = (data[rightIdx] + data[rightIdx+1] + data[rightIdx+2]) / 3;
        const downIdx = idx + (size * 4);
        const intensityDown = (data[downIdx] + data[downIdx+1] + data[downIdx+2]) / 3;
        
        const dx = intensityRight - intensity;
        const dy = intensityDown - intensity;
        edgeSum += Math.sqrt(dx*dx + dy*dy);
      }
    }
  }
  
  const totalPixels = size * size;
  const coverage = matchCount / totalPixels;
  const avgEdge = edgeSum / ((size - 1) * (size - 1));
  
  // Standard deviations
  let stdS = 0;
  let stdL = 0;
  if (matchCount > 10) {
    const meanS = sumS / matchCount;
    const meanL = sumL / matchCount;
    const varS = (sumS2 / matchCount) - (meanS * meanS);
    const varL = (sumL2 / matchCount) - (meanL * meanL);
    stdS = Math.sqrt(Math.max(0, varS));
    stdL = Math.sqrt(Math.max(0, varL));
  }
  
  // --- SCORING FORMULAS ---
  
  // 1. Color Coverage (Max 500 pts)
  // Goldilocks Target: [0.15, 0.65]. Full marks for this range.
  // Fades down as coverage heads to 95% to discourage phone jamming.
  let coverageScore = 0;
  if (coverage >= 0.15 && coverage <= 0.65) {
    coverageScore = 500;
  } else if (coverage < 0.15) {
    coverageScore = Math.round((coverage / 0.15) * 500);
  } else {
    // scale from 65% up to 95%
    if (coverage >= 0.95) {
      coverageScore = 50; // flat cover penalty
    } else {
      const scale = (0.95 - coverage) / (0.95 - 0.65);
      coverageScore = Math.round(50 + (scale * 450));
    }
  }
  
  // 2. Texture & Edge density (Max 300 pts)
  // A totally flat surface has avgEdge around < 3.0.
  // Rich shapes have avgEdge > 12.0.
  let textureScore = 0;
  if (avgEdge < 3.0) {
    textureScore = 0;
  } else if (avgEdge >= 12.0) {
    textureScore = 300;
  } else {
    const scale = (avgEdge - 3.0) / (12.0 - 3.0);
    textureScore = Math.round(scale * 300);
  }
  
  // 3. Lightness & Saturation Variance (Max 200 pts)
  // Standard deviations combined. Flat surfaces have stdS + stdL < 2.0.
  // Real things have shadows/details, giving stdSum > 18.0.
  let varianceScore = 0;
  if (matchCount > 10) {
    const stdSum = stdS + stdL;
    varianceScore = Math.round(Math.min(200, stdSum * 10));
  }
  
  let totalScore = coverageScore + textureScore + varianceScore;
  
  // Strict check: if matching pixel fraction is below 4%, they missed the mark completely
  if (coverage < 0.04) {
    totalScore = 0;
  }
  
  // Grade Ratings
  let grade = 'D-Rank';
  let rating = 'No object match found.';
  
  if (totalScore >= 900) {
    grade = 'S-Rank';
    rating = 'Spectacular Composition!';
  } else if (totalScore >= 750) {
    grade = 'A-Rank';
    rating = 'Excellent Real-World Capture!';
  } else if (totalScore >= 550) {
    grade = 'B-Rank';
    rating = 'Good Match!';
  } else if (totalScore >= 300) {
    grade = 'C-Rank';
    rating = 'Decent, but Needs More Texture';
  } else {
    grade = 'D-Rank';
    if (coverage >= 0.90 && avgEdge < 4.0) {
      rating = 'Flat Jam Warning! Capture shapes, edges, and depth.';
    } else {
      rating = 'Incorrect color matching or picture too blurry.';
    }
  }
  
  return {
    coverage: Math.round(coverage * 100),
    avgEdge: Math.round(avgEdge * 10) / 10,
    stdS: Math.round(stdS * 10) / 10,
    stdL: Math.round(stdL * 10) / 10,
    coverageScore,
    textureScore,
    varianceScore,
    totalScore,
    grade,
    rating
  };
}

function processCapturedImage(sourceElement, dataUrl) {
  navigateToScreen('analysis');
  sfx.playScan();
  
  const scanCanvas = document.getElementById('canvas-analysis-preview');
  scanCanvas.width = 400;
  scanCanvas.height = 400;
  const scanCtx = scanCanvas.getContext('2d');
  scanCtx.drawImage(sourceElement, 0, 0, 400, 400);
  
  const logsList = document.getElementById('analysis-logs');
  logsList.innerHTML = '';
  
  const addLog = (text, delay) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const li = document.createElement('li');
        li.innerText = text;
        logsList.appendChild(li);
        logsList.scrollTop = logsList.scrollHeight;
        resolve();
      }, delay);
    });
  };
  
  const progressBar = document.getElementById('analysis-progress-bar');
  progressBar.style.width = '0%';
  
  const activeColor = PRIDE_COLORS[activeColorIndex];
  const scores = computeScoringMatrix(scanCanvas, activeColor);
  
  (async () => {
    progressBar.style.width = '20%';
    await addLog("Calibrating digital spectrometer...", 300);
    
    progressBar.style.width = '45%';
    await addLog(`Scanning image pixels for hue code (${activeColor.hue}°)...`, 400);
    
    progressBar.style.width = '70%';
    await addLog(`Detected matching shade coverage: ${scores.coverage}%`, 300);
    
    progressBar.style.width = '90%';
    await addLog(`Running spatial Laplacian details kernels (Texture: ${scores.avgEdge})...`, 400);
    
    progressBar.style.width = '100%';
    await addLog("Calculations finalized. Loading results...", 300);
    
    setTimeout(() => {
      currentMatchScoreDetails = {
        colorId: activeColor.id,
        colorName: activeColor.name,
        imgDataUrl: dataUrl,
        scores: scores
      };
      showResultScreen(currentMatchScoreDetails);
    }, 400);
  })();
}

// --- 8. Screen Rendering Dashboard ---
function showResultScreen(details) {
  navigateToScreen('result');
  
  const title = document.getElementById('result-title');
  const subtitle = document.getElementById('result-subtitle');
  const imgResult = document.getElementById('img-result-capture');
  
  // Set images
  imgResult.src = details.imgDataUrl;
  
  // Draw the segmented canvas mask
  renderSegmentedMaskCanvas(details.imgDataUrl, PRIDE_COLORS[activeColorIndex]);
  
  const s = details.scores;
  if (s.totalScore > 0) {
    title.innerText = "Match Confirmed! 🎉";
    title.className = "neon-text-green";
    subtitle.innerText = `You matched ${details.colorName} (${PRIDE_COLORS[activeColorIndex].meaning})`;
    sfx.playSuccess(s.totalScore);
  } else {
    title.innerText = "Match Failed ❌";
    title.className = "neon-text";
    subtitle.innerText = `Could not match ${details.colorName}`;
    sfx.playFail();
  }
  
  // Animate numbers and Gauges
  animateScoreOdometer(s.totalScore, s.grade);
  
  // Set progress bars width
  // Coverage gauge percentage mapping
  const coveragePercent = Math.min(100, Math.round((s.coverageScore / 500) * 100));
  const texturePercent = Math.min(100, Math.round((s.textureScore / 300) * 100));
  const variancePercent = Math.min(100, Math.round((s.varianceScore / 200) * 100));
  
  setTimeout(() => {
    // Fill gauge bars
    document.getElementById('bar-gauge-color').style.width = `${coveragePercent}%`;
    document.getElementById('val-gauge-color').innerText = `${s.coverage}%`;
    
    document.getElementById('bar-gauge-texture').style.width = `${texturePercent}%`;
    document.getElementById('val-gauge-texture').innerText = `${s.avgEdge} / 12`;
    
    document.getElementById('bar-gauge-variance').style.width = `${variancePercent}%`;
    document.getElementById('val-gauge-variance').innerText = `${Math.round(s.stdS + s.stdL)}`;
  }, 100);
  
  // Feedback note
  const feedback = document.getElementById('text-result-feedback');
  feedback.innerText = s.rating;
  
  // Action button toggle
  const nextBtn = document.getElementById('btn-result-action');
  if (activeColorIndex < PRIDE_COLORS.length - 1) {
    nextBtn.querySelector('span').innerText = "Next Color Stripe";
  } else {
    nextBtn.querySelector('span').innerText = "View Final Summary";
  }
}

function renderSegmentedMaskCanvas(imgSrc, targetColor) {
  const canvas = document.getElementById('canvas-result-segmented');
  const ctx = canvas.getContext('2d');
  
  const img = new Image();
  img.onload = () => {
    canvas.width = 300;
    canvas.height = 300;
    ctx.drawImage(img, 0, 0, 300, 300);
    
    if (!isMaskEnabled) return; // Keep original if toggled off
    
    const imgData = ctx.getImageData(0, 0, 300, 300);
    const data = imgData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      
      const hsl = rgbToHsl(r, g, b);
      if (isColorMatch(hsl, targetColor)) {
        // Highlight color
        data[i] = r;
        data[i+1] = g;
        data[i+2] = b;
      } else {
        // Mute grayscale
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = Math.round(gray * 0.2);
        data[i+1] = Math.round(gray * 0.2);
        data[i+2] = Math.round(gray * 0.2);
      }
    }
    ctx.putImageData(imgData, 0, 0);
  };
  img.src = imgSrc;
}

function animateScoreOdometer(targetScore, grade) {
  const numberEl = document.getElementById('text-result-score');
  const gradeEl = document.getElementById('text-result-grade');
  
  gradeEl.innerText = grade;
  
  let currentVal = 0;
  const duration = 1200; // ms
  const intervalTime = 30; // ms
  const step = Math.max(1, Math.round(targetScore / (duration / intervalTime)));
  
  const timer = setInterval(() => {
    currentVal += step;
    if (currentVal >= targetScore) {
      currentVal = targetScore;
      clearInterval(timer);
    }
    numberEl.innerText = currentVal;
  }, intervalTime);
}

// --- 9. Game State Controller (Flow) ---
function startSessionGame() {
  activeColorIndex = 0;
  sessionScores = {};
  sessionCaptures = {};
  currentMatchScoreDetails = null;
  
  loadStripeChallenge();
}

function loadStripeChallenge() {
  const activeColor = PRIDE_COLORS[activeColorIndex];
  
  // Set play values
  document.getElementById('target-color-name').innerText = activeColor.name;
  document.getElementById('target-color-meaning').innerText = `"${activeColor.meaning}"`;
  
  const visualBadge = document.getElementById('color-visual-badge');
  visualBadge.style.backgroundColor = activeColor.hex;
  visualBadge.style.boxShadow = `0 0 16px ${activeColor.glow}`;
  
  navigateToScreen('play');
  
  initializeCamera();
  startCountdownTimer();
}

function advanceGameplay() {
  // Save current capture to active session caches
  if (currentMatchScoreDetails) {
    const colId = currentMatchScoreDetails.colorId;
    const colName = currentMatchScoreDetails.colorName;
    const scoreVal = currentMatchScoreDetails.scores.totalScore;
    const ratingVal = currentMatchScoreDetails.scores.rating;
    const imgData = currentMatchScoreDetails.imgDataUrl;
    
    sessionScores[colId] = scoreVal;
    sessionCaptures[colId] = imgData;
    
    // Asynchronously save to IndexedDB gallery in background
    saveCaptureToGallery(colId, colName, scoreVal, ratingVal, imgData);
  }
  
  if (activeColorIndex < PRIDE_COLORS.length - 1) {
    activeColorIndex++;
    loadStripeChallenge();
  } else {
    // Show summary certificate
    showSummaryScreen();
  }
}

function showSummaryScreen() {
  navigateToScreen('summary');
  sfx.playGameOver();
  
  // Compute totals
  let totalSessionScore = 0;
  PRIDE_COLORS.forEach((color) => {
    totalSessionScore += sessionScores[color.id] || 0;
  });
  
  document.getElementById('summary-total-score').innerText = totalSessionScore;
  
  // Check High Scores
  const personalBest = Number(localStorage.getItem('colorcolor_pb') || 0);
  if (totalSessionScore > personalBest) {
    localStorage.setItem('colorcolor_pb', totalSessionScore);
    document.getElementById('welcome-high-score').innerText = totalSessionScore;
    document.getElementById('welcome-stats').style.display = 'block';
  }
  
  // Determine Final Rank text
  let finalRank = "Pride Cadet 🏳️‍🌈";
  if (totalSessionScore >= 6000) {
    finalRank = "Pride Sovereign 👑";
  } else if (totalSessionScore >= 5200) {
    finalRank = "Color Luminary 🌟";
  } else if (totalSessionScore >= 4000) {
    finalRank = "Chroma Champion 🏆";
  } else if (totalSessionScore >= 2000) {
    finalRank = "Prism Seeker 🔍";
  }
  
  document.getElementById('summary-rank').innerText = finalRank;
  
  // Paint summary dynamic pride flag
  PRIDE_COLORS.forEach((color) => {
    const stripe = document.querySelector(`.flag-stripe[data-color="${color.id}"]`);
    if (stripe) {
      const bg = stripe.querySelector('.stripe-bg');
      const label = stripe.querySelector('.stripe-label');
      const score = sessionScores[color.id] || 0;
      
      label.innerText = `${color.name}: ${score} pts`;
      
      const captureData = sessionCaptures[color.id];
      if (captureData) {
        bg.style.backgroundImage = `url(${captureData})`;
        stripe.classList.add('unlocked');
      } else {
        bg.style.backgroundImage = 'none';
        stripe.classList.remove('unlocked');
      }
    }
  });
}

// --- 10. Gallery Display Manager ---
let activeGalleryFilter = 'all';

async function updateGalleryScreen() {
  const grid = document.getElementById('gallery-grid');
  
  // Keep empty state and clear items
  const emptyState = document.getElementById('gallery-empty-state');
  const clearBtn = document.getElementById('btn-gallery-clear');
  
  // Clear previous rendering
  const cards = grid.querySelectorAll('.gallery-card');
  cards.forEach(c => c.remove());
  
  const captures = await fetchGalleryCaptures();
  
  if (captures.length === 0) {
    emptyState.style.display = 'flex';
    clearBtn.style.display = 'none';
    return;
  }
  
  emptyState.style.display = 'none';
  clearBtn.style.display = 'block';
  
  // Filter items
  const filtered = activeGalleryFilter === 'all' 
    ? captures 
    : captures.filter(c => c.colorId === activeGalleryFilter);
    
  if (filtered.length === 0) {
    // Show a smaller empty note
    const note = document.createElement('div');
    note.className = 'gallery-empty-state gallery-card';
    note.innerHTML = `<p>No matches for ${activeGalleryFilter} yet.</p>`;
    grid.appendChild(note);
    return;
  }
  
  filtered.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.dataset.id = item.id;
    
    const colorInfo = PRIDE_COLORS.find(c => c.id === item.colorId);
    const badgeColor = colorInfo ? colorInfo.hex : '#fff';
    
    card.innerHTML = `
      <img src="${item.imgDataUrl}" alt="${item.colorName} photo">
      <div class="gallery-card-badge" style="background-color: ${badgeColor}; box-shadow: 0 0 6px ${badgeColor}"></div>
      <div class="gallery-card-score">${item.score} pts</div>
    `;
    
    card.addEventListener('click', () => showLightbox(item));
    grid.appendChild(card);
  });
}

function showLightbox(item) {
  const dialog = document.getElementById('dialog-lightbox');
  const img = document.getElementById('lightbox-img');
  const title = document.getElementById('lightbox-color-title');
  const score = document.getElementById('lightbox-score');
  const date = document.getElementById('lightbox-date');
  
  img.src = item.imgDataUrl;
  title.innerText = `${item.colorName} Match`;
  score.innerText = item.score;
  
  const d = new Date(item.timestamp);
  date.innerText = `Captured on: ${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`;
  
  // Save ID reference on delete buttons
  const deleteBtn = document.getElementById('btn-delete-lightbox-item');
  deleteBtn.onclick = async () => {
    if (confirm("Are you sure you want to delete this photo from your gallery?")) {
      await deleteGalleryCapture(item.id);
      dialog.close();
      updateGalleryScreen();
    }
  };
  
  // Individual share
  const shareBtn = document.getElementById('btn-share-lightbox-item');
  shareBtn.onclick = () => {
    shareGalleryItem(item);
  };
  
  dialog.showModal();
}

async function shareGalleryItem(item) {
  const shareTitle = "Color Color Scavenger Hunt 🏳️‍🌈";
  const shareText = `I photographed this amazing shade of ${item.colorName} and scored ${item.score} points on the 'Color Color' game!`;
  
  try {
    const response = await fetch(item.imgDataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'pride-color.jpg', { type: 'image/jpeg' });
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: shareTitle,
        text: shareText
      });
    } else {
      // Direct copy fallback
      navigator.clipboard.writeText(`${shareTitle}\n${shareText}`);
      showDialogAlert("Copied! 📋", "Score description copied to clipboard! Share it on your favourite socials.");
    }
  } catch (err) {
    console.error("Share failed:", err);
    navigator.clipboard.writeText(`${shareTitle}\n${shareText}`);
    showDialogAlert("Copied! 📋", "Score description copied to clipboard!");
  }
}

// --- 11. Social Sharing & Copy Functions ---
async function shareGameCompletionScore() {
  let totalScore = 0;
  let summaryDetails = "";
  
  PRIDE_COLORS.forEach((c) => {
    const scoreVal = sessionScores[c.id] || 0;
    totalScore += scoreVal;
    summaryDetails += `\n${c.hex === '#ff3344' ? '❤️' : c.id === 'orange' ? '🧡' : c.id === 'yellow' ? '💛' : c.id === 'green' ? '💚' : c.id === 'blue' ? '💙' : c.id === 'violet' ? '💜' : '💖'} ${c.name}: ${scoreVal} pts`;
  });
  
  const rankVal = document.getElementById('summary-rank').innerText;
  
  const shareTitle = "Color Color Pride Run Complete! 🏳️‍🌈";
  const shareText = `I completed the 'Color Color' pride scavenger hunt game and scored a total of ${totalScore} points! Rank: ${rankVal}.${summaryDetails}\nCan you beat my score? Play here:`;
  
  // Custom dialog or web share
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: window.location.href
      });
    } catch (err) {
      console.warn("Native share declined, copying to clipboard:", err);
      copyTextToClipboard(shareText + " " + window.location.href);
    }
  } else {
    copyTextToClipboard(shareText + " " + window.location.href);
  }
}

function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showDialogAlert("High Score Copied! 📋", "Your pride scorecard details have been copied to the clipboard. Paste it on Twitter, WhatsApp, or anywhere else!");
  }).catch((err) => {
    console.error("Clipboard copy failed:", err);
  });
}

// --- 12. Setup Event Listeners ---
function bindInteractiveEvents() {
  
  // Menu Buttons
  document.getElementById('btn-start-game').addEventListener('click', () => {
    sfx.playClick();
    startSessionGame();
  });
  
  document.getElementById('btn-how-to').addEventListener('click', () => {
    sfx.playClick();
    document.getElementById('dialog-how-to').showModal();
  });
  
  document.getElementById('btn-close-how-to').addEventListener('click', () => {
    sfx.playClick();
    document.getElementById('dialog-how-to').close();
  });
  
  document.getElementById('btn-nav-gallery').addEventListener('click', () => {
    sfx.playClick();
    activeGalleryFilter = 'all';
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.filter-tab[data-filter="all"]').classList.add('active');
    updateGalleryScreen();
    navigateToScreen('gallery');
  });

  document.getElementById('btn-welcome-gallery').addEventListener('click', () => {
    sfx.playClick();
    activeGalleryFilter = 'all';
    updateGalleryScreen();
    navigateToScreen('gallery');
  });
  
  // Game Play buttons
  document.getElementById('btn-back-home').addEventListener('click', () => {
    sfx.playClick();
    if (confirm("Are you sure you want to exit the current run? All progress for this run will be lost.")) {
      navigateToScreen('welcome');
    }
  });
  
  document.getElementById('btn-shutter').addEventListener('click', () => {
    captureImageFromStream();
  });
  
  document.getElementById('btn-toggle-camera').addEventListener('click', () => {
    sfx.playClick();
    activeCameraFacingMode = activeCameraFacingMode === 'environment' ? 'user' : 'environment';
    initializeCamera();
  });
  
  // Fallback upload trigger
  document.getElementById('input-file-fallback').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          stopCountdownTimer();
          processCapturedImage(img, event.target.result);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Result control toggles
  document.getElementById('btn-toggle-mask').addEventListener('click', (e) => {
    sfx.playClick();
    isMaskEnabled = !isMaskEnabled;
    e.target.innerText = isMaskEnabled ? "Show Mask" : "Show Photo";
    if (currentMatchScoreDetails) {
      renderSegmentedMaskCanvas(currentMatchScoreDetails.imgDataUrl, PRIDE_COLORS[activeColorIndex]);
    }
  });
  
  document.getElementById('btn-result-action').addEventListener('click', () => {
    sfx.playClick();
    advanceGameplay();
  });
  
  // Summary controls
  document.getElementById('btn-share-score').addEventListener('click', () => {
    sfx.playClick();
    shareGameCompletionScore();
  });
  
  document.getElementById('btn-replay').addEventListener('click', () => {
    sfx.playClick();
    startSessionGame();
  });
  
  document.getElementById('btn-summary-gallery-nav').addEventListener('click', () => {
    sfx.playClick();
    activeGalleryFilter = 'all';
    updateGalleryScreen();
    navigateToScreen('gallery');
  });
  
  // Gallery filters and actions
  document.getElementById('btn-gallery-back').addEventListener('click', () => {
    sfx.playClick();
    navigateToScreen('welcome');
  });
  
  document.getElementById('btn-gallery-clear').addEventListener('click', async () => {
    sfx.playClick();
    if (confirm("This will permanently clear all your saved gallery photos. Are you sure?")) {
      await clearGalleryDatabase();
      updateGalleryScreen();
    }
  });
  
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      sfx.playClick();
      filterTabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      activeGalleryFilter = e.target.dataset.filter;
      updateGalleryScreen();
    });
  });
  
  // Audio toggle
  const soundBtn = document.getElementById('btn-toggle-sound');
  soundBtn.addEventListener('click', () => {
    const isMuted = soundBtn.classList.toggle('muted');
    sfx.toggle(!isMuted);
    
    soundBtn.innerHTML = isMuted 
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.063.922-2.063 2.063v4.875c0 1.141.922 2.062 2.063 2.062h1.932l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l2.22-2.22a.75.75 0 000-1.06l-2.22-2.22a.75.75 0 00-1.06 0z" />
        </svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.063.922-2.063 2.063v4.875c0 1.141.922 2.062 2.063 2.062h1.932l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.57 17.47a.75.75 0 11-1.06-1.06 5.25 5.25 0 000-7.42.75.75 0 111.06-1.06 6.75 6.75 0 010 9.54zm2.12 2.12a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.66.75.75 0 111.06-1.06 9.75 9.75 0 010 13.78z" />
        </svg>`;
  });
  
  // Close lightbox modal
  document.getElementById('btn-close-lightbox').addEventListener('click', () => {
    sfx.playClick();
    document.getElementById('dialog-lightbox').close();
  });
  
  document.getElementById('btn-close-alert').addEventListener('click', () => {
    sfx.playClick();
    document.getElementById('dialog-alert').close();
  });
}

// --- 13. Initialization ---
window.addEventListener('DOMContentLoaded', async () => {
  // Bind events
  bindInteractiveEvents();
  
  // Initialize Database
  await initGalleryDB();
  
  // Retrieve PB score
  const personalBest = Number(localStorage.getItem('colorcolor_pb') || 0);
  if (personalBest > 0) {
    document.getElementById('welcome-high-score').innerText = personalBest;
    document.getElementById('welcome-stats').style.display = 'block';
  }
  
  // Initial navigation
  navigateToScreen('welcome');
});
