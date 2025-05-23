
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useCV } from "opencv-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FpsCounter } from "@/components/FpsCounter";
import { EdgeDetectionCanvas } from "@/components/EdgeDetectionCanvas";

const Index = () => {
  const { loaded: cvLoaded, cv } = useCV();
  const [cameraActive, setCameraActive] = useState(false);
  const [processingMode, setProcessingMode] = useState<'raw' | 'edges' | 'grayscale' | 'blur' | 'threshold'>('edges');
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    if (cvLoaded) {
      toast({
        title: "OpenCV Loaded",
        description: "The computer vision library is ready to use.",
      });
    }
  }, [cvLoaded]);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraActive(true);
      // No need to store the stream as it's handled in the EdgeDetectionCanvas
    } catch (error) {
      console.error("Error accessing camera:", error);
      setPermissionError(error instanceof Error ? error.message : "Unable to access camera");
      setOpenPermissionDialog(true);
    }
  };

  const handleStopCamera = () => {
    setCameraActive(false);
  };

  const handleModeChange = (mode: 'raw' | 'edges' | 'grayscale' | 'blur' | 'threshold') => {
    setProcessingMode(mode);
    toast({
      title: "Processing Mode Changed",
      description: `Switched to ${mode} mode`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold">Edge Vision Processor</h1>
        <p className="text-sm text-gray-400">Real-time computer vision processing</p>
      </header>

      <main className="flex-1 p-4 flex flex-col items-center">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          {!cvLoaded ? (
            <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gray-700 mb-4"></div>
                <div className="h-4 w-48 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-700 rounded"></div>
              </div>
              <p className="mt-6 text-gray-400">Loading OpenCV.js...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div>
                  {!cameraActive ? (
                    <Button onClick={handleStartCamera} variant="default" className="bg-green-600 hover:bg-green-700">
                      Start Camera
                    </Button>
                  ) : (
                    <Button onClick={handleStopCamera} variant="destructive">
                      Stop Camera
                    </Button>
                  )}
                </div>
                {cameraActive && <FpsCounter />}
              </div>

              <div className="relative bg-black rounded-lg overflow-hidden shadow-xl aspect-video">
                {cameraActive ? (
                  <EdgeDetectionCanvas 
                    cv={cv} 
                    processingMode={processingMode} 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Camera is off</p>
                  </div>
                )}
              </div>

              {cameraActive && (
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={() => handleModeChange('raw')} 
                    variant={processingMode === 'raw' ? 'default' : 'outline'}
                    className={processingMode === 'raw' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    Raw Feed
                  </Button>
                  <Button 
                    onClick={() => handleModeChange('edges')} 
                    variant={processingMode === 'edges' ? 'default' : 'outline'}
                    className={processingMode === 'edges' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    Edge Detection
                  </Button>
                  <Button 
                    onClick={() => handleModeChange('grayscale')} 
                    variant={processingMode === 'grayscale' ? 'default' : 'outline'}
                    className={processingMode === 'grayscale' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    Grayscale
                  </Button>
                  <Button 
                    onClick={() => handleModeChange('blur')} 
                    variant={processingMode === 'blur' ? 'default' : 'outline'}
                    className={processingMode === 'blur' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    Gaussian Blur
                  </Button>
                  <Button 
                    onClick={() => handleModeChange('threshold')} 
                    variant={processingMode === 'threshold' ? 'default' : 'outline'}
                    className={processingMode === 'threshold' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    Threshold
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="p-4 text-center text-gray-400 text-sm">
        Edge Vision Processor &copy; {new Date().getFullYear()}
      </footer>

      <Dialog open={openPermissionDialog} onOpenChange={setOpenPermissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Camera Permission Required</DialogTitle>
            <DialogDescription>
              {permissionError || "Please allow access to your camera to use this application."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setOpenPermissionDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
