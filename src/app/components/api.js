import React, { useEffect, useState } from "react";
// my wikipedia api kept calling for coors and I really wanted it to work for this project
// so i found this cors proxy to redirect.
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
import axios from "axios";
import "../../Metmuseum.Module.css";
import wikipedia from 'wikipedia';

const API_BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

const MetMuseumComponent = () => {
  const [randomArtwork, setRandomArtwork] = useState(null);
  const [wikipediaArticle, setWikipediaArticle] = useState(null);
  const [wikipediaData, setWikipediaData] = useState(null);
// // i am super proud and happy i found out how to do this,
// //  i was having a lot of trouble with my images never loading or me 
// being stuck in preview messages not being sure what was happening, and 
 // the loading message was definitely helpful to instantly know it was my api link
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
   


    // Fetch Wikipedia Date based on artwork's title or relevant ID i can find
    // here is when i plug in the cors proxy
    const wikipediaApiUrl = `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(fetchedArtwork.title)}`;
  
  //const wikipediaApiUrl = `${CORS_PROXY}https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(
 //     fetchedArtwork.title 
//    )}`;
    const wikipediaResponse = await axios.get(wikipediaApiUrl);

    // Set wikipedia data

 
    
    if (wikipediaResponse.data.query.pages[-1]) {
      console.error("Error: Wikipedia page not found for the specified artwork.");
      setWikipediaArticle(null); // Set Wikipedia article to null
    } else {
      // Set Wikipedia article data
      const pageId = Object.keys(wikipediaResponse.data.query.pages)[0];
      setWikipediaArticle(wikipediaResponse.data.query.pages[pageId]);
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