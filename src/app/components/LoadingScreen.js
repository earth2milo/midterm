import React from "react";
import "./LoadingScreen.css"; 

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-bar">
        <div className="loading-text">The Wiki & Met API is Generating your data</div>
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;