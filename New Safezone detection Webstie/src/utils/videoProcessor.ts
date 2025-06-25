import { Detection, yoloDetector } from './modelLoader';

export class VideoProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async processVideo(
    videoElement: HTMLVideoElement,
    outputCanvas: HTMLCanvasElement,
    onDetection?: (detections: Detection[]) => void
  ): Promise<void> {
    const ctx = outputCanvas.getContext('2d')!;
    
    const processFrame = async () => {
      if (videoElement.paused || videoElement.ended) {
        return;
      }

      // Set canvas size to match video
      outputCanvas.width = videoElement.videoWidth || 640;
      outputCanvas.height = videoElement.videoHeight || 480;

      // Draw video frame
      ctx.drawImage(videoElement, 0, 0, outputCanvas.width, outputCanvas.height);

      try {
        // Run detection
        const detections = await yoloDetector.detect(videoElement);
        
        // Draw detections
        this.drawDetections(ctx, detections, outputCanvas.width, outputCanvas.height);
        
        // Callback with detections
        if (onDetection) {
          onDetection(detections);
        }
      } catch (error) {
        console.error('Detection error:', error);
      }

      // Continue processing
      this.animationId = requestAnimationFrame(processFrame);
    };

    processFrame();
  }

  async processWebcam(
    stream: MediaStream,
    outputCanvas: HTMLCanvasElement,
    onDetection?: (detections: Detection[]) => void
  ): Promise<void> {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.muted = true;

    video.onloadedmetadata = () => {
      this.processVideo(video, outputCanvas, onDetection);
    };
  }

  private drawDetections(
    ctx: CanvasRenderingContext2D,
    detections: Detection[],
    canvasWidth: number,
    canvasHeight: number
  ): void {
    detections.forEach((detection, index) => {
      const [x, y, width, height] = detection.bbox;
      
      // Scale coordinates to canvas size
      const scaledX = (x / 640) * canvasWidth;
      const scaledY = (y / 640) * canvasHeight;
      const scaledWidth = (width / 640) * canvasWidth;
      const scaledHeight = (height / 640) * canvasHeight;

      // Choose color based on class
      const colors = [
        '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B',
        '#EF4444', '#6366F1', '#EC4899'
      ];
      const color = colors[index % colors.length];

      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

      // Draw label background
      const label = `${detection.class} (${(detection.confidence * 100).toFixed(1)}%)`;
      ctx.font = '14px Inter, sans-serif';
      const textMetrics = ctx.measureText(label);
      const textWidth = textMetrics.width;
      const textHeight = 20;

      ctx.fillStyle = color;
      ctx.fillRect(scaledX, scaledY - textHeight - 5, textWidth + 10, textHeight + 5);

      // Draw label text
      ctx.fillStyle = 'white';
      ctx.fillText(label, scaledX + 5, scaledY - 8);
    });
  }

  stopProcessing(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}