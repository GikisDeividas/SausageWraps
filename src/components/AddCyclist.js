import React, { useState, useRef } from 'react';
import './AddCyclist.css';

const AddCyclist = ({ onBack, onAddCyclist }) => {
  const [step, setStep] = useState('code'); // 'code', 'camera', 'name'
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cyclistName, setCyclistName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (code === '135') {
      setStep('camera');
      setError('');
      requestCameraAccess();
    } else {
      setError('Incorrect code. Returning to main page.');
      setTimeout(() => {
        onBack();
      }, 2000);
    }
  };

  const requestCameraAccess = async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera access and try again.');
      console.error('Camera access error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    
    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setStep('name');
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setStep('camera');
    requestCameraAccess();
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (cyclistName.trim() && capturedImage) {
      onAddCyclist(cyclistName.trim(), capturedImage);
      onBack();
    }
  };

  const handleBack = () => {
    // Clean up camera stream if active
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onBack();
  };

  if (step === 'code') {
    return (
      <div className="add-cyclist-container">
        <div className="add-cyclist-content">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          
          <h2>Enter Access Code</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleCodeSubmit} className="code-form">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="code-input"
              autoFocus
            />
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'camera') {
    return (
      <div className="add-cyclist-container">
        <div className="camera-content">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          
          <h2>Take Photo</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          {isLoading && <div className="loading">Accessing camera...</div>}
          
          <div className="camera-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="camera-video"
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
          
          {stream && (
            <button className="capture-button" onClick={capturePhoto}>
              📸 Capture Photo
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step === 'name') {
    return (
      <div className="add-cyclist-container">
        <div className="add-cyclist-content">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          
          <h2>Name Your Photo</h2>
          
          <div className="captured-image-container">
            <img src={capturedImage} alt="Captured cyclist" className="captured-image" />
          </div>
          
          <form onSubmit={handleNameSubmit} className="name-form">
            <input
              type="text"
              value={cyclistName}
              onChange={(e) => setCyclistName(e.target.value)}
              placeholder="Enter cyclist name"
              className="name-input"
              autoFocus
              required
            />
            <div className="button-group">
              <button type="button" onClick={retakePhoto} className="retake-button">
                Retake Photo
              </button>
              <button type="submit" className="save-button">
                Save Cyclist
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
};

export default AddCyclist; 