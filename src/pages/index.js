import "../app/globals.css"
import React from "react";
import RandomMetImageComponent from "../app/components/api.js";



function App() {
  return (
    <div className="split left">
      <div className="App">
      <RandomMetImageComponent/> 
        </div>   
     <div className="split right" id="right-content">
 <applyColorsToRightContent/>
 
            
        </div> 
    </div>
   
  );
}

export default App;

