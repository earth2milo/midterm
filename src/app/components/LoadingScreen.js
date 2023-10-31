import React from "react";
import "./LoadingScreen.css"; 

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="logoWrap">
        < img className="logo" src="/Milo_Logo.png" alt="Milo Soriano Portfolio Logo" />
      </div>
      <div className="loading-bar">
        <div className="loading-text">The Wiki & Met API is Generating your data
        </div>
        <div className="progress-bar">
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;