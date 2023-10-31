import React, { useEffect, useState } from "react";
import axios from "axios"; 

// this is the http client library that i found to bypass CORS and make requests to my two apis
// + to install axios i did npm install axios on my command line for the project.


import "../../Metmuseum.Module.css";
import LoadingScreen from "./LoadingScreen";

const API_BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1"; 
// i'm setting the base URL and startpoint for the met api



// for this component, i need to set a random artwork
// a way to define the random artwork that i will get from my math.floor statement
// and then I need to define my wikipedia article, and the chosen wikipedia article based on the randomArtwork chosen
// and finally, a loading statement, because after many tries, I decided to add a loading screen for these two apis, because
// i kept getting errors from making too many requests, or the wikipedia article would sometimes fully take 20+ seconds to find an article.
// the loading and SetLoading helped debug a lot.


const MetMuseumComponent = () => { 
  const [randomArtwork, setRandomArtwork] = useState(null);
  const [wikipediaArticle, setWikipediaArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomArtwork = async () => {
      try {


        // Fetch a list of all object IDs from the Met Museum API
        // so i feel like this is where axios really shines when I define my base url and i'm able to create two new 
        // constants to setup my math.floor statement


        const response = await axios.get(`${API_BASE_URL}/objects`); 
        const allObjectIDs = response.data.objectIDs; 

        // Select a random object ID from the list
        
        const randomObjectID = allObjectIDs[Math.floor(Math.random() * allObjectIDs.length)]; 

        // Fetch the details of the randomly selected artwork
        
        const artworkResponse = await axios.get(`${API_BASE_URL}/objects/${randomObjectID}`);
        const fetchedArtwork = artworkResponse.data;


        // Extract additional information from the artwork response
        // ^ so these are all the additional info i am pulling from the met api that i grabbed from their documentation.

      
        const additionalInfo = {
          department: fetchedArtwork.department,
          accessionYear: fetchedArtwork.accessionYear,
          culture: fetchedArtwork.culture,
          period: fetchedArtwork.period,
          artistDisplayName: fetchedArtwork.artistDisplayName,
        };

       
// so while coding this project, 90% of it was just spent debugging api responses, and finding that a lot of the randomly
// generated artwork had inconsistent amounts of info filled out for the item
// like a vase made in 500 BC would be missing an artistDisplayName
// So I would try to filter by culture and period display info
//  // // tldr: I made a set of if statements for my selected random artwork to filter through options of info that 
// the artwork would have. 
        // Attempt to fetch Wikipedia data based on culture first


  
        let wikiResponse = await searchWikipedia(fetchedArtwork.culture);
      
        // If no result for culture, try fetching based on period
        if (!wikiResponse) {
          wikiResponse = await searchWikipedia(fetchedArtwork.period);
        }

        // If still no result, try fetching based on artistDisplayName
        if (!wikiResponse) {
          wikiResponse = await searchWikipedia(fetchedArtwork.artistDisplayName);
        }


// documentation for catching errors, and overall just making sure i get really clear error statements 
// for myself while coding.


        if (wikiResponse) {
          setWikipediaArticle(wikiResponse);
        } else {
          console.error("Error: Wikipedia page not found for the specified culture, period, or artistDisplayName.");
          setWikipediaArticle(null);
        }

        setRandomArtwork({ ...fetchedArtwork, ...additionalInfo });
        setLoading(false); // Set loading to false once data is fetched successfully
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false if there is an error
      }
    };


// basically once the metapi is fully ready to go and has found it's info, now the real work with making it dynamic begins.
// i have to define a search term variable and filter by possible info categories from the random artwork to find a page to 
// display below the artwork. 
// 
// +++ if I had to make improvements to this, I would definitely want to show the user what the wikipedia page api searched for
// so that the user can tell if the information is relevant or not.
// because I found that when the code defaults to searching for a culture, it just says generic info about a country that is 
// not super detailed.


    const searchWikipedia = async (searchTerm) => {
      try {
        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`);
        
        // Check if the response indicates a disambiguation page
        // so for wikipedia, a disambiguation page are hatnotes or summaries of search results.
        // this if statement is basically checking if the responses from the summaries are pulling up a page or not.
        // this is why I need a loading page :///


        if (response.data.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found" ||
            response.data.type === "https://en.wikipedia.org/api/rest_v1/page/other" ||
            response.data.type === "disambiguation") {
  
          console.log("Disambiguation page found for:", searchTerm);
          return null;
        }
        
        // Check if the response contains relevant information
        // if we pass the disambiguation page stage
        // we move onto pulling relevant data for our artwork
        // if not, we move to getting accurate and correct console.logs for us to debug, with it either being an empty response
        // or an unknown error


        if (response.data.title && response.data.extract) {
          return response.data;
        } else {
          // Handle invalid or empty response
          console.error("Invalid Wikipedia response:", response.data);
          return null;
        }
      } catch (error) {
        // Handle errors
        console.error("Error fetching Wikipedia data:", error);
        return null;
      }
    };

    // Call the function to fetch data
    fetchRandomArtwork();

  }, []);

  useEffect(() => {
    // Check if loading is false and there was an error (wikipediaArticle is null)
    if (!loading && !wikipediaArticle) {
      // Reload the page after 5 seconds (5000 milliseconds)
      const reloadTimeout = setTimeout(() => {
        window.location.reload();
      }, 3000);

      // Clear the timeout if the component unmounts or if loading state changes
      return () => {
        clearTimeout(reloadTimeout);
      };
    }
  }, [loading, wikipediaArticle]);


  return (
    <div className="artwork-container">
      {randomArtwork && wikipediaArticle ? (
        <div>
          <div className="titleWrap">
          <h1 className="header">Artwork of the Day</h1>
          </div>
          <div className="img-wrapper">

            <img className="artwork-image" src={randomArtwork.primaryImage} alt={randomArtwork.title} />
            <h2 className="artwork-title">{randomArtwork.title}</h2>

          </div>

          <div className="additional-info">

            <h2>Additional Information</h2>

            {randomArtwork.department && <p><strong>Department:</strong> {randomArtwork.department}</p>}
            {randomArtwork.accessionYear && <p><strong>Accession Year:</strong> {randomArtwork.accessionYear}</p>}
            {randomArtwork.culture && <p><strong>Culture:</strong> {randomArtwork.culture}</p>}
            {randomArtwork.period && <p><strong>Period:</strong> {randomArtwork.period}</p>}
            {randomArtwork.artistDisplayName && <p><strong>Artist Name:</strong> {randomArtwork.artistDisplayName}</p>}

          </div>

          <h1 className="header">What does Wikipedia have to say about this work?</h1>

          <div className="wikipedia-article">

            <h2>{wikipediaArticle.title}</h2>
            <p>{wikipediaArticle.extract}</p>

          </div>

        </div>

      ) : (
        <div>
          <LoadingScreen/>
        </div>
      )}

    </div>
  );
};

export default MetMuseumComponent;
