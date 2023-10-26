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

        // Extract additional information from the artwork response
        const additionalInfo = {
          department: fetchedArtwork.department,
          accessionYear: fetchedArtwork.accessionYear,
          culture: fetchedArtwork.culture,
          period: fetchedArtwork.period,
          artistDisplayName: fetchedArtwork.artistDisplayName,
        };

        // Use the culture information to search for related content on Wikipedia
        const wikiResponse = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${fetchedArtwork.culture}`);

        // Check if the Wikipedia response indicates a missing page
        if (wikiResponse.data.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found") {
          console.error("Error: Wikipedia page not found for the specified culture.");
          setWikipediaArticle(null); // Set Wikipedia article to null
        } else {
          setWikipediaArticle(wikiResponse.data);
        }

        setRandomArtwork({ ...fetchedArtwork, ...additionalInfo });
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
            <img className="artwork-image" src={randomArtwork.primaryImage} alt={randomArtwork.title} />
          </div>
          <div className="additional-info">
            <h2>Additional Information</h2>
            {randomArtwork.department && <p><strong>Department:</strong> {randomArtwork.department}</p>}
            {randomArtwork.accessionYear && <p><strong>Accession Year:</strong> {randomArtwork.accessionYear}</p>}
            {randomArtwork.culture && <p><strong>Culture:</strong> {randomArtwork.culture}</p>}
            {randomArtwork.period && <p><strong>Period:</strong> {randomArtwork.period}</p>}
            {randomArtwork.artistDisplayName && <p><strong>Artist Display Name:</strong> {randomArtwork.artistDisplayName}</p>}
          </div>
          <p>What does Wikipedia have to say about the culture of this work?</p>
          <div className="wikipedia-article">
            <h2>{wikipediaArticle.title}</h2>
            <p>{wikipediaArticle.extract}</p>
          </div>
        </div>
      ) : (
        <p>Oh no! The Met API tripped and fell on the way to work! and there is no information available for the selected artwork. Please refresh!.</p>
      )}
    </div>
  );
};

export default MetMuseumComponent;
