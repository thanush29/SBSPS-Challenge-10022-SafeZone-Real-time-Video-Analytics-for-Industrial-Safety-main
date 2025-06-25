import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VideoDetectionPage from './pages/VideoDetectionPage';
import LiveWebcamPage from './pages/LiveWebcamPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/video" element={<VideoDetectionPage />} />
          <Route path="/webcam" element={<LiveWebcamPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;