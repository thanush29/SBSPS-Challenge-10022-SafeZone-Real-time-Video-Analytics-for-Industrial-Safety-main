# YOLO Model Integration Guide

## Converting PyTorch Models to TensorFlow.js

To use your `best.pt` and `yolov8m.pt` models in the browser, you need to convert them to TensorFlow.js format.

### Step 1: Convert PyTorch to ONNX
```bash
# Install required packages
pip install ultralytics onnx

# Convert YOLO model to ONNX
from ultralytics import YOLO
model = YOLO('best.pt')
model.export(format='onnx')
```

### Step 2: Convert ONNX to TensorFlow.js
```bash
# Install tensorflowjs converter
pip install tensorflowjs

# Convert ONNX to TensorFlow.js
tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_format=tfjs_graph_model \
    --signature_name=serving_default \
    --saved_model_tags=serve \
    ./best.onnx \
    ./web_model/
```

### Step 3: Update Model Loading
Once converted, update the model path in `modelLoader.ts`:
```typescript
await tf.loadGraphModel('/models/web_model/model.json');
```

## Current Implementation

The current implementation uses a mock model for demonstration. To integrate your actual models:

1. Convert your `.pt` files using the steps above
2. Place the converted model files in `public/models/`
3. Update the `loadModel` method in `modelLoader.ts`
4. Adjust the detection logic based on your model's output format

## Model Requirements

- Input size: 640x640 (standard YOLO input)
- Output format: Bounding boxes + class probabilities
- Classes: 7 PPE categories as defined in the application

## Performance Notes

- Browser-based inference is slower than server-side
- Consider using WebGL backend for better performance
- Optimize model size for web deployment