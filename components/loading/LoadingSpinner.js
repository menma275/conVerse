import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return <div className="loading">Loading<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></div>;
}

export default LoadingSpinner;