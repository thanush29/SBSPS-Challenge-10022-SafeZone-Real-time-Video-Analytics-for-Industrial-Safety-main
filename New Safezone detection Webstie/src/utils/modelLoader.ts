import * as tf from '@tensorflow/tfjs';

export interface Detection {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  confidence: number;
}

export class YOLODetector {
  private model: tf.GraphModel | null = null;
  private classNames: string[] = [
    'Protective Helmet',
    'Safety Jacket', 
    'Protective Gloves',
    'Dust Mask',
    'Eye Wear',
    'Safety Boots',
    'Shield'
  ];

  async loadModel(modelPath: string = '/models/web_model/model.json'): Promise<boolean> {
    try {
      // For now, we'll simulate model loading since .pt files need conversion
      // In production, you'd convert .pt to TensorFlow.js format
      console.log(`Loading model from ${modelPath}...`);
      
      // Simulate model loading delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a dummy model for demonstration
      this.model = await this.createDummyModel();
      
      console.log('Model loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      return false;
    }
  }

  private async createDummyModel(): Promise<tf.GraphModel> {
    // Create a simple dummy model for demonstration
    // In production, this would be your actual converted YOLO model
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [640 * 640 * 3], units: 128, activation: 'relu' }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: this.classNames.length, activation: 'softmax' })
      ]
    });
    
    return model as any;
  }

  async detect(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<Detection[]> {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    try {
      // Convert image to tensor
      const tensor = tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([640, 640])
        .expandDims(0)
        .div(255.0);

      // For demonstration, generate random detections
      // In production, this would be actual model inference
      const detections = this.generateMockDetections();
      
      tensor.dispose();
      return detections;
    } catch (error) {
      console.error('Detection error:', error);
      return [];
    }
  }

  private generateMockDetections(): Detection[] {
    const detections: Detection[] = [];
    const numDetections = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < numDetections; i++) {
      const classIndex = Math.floor(Math.random() * this.classNames.length);
      const confidence = 0.5 + Math.random() * 0.5; // 50-100% confidence
      
      detections.push({
        bbox: [
          Math.random() * 400, // x
          Math.random() * 300, // y
          50 + Math.random() * 100, // width
          50 + Math.random() * 100  // height
        ],
        class: this.classNames[classIndex],
        confidence: confidence
      });
    }

    return detections;
  }

  getClassNames(): string[] {
    return [...this.classNames];
  }

  isLoaded(): boolean {
    return this.model !== null;
  }
}

export const yoloDetector = new YOLODetector();