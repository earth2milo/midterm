
import React, { useEffect, useState } from "react";
import axios from "axios"; 
import "../../Metmuseum.Module.css"


const API_BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

const MetMuseumComponent = () => {
  const [randomArtwork, setRandomArtwork] = useState(null);

  useEffect(() => {
    const fetchRandomArtwork = async () => {
      try {
        // Fetch a list of all object IDs from the Met Museum API
        const response = await axios.get(`${API_BASE_URL}/objects`);
        const allObjectIDs = response.data.objectIDs;

        // Select a random object ID from the list
        const randomObjectID = allObjectIDs[Math.floor(Math.random() * allObjectIDs.length)];

        // Fetch the details of the randomly selected artwork
        const artworkResponse = await axios.get(`${API_BASE_URL}/objects/${randomObjectID}`);
        setRandomArtwork(artworkResponse.data);
      } catch (error) {
        console.error("Error fetching random artwork from Met Museum API:", error);
      }
    };


    fetchRandomArtwork();
  }, []); // Empty dependency array ensures useEffect runs once when the component mounts




  
      return (
        <div className="artwork-container">
          {randomArtwork ? (
            <div>
              <h1>Artwork of the Day</h1>
              <div className="img-wrapper">
              <h2 className="artwork-title">{randomArtwork.title}</h2>
              <img
                className="artwork-image"
                src={randomArtwork.primaryImage}
                alt={randomArtwork.title}
              />
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      );
    };

export default MetMuseumComponent;
