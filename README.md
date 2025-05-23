# 🔍 Web-Based Real-Time Edge Detection Viewer

An interactive real-time camera edge detection app built with **React**, **OpenCV.js**, **WebGL**, and **WebRTC**. Designed to mimic native Android OpenCV+OpenGL edge detection pipelines in the browser using modern web technologies.

![App Demo](./demo.gif)

---

## ✅ Features Implemented

- 📷 **Live Camera Feed** using WebRTC (`getUserMedia`)
- 🧠 **Real-Time Processing** via OpenCV.js:
  - Raw Feed
  - Canny Edge Detection
  - Grayscale Conversion
  - Gaussian Blur
  - Binary Threshold
- ⚙️ **Efficient Frame Loop** with `requestAnimationFrame`
- 🎮 **User Interface** with:
  - Mode Toggle Buttons
  - Active State Indicators
  - FPS Counter (Color-coded)
- ⚡ **Performance Optimization**:
  - Frame throttling
  - Memory leak prevention (`cv.Mat` management)
- 🌐 **Responsive Design**: Mobile & Desktop friendly
- 🧱 **TypeScript + Hooks + Modular Components**

---

## ⚙️ Setup Instructions

### 🧩 Prerequisites

- Node.js ≥ 16
- npm or yarn

### 🧑‍💻 Clone the Repo

```bash
git clone https://github.com/your-username/edge-detection-web.git
cd edge-detection-web


npm install
# or
yarn

npm run dev
# or
yarn dev


/public
  └── opencv.js         # OpenCV.js runtime
/src
  /components
    └── CameraProcessor.tsx
  /utils
    └── opencvUtils.ts  # Image processing helpers
  App.tsx
  main.tsx

Architecture & Frame Flow
Camera → Canvas → OpenCV → Output Canvas

getUserMedia() streams camera feed into a <video> element.

Video frames are drawn to a hidden canvas.

Each frame is converted into a cv.Mat in OpenCV.js.

Filters (Canny, grayscale, etc.) are applied per user selection.

Output frame is drawn to a visible <canvas> with optional WebGL shaders.

All operations are throttled and cleaned up efficiently to maintain performance.

Known Limitations
OpenCV.js startup can take a few seconds (loading time shown)

Frame rates depend on browser & hardware

GPU acceleration for filters is not yet implemented
