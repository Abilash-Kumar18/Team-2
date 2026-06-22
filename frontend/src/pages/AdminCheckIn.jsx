import React, { useState } from 'react';
import QRScanner from '../components/QRScanner';
import { scanService } from '../services/api';

const AdminCheckIn = () => {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScanSuccess = async (qrData) => {
    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const response = await scanService.checkIn(qrData);
      setScanResult(response);
    } catch (err) {
      setError(err.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkin-container">
      <h1>Admin Event Check-In</h1>
      <p>Scan an attendee's registration QR code to check them in.</p>

      <div className="scanner-section">
        <QRScanner onScanSuccess={handleScanSuccess} />
      </div>

      <div className="result-section">
        {loading && <p>Processing check-in...</p>}
        {error && <div className="scan-error">{error}</div>}
        {scanResult && (
          <div className={`scan-success ${scanResult.success ? 'checked-in' : 'already-in'}`}>
            <h3>{scanResult.message}</h3>
            {scanResult.registration && (
              <div className="attendee-details">
                <p><strong>Attendee:</strong> {scanResult.registration.user?.name}</p>
                <p><strong>Email:</strong> {scanResult.registration.user?.email}</p>
                <p><strong>Event:</strong> {scanResult.registration.event?.title}</p>
                <p>
                  <strong>Check-in Time:</strong>{' '}
                  {new Date(scanResult.registration.checkInTime).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCheckIn;
