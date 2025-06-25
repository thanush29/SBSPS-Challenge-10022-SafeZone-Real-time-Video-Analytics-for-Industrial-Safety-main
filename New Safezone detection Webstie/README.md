# SafeZone - Industrial Safety Monitoring Frontend

A modern React frontend for real-time PPE (Personal Protective Equipment) detection using YOLOv8 object detection.

## Features

- **Real-time Video Detection**: Upload video files for PPE compliance analysis
- **Live Webcam Monitoring**: Real-time safety monitoring using webcam feed
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **PPE Detection Classes**: Detects 7 types of safety equipment:
  - Protective Helmet
  - Safety Jacket
  - Protective Gloves
  - Dust Mask
  - Eye Wear
  - Safety Boots
  - Shield

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/
│   └── Layout.tsx          # Main layout with navigation
├── pages/
│   ├── HomePage.tsx        # Landing page with features
│   ├── VideoDetectionPage.tsx  # Video upload and detection
│   └── LiveWebcamPage.tsx  # Live webcam monitoring
├── App.tsx                 # Main app component
├── main.tsx               # App entry point
└── index.css              # Global styles

public/
└── models/                 # Place your YOLO model files here
    ├── best.pt            # Your custom PPE detection model
    ├── yolov8m.pt         # YOLOv8 medium model (optional)
    └── README.md          # Model directory instructions
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Add Your YOLO Models**:
   - Place your `best.pt` model file in `public/models/`
   - Optionally add `yolov8m.pt` in the same directory

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Model Integration

This frontend is designed to work with a Flask backend that uses your YOLO models. The models should be placed in the `public/models/` directory:

- **best.pt**: Your custom trained model for PPE detection
- **yolov8m.pt**: YOLOv8 medium model (optional fallback)

## Backend Integration

The frontend expects these API endpoints from your Flask backend:

- `POST /api/upload-video` - Video file upload
- `GET /api/video-stream` - Processed video stream
- `GET /api/webcam-stream` - Live webcam stream with detection

## Features Overview

### Home Page
- Feature showcase
- PPE detection classes overview
- System statistics
- Call-to-action buttons

### Video Detection
- Drag & drop video upload
- Real-time processing status
- Detection results display
- File format validation

### Live Webcam
- Real-time camera feed
- Live detection statistics
- System status monitoring
- PPE compliance tracking

## Customization

The frontend is fully customizable:
- Modify detection classes in the components
- Update color schemes in `tailwind.config.js`
- Add new pages or features as needed
- Integrate with different backend APIs

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is part of the SafeZone industrial safety monitoring system.