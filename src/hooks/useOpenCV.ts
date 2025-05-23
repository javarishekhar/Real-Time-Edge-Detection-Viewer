
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    cv: any;
  }
}

export const useOpenCV = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if OpenCV.js is already loaded
    if (window.cv) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.5.5/opencv.js';
    script.async = true;
    script.onload = () => {
      // OpenCV.js has a module called cv that it adds to the window object
      if (window.cv) {
        console.log('OpenCV.js loaded successfully');
        setLoaded(true);
      } else {
        setError('OpenCV.js loaded but cv namespace is not available');
      }
    };
    script.onerror = () => {
      setError('Failed to load OpenCV.js');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return {
    loaded,
    error,
    cv: loaded ? window.cv : null,
  };
};
