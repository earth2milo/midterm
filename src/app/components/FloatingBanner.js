import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    
    <div className="loading-container">
      <motion.svg
        width="150"
        height="150"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      >
        <motion.path
          d="M 50,50 m -25,0 a 25,25 0 1,0 50,0 a 25,25 0 1,0 -50,0"
          strokeWidth="10"
          stroke="#4E5952"
          fill="white"
        />
      </motion.svg>
    </div>
  );
};

export default LoadingScreen;