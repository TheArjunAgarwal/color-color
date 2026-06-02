# Color Color – The Pride Photo Scavenger Hunt

**Color Color** is a highly interactive, responsive web-based photography scavenger hunt game. Players match real-world items in their surroundings to the 7 colors of the Pride flag under 30 seconds.

## 🚀 Getting Started

To run the game locally, you need [Node.js](https://nodejs.org/) installed.

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```

3. **Open the game**:
   * Open `http://localhost:5173` in your browser.
   * If testing on a mobile device (highly recommended for the camera scavenger hunt vibe), connect your phone to the same Wi-Fi network and open the local IP address displayed in your terminal (e.g., `http://192.168.1.XX:5173`).

---

## 🎮 How to Play & Game Strategy

1. **Stripe Run**: You will be challenged to match the Pride Flag colors in order: **Red (Life), Orange (Healing), Yellow (Sunlight), Green (Nature), Blue (Harmony), Violet (Spirit), Pink (Sexuality & Diversity)**.
2. **Camera Shutter**: Frame your matching object inside the camera viewfinder and hit the big circular shutter button.
3. **Computer Vision Spectrometer**: An advanced scanning analyzer checks your capture:
   * **Color Match**: Checks if the target hue range matches.
   * **Anti-Jamming Composition**: Avoid jamming your camera against solid colored walls or screens. The engine requires outlines, edges, shading, and details to yield high points.
4. **Pride Gallery**: Every successful capture is added to your local photo gallery (stored persistently in your browser via IndexedDB) and lets you share your matches or individual photos.

---

## 🛠️ Technology Stack

* **Structure & UI**: HTML5, Vanilla CSS3 (Custom responsive styling, glassmorphism, glowing properties, and active state HSL color themes).
* **Synthesizer**: Web Audio API (Generates custom mechanical clicks, laser sweeps, ticking, and arpeggios in real-time).
* **Storage**: `localStorage` (Personal Best scores) and `IndexedDB` (Photo captures gallery).
* **Scoring Engine**: 2D Canvas Image Processing with Sobel Edge Density filters and Hue-Saturation-Lightness (HSL) conversion algorithms.