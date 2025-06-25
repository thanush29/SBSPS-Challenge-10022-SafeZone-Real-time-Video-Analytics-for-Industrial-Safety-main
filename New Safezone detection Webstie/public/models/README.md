# YOLO Models Directory

Place your trained YOLO model files here:

- `best.pt` - Your custom trained model for PPE detection
- `yolov8m.pt` - YOLOv8 medium model (if needed as fallback)

## Model Files Structure:
```
public/models/
├── best.pt          # Your custom PPE detection model
├── yolov8m.pt       # YOLOv8 medium model (optional)
└── README.md        # This file
```

## Usage:
The frontend will reference these models when connecting to your Flask backend.
Your Flask backend should load these models from this directory.

## Note:
- These model files are not included in the repository due to their large size
- Make sure to place your actual model files here before running the application
- The models should be compatible with ultralytics YOLO format