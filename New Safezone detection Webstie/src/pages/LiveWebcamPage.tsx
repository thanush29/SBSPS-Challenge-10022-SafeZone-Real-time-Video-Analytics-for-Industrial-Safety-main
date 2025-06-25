import React, { useState, useEffect, useRef } from 'react';
import { Camera, Play, Square, AlertTriangle, Activity, Users, Shield } from 'lucide-react';
import { yoloDetector, Detection } from '../utils/modelLoader';
import { VideoProcessor } from '../utils/videoProcessor';
import { useWebcam } from '../hooks/useWebcam';

const LiveWebcamPage: React.FC = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [detectionStats, setDetectionStats] = useState({
    totalDetections: 0,
    safeWorkers: 0,
    violations: 0,
    confidence: 0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoProcessorRef = useRef<VideoProcessor | null>(null);
  
  const { isActive, error, startWebcam, stopWebcam } = useWebcam();

  useEffect(() => {
    // Load YOLO model on component mount
    const loadModel = async () => {
      const loaded = await yoloDetector.loadModel('/models/best.pt');
      setIsModelLoaded(loaded);
    };

    loadModel();
  }, []);

  const startStream = async () => {
    if (!isModelLoaded) {
      alert('Please wait for the model to load');
      return;
    }

    try {
      const stream = await startWebcam();
      if (stream && canvasRef.current) {
        videoProcessorRef.current = new VideoProcessor();
        
        await videoProcessorRef.current.processWebcam(
          stream,
          canvasRef.current,
          (newDetections) => {
            setDetections(newDetections);
            updateDetectionStats(newDetections);
          }
        );
      }
    } catch (error) {
      console.error('Failed to start webcam:', error);
    }
  };

  const stopStream = () => {
    stopWebcam();
    if (videoProcessorRef.current) {
      videoProcessorRef.current.stopProcessing();
    }
    setDetections([]);
    setDetectionStats({
      totalDetections: 0,
      safeWorkers: 0,
      violations: 0,
      confidence: 0
    });
  };

  const updateDetectionStats = (newDetections: Detection[]) => {
    const totalDetections = newDetections.length;
    const avgConfidence = totalDetections > 0 
      ? newDetections.reduce((sum, det) => sum + det.confidence, 0) / totalDetections 
      : 0;
    
    // Simple safety logic
    const hasHelmet = newDetections.some(det => det.class === 'Protective Helmet');
    const hasJacket = newDetections.some(det => det.class === 'Safety Jacket');
    const safeWorkers = hasHelmet && hasJacket ? 1 : 0;
    const violations = totalDetections > 0 && !safeWorkers ? 1 : 0;

    setDetectionStats({
      totalDetections,
      safeWorkers,
      violations,
      confidence: avgConfidence * 100
    });
  };

  const detectionClasses = [
    { name: 'Protective Helmet', color: 'bg-blue-500', detected: detections.some(d => d.class === 'Protective Helmet') },
    { name: 'Safety Jacket', color: 'bg-green-500', detected: detections.some(d => d.class === 'Safety Jacket') },
    { name: 'Protective Gloves', color: 'bg-purple-500', detected: detections.some(d => d.class === 'Protective Gloves') },
    { name: 'Dust Mask', color: 'bg-yellow-500', detected: detections.some(d => d.class === 'Dust Mask') },
    { name: 'Eye Wear', color: 'bg-red-500', detected: detections.some(d => d.class === 'Eye Wear') },
    { name: 'Safety Boots', color: 'bg-indigo-500', detected: detections.some(d => d.class === 'Safety Boots') },
    { name: 'Shield', color: 'bg-pink-500', detected: detections.some(d => d.class === 'Shield') }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Live Webcam Detection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time PPE detection using your webcam with integrated YOLO model.
          </p>
        </div>

        {/* Model Status */}
        <div className="mb-6 text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            isModelLoaded 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isModelLoaded ? (
              <>
                <Shield className="h-4 w-4 mr-2" />
                YOLO Model Ready
              </>
            ) : (
              <>
                <div className="loading-spinner mr-2 w-4 h-4"></div>
                Loading Model...
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-primary-600" />
                  Live Video Feed
                </h2>
                <div className="flex items-center space-x-2">
                  {isActive && (
                    <span className="status-indicator online text-sm font-medium text-green-700">
                      Live
                    </span>
                  )}
                </div>
              </div>

              <div className="video-container bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {isActive ? (
                  <canvas
                    ref={canvasRef}
                    className="video-stream w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <Camera className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg font-medium">Webcam Not Active</p>
                      <p className="text-sm">Click start to begin live detection</p>
                      {error && (
                        <p className="text-sm text-red-400 mt-2">Error: {error}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="mt-4 flex justify-center">
                {!isActive ? (
                  <button
                    onClick={startStream}
                    disabled={!isModelLoaded}
                    className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      isModelLoaded
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Live Detection
                  </button>
                ) : (
                  <button
                    onClick={stopStream}
                    className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop Detection
                  </button>
                )}
              </div>
            </div>

            {/* Real-time Stats */}
            {isActive && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{detectionStats.totalDetections}</div>
                  <div className="text-sm text-gray-600">Total Detected</div>
                </div>
                <div className="card text-center">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{detectionStats.safeWorkers}</div>
                  <div className="text-sm text-gray-600">Safe Workers</div>
                </div>
                <div className="card text-center">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{detectionStats.violations}</div>
                  <div className="text-sm text-gray-600">Violations</div>
                </div>
                <div className="card text-center">
                  <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{detectionStats.confidence.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Avg Confidence</div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Detection Status */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Camera</span>
                  <span className={`status-indicator text-sm font-medium ${isActive ? 'online text-green-700' : 'offline text-red-700'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">AI Model</span>
                  <span className={`status-indicator text-sm font-medium ${isModelLoaded ? 'online text-green-700' : 'offline text-yellow-700'}`}>
                    {isModelLoaded ? 'Ready' : 'Loading'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Frame Rate</span>
                  <span className="text-sm font-medium text-gray-900">
                    {isActive ? '30 FPS' : '0 FPS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Detection Classes */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">PPE Detection Classes</h3>
              <div className="space-y-2">
                {detectionClasses.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${item.detected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Detections */}
            {detections.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Detections</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {detections.map((detection, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{detection.class}</span>
                      <span className="text-sm text-gray-600">
                        {(detection.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Guidelines */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Guidelines</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Ensure proper lighting for accurate detection</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Position camera to capture full body view</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Allow camera access when prompted</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Monitor alerts for safety violations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 card">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Detection Instructions</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Wait for the YOLO model to load completely</li>
                <li>• Click "Start Live Detection" to activate your webcam</li>
                <li>• Allow browser access to your camera when prompted</li>
                <li>• The system will analyze the video feed in real-time</li>
                <li>• PPE items will be highlighted with colored bounding boxes</li>
                <li>• Monitor the statistics panel for compliance metrics</li>
                <li>• Ensure good lighting and clear view for best results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveWebcamPage;