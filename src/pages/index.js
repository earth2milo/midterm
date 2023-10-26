import "../app/globals.css"
import React from "react";
import RandomMetImageComponent from "../app/components/api.js";

import ArtworkComponent from "@/app/components/api2";



function App() {
  return (
    <div className="noise">
    <div className="split left">
      <div className="App">
     <RandomMetImageComponent/>
      
        </div>   
       
    </div>
    </div>
  );
}

export default App;

