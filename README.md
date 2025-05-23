# 🔍 Web-Based Real-Time Edge Detection Viewer

An interactive real-time camera edge detection app built with **React**, **OpenCV.js**, **WebGL**, and **WebRTC**. Designed to mimic native Android OpenCV+OpenGL edge detection pipelines in the browser using modern web technologies.


---
## Screenshots
## Main Frame
![image](https://github.com/user-attachments/assets/6d87adb3-9ed4-4109-8584-5c27c4f999ed)
## Raw Feed
![image](https://github.com/user-attachments/assets/892d3a22-0895-4429-962c-6c4bc34a5d4a)
## Edge detection
![image](https://github.com/user-attachments/assets/706aaa93-c9b8-4e40-9ff8-7ed3ba6a80a5)
## Grayscale
![image](https://github.com/user-attachments/assets/c282e3d8-0ae9-44d9-8c3e-d41833cc2487)
## Gaussian Blur
![image](https://github.com/user-attachments/assets/df358861-2f0b-481a-97d6-f994bfbaeede)
## Threshold
![image](https://github.com/user-attachments/assets/f005b9e2-ffc6-43b1-b31f-f365a6de6fe2)


##  Features Implemented

-  **Live Camera Feed** using WebRTC (`getUserMedia`)
-  **Real-Time Processing** via OpenCV.js:
  - Raw Feed
  - Canny Edge Detection
  - Grayscale Conversion
  - Gaussian Blur
  - Binary Threshold
-  **Efficient Frame Loop** with `requestAnimationFrame`
-  **User Interface** with:
  - Mode Toggle Buttons
  - Active State Indicators
  - FPS Counter (Color-coded)
-  **Performance Optimization**:
  - Frame throttling
  - Memory leak prevention (`cv.Mat` management)
-  **Responsive Design**: Mobile & Desktop friendly
-  **TypeScript + Hooks + Modular Components**

---

Demo Link : https://edge-vision-android-craft.lovable.app/

