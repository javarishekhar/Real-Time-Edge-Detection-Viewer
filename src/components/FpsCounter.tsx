
import React, { useState, useEffect, useRef } from 'react';

export const FpsCounter: React.FC = () => {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastUpdateTime = useRef(performance.now());
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const updateFps = () => {
      frameCount.current += 1;
      const now = performance.now();
      const elapsed = now - lastUpdateTime.current;
      
      // Update FPS calculation every half second
      if (elapsed >= 500) {
        setFps(Math.round((frameCount.current / elapsed) * 1000));
        frameCount.current = 0;
        lastUpdateTime.current = now;
      }
      
      animationFrameId.current = requestAnimationFrame(updateFps);
    };

    animationFrameId.current = requestAnimationFrame(updateFps);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="px-3 py-1 bg-gray-800 rounded-full flex items-center">
      <div className={`h-2 w-2 rounded-full mr-2 ${fps > 15 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
      <span className="text-sm font-medium">{fps} FPS</span>
    </div>
  );
};
