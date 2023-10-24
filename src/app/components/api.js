import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Metmuseum.Module.css";

const API_BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

const MetMuseumComponent = () => {
  const [randomArtwork, setRandomArtwork] = useState(null);
  const [wikipediaArticle, setWikipediaArticle] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const fetchedArtwork = artworkResponse.data;

    // Extract the creation year from the objectDate property
    const creationYear = fetchedArtwork.objectDate ? parseInt(fetchedArtwork.objectDate) : "Unknown";

    // Use the extracted year to search for art movements on Wikipedia
    const wikiResponse = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${creationYear}`);

    // Check if the Wikipedia response indicates a missing page
    if (wikiResponse.data.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found") {
      console.error("Error: Wikipedia page not found for the specified era.");
      setWikipediaArticle(null); // Set Wikipedia article to null
    } else {
      setWikipediaArticle(wikiResponse.data);
    }

    setRandomArtwork(fetchedArtwork);
    setLoading(false); // Set loading to false once data is fetched successfully

  } catch (error) {
    console.error("Error fetching data:", error);
    setLoading(false); // Set loading to false if there is an error
  }
};
  
    fetchRandomArtwork();
  }, []);
  return (
    <div className="artwork-container">
      {randomArtwork && wikipediaArticle ? (
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
          <div className="wikipedia-article">
            <h2>{wikipediaArticle.title}</h2>
            <p>{wikipediaArticle.extract}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MetMuseumComponent;