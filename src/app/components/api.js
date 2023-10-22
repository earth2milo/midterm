
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

const MetMuseumComponent = () => {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/search?q=cat`);
        setArtworks(response.data.objectIDs);
      } catch (error) {
        console.error("Error fetching data from Met Museum API:", error);
      }
    };

    fetchData();
  }, []); 

  const fetchArtworkDetails = async (objectId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/objects/${objectId}`);
      setSelectedArtwork(response.data);
    } catch (error) {
      console.error("Error fetching artwork details from Met Museum API:", error);
    }
  };

  return (
    <div>
    <h1>Met Museum Artworks</h1>

    {selectedArtwork && (
      <div>
        <h2>{selectedArtwork.title}</h2>
        <img src={selectedArtwork.primaryImage} alt={selectedArtwork.title} style={{ maxWidth: "100%" }} />
      </div>
    )}
  </div>
);
};

export default MetMuseumComponent;
