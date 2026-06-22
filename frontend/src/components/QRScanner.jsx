import React, { useState } from 'react';
import Button from './Button';

const QRScanner = ({ onScanSuccess }) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onScanSuccess(inputVal.trim());
      setInputVal('');
    }
  };

  return (
    <div className="qr-scanner-card">
      <div className="camera-viewfinder">
        <div className="scan-overlay"></div>
        <p className="viewfinder-text">Position QR code within frame</p>
      </div>

      <div className="manual-scan-input">
        <p>Or input QR data manually for testing:</p>
        <form onSubmit={handleSubmit} className="scan-form">
          <input
            type="text"
            placeholder='e.g. {"userId":"123","eventId":"456"}'
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="scan-input"
          />
          <Button type="submit" text="Simulate Scan" variant="primary" />
        </form>
      </div>
    </div>
  );
};

export default QRScanner;
