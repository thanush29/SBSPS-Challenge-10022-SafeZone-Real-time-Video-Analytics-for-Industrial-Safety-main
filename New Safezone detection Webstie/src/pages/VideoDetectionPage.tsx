import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, AlertCircle, CheckCircle, Video, FileVideo, X, Pause } from 'lucide-react';
import { yoloDetector, Detection } from '../utils/modelLoader';
import { VideoProcessor } from '../utils/videoProcessor';

const VideoDetectionPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stats, setStats] = useState({
    totalDetections: 0,
    safeWorkers: 0,
    violations: 0,
    avgConfidence: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoProcessorRef = useRef<VideoProcessor | null>(null);

  useEffect(() => {
    // Load YOLO model on component mount
    const loadModel = async () => {
      setIsProcessing(true);
      const loaded = await yoloDetector.loadModel('/models/best.pt');
      setIsModelLoaded(loaded);
      setIsProcessing(false);
    };

    loadModel();
  }, []);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setDetections([]);
      setStats({ totalDetections: 0, safeWorkers: 0, violations: 0, avgConfidence: 0 });
      
      // Create video URL and load it
      const videoUrl = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = videoUrl;
        videoRef.current.load();
      }
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const startDetection = async () => {
    if (!selectedFile || !isModelLoaded || !videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    setIsPlaying(true);

    try {
      videoProcessorRef.current = new VideoProcessor();
      
      await videoProcessorRef.current.processVideo(
        videoRef.current,
        canvasRef.current,
        (newDetections) => {
          setDetections(newDetections);
          updateStats(newDetections);
        }
      );

      videoRef.current.play();
    } catch (error) {
      console.error('Detection error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const stopDetection = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (videoProcessorRef.current) {
      videoProcessorRef.current.stopProcessing();
    }
    setIsPlaying(false);
  };

  const updateStats = (newDetections: Detection[]) => {
    const totalDetections = newDetections.length;
    const avgConfidence = totalDetections > 0 
      ? newDetections.reduce((sum, det) => sum + det.confidence, 0) / totalDetections 
      : 0;
    
    // Simple logic: if helmet and jacket detected, consider safe
    const hasHelmet = newDetections.some(det => det.class === 'Protective Helmet');
    const hasJacket = newDetections.some(det => det.class === 'Safety Jacket');
    const safeWorkers = hasHelmet && hasJacket ? 1 : 0;
    const violations = totalDetections > 0 && !safeWorkers ? 1 : 0;

    setStats({
      totalDetections,
      safeWorkers,
      violations,
      avgConfidence: avgConfidence * 100
    });
  };

  const clearSelection = () => {
    stopDetection();
    setSelectedFile(null);
    setDetections([]);
    setStats({ totalDetections: 0, safeWorkers: 0, violations: 0, avgConfidence: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (videoRef.current) {
      videoRef.current.src = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Video Safety Detection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload a video file to analyze PPE compliance using our integrated YOLOv8 detection model.
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
                <CheckCircle className="h-4 w-4 mr-2" />
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-primary-600" />
                Upload Video File
              </h2>

              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                  dragActive
                    ? 'border-primary-400 bg-primary-50'
                    : selectedFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {selectedFile ? (
                  <div className="space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-green-700">File Selected</p>
                      <p className="text-sm text-gray-600 mt-1">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={clearSelection}
                      className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FileVideo className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your video file here
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        or click to browse files
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Supports MP4, AVI, MOV, and other video formats
                    </p>
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="mt-6 flex gap-3">
                {!isPlaying ? (
                  <button
                    onClick={startDetection}
                    disabled={!selectedFile || !isModelLoaded || isProcessing}
                    className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      selectedFile && isModelLoaded && !isProcessing
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Detection
                  </button>
                ) : (
                  <button
                    onClick={stopDetection}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Stop Detection
                  </button>
                )}
              </div>
            </div>

            {/* Detection Stats */}
            {isPlaying && (
              <div className="grid grid-cols-2 gap-4">
                <div className="card text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalDetections}</div>
                  <div className="text-sm text-gray-600">Total Detected</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.safeWorkers}</div>
                  <div className="text-sm text-gray-600">Safe Workers</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.violations}</div>
                  <div className="text-sm text-gray-600">Violations</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.avgConfidence.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Avg Confidence</div>
                </div>
              </div>
            )}
          </div>

          {/* Video Display Section */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Video className="h-5 w-5 mr-2 text-primary-600" />
                Detection Results
              </h2>

              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {selectedFile ? (
                  <>
                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ display: isPlaying ? 'none' : 'block' }}
                      controls={!isPlaying}
                      muted
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ display: isPlaying ? 'block' : 'none' }}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No video selected</p>
                      <p className="text-sm">Upload a video file to start detection</p>
                    </div>
                  </div>
                )}
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
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 card">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Use</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Upload a video file containing industrial workers</li>
                <li>• Wait for the YOLO model to load (shown in status indicator)</li>
                <li>• Click "Start Detection" to begin real-time analysis</li>
                <li>• The system will detect PPE items and draw bounding boxes</li>
                <li>• Monitor detection statistics and safety compliance</li>
                <li>• Use "Stop Detection" to pause analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetectionPage;