
import React, { useRef, useEffect, useState } from 'react';

interface EdgeDetectionCanvasProps {
  cv: any; // OpenCV.js instance
  processingMode: 'raw' | 'edges' | 'grayscale' | 'blur' | 'threshold';
}

export const EdgeDetectionCanvas: React.FC<EdgeDetectionCanvasProps> = ({ cv, processingMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 640, height: 480 });

  // Function to process a single frame with OpenCV
  const processFrame = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');
    if (!context || !cv) return;
    
    try {
      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Skip processing if "raw" mode is selected
      if (processingMode === 'raw') return;
      
      // Start OpenCV processing
      const src = cv.imread(canvas);
      const dst = new cv.Mat();
      
      // Process based on selected mode
      if (processingMode === 'edges') {
        // Convert to grayscale first
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        // Apply edge detection (Canny algorithm)
        cv.Canny(dst, dst, 50, 150, 3, false);
        // Convert back to RGBA to display
        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
      } else if (processingMode === 'grayscale') {
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
      } else if (processingMode === 'blur') {
        const ksize = new cv.Size(15, 15);
        cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
      } else if (processingMode === 'threshold') {
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        cv.threshold(dst, dst, 120, 200, cv.THRESH_BINARY);
        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
      }
      
      // Display result on canvas
      cv.imshow(canvas, dst);
      
      // Clean up memory to avoid leaks
      src.delete();
      dst.delete();
    } catch (err) {
      console.error('Error processing frame:', err);
    }
  };

  // Animation loop using requestAnimationFrame
  const animate = (time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }

    // Only process every ~33ms (targeting ~30fps)
    const deltaTime = time - previousTimeRef.current;
    if (deltaTime > 33) {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        processFrame(videoRef.current, canvasRef.current);
      }
      previousTimeRef.current = time;
    }
    
    requestRef.current = requestAnimationFrame(animate);
  };

  // Setup camera stream
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          
          // Set canvas dimensions based on video stream
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              setDimensions({
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight
              });
            }
          };
        }
      } catch (error) {
        console.error('Error setting up camera:', error);
      }
    };

    setupCamera();
    
    return () => {
      // Stop camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize animation loop
  useEffect(() => {
    if (cv) {
      requestRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [processingMode, cv]);

  return (
    <div className="relative w-full h-full">
      <video 
        ref={videoRef} 
        className="hidden"
        width={dimensions.width} 
        height={dimensions.height} 
        autoPlay 
        muted 
        playsInline
      />
      <canvas 
        ref={canvasRef} 
        width={dimensions.width} 
        height={dimensions.height} 
        className="w-full h-full object-contain"
      />
    </div>
  );
};
