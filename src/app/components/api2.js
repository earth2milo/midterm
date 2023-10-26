// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ArtworkComponent = () => {
//   const [artwork, setArtwork] = useState(null);
//   const [artistInfo, setArtistInfo] = useState('');

//   useEffect(() => {
//     const fetchArtwork = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/artwork');
//         setArtwork(response.data);

//         // Fetch artist or culture information from Wikipedia API
//         const searchTerm = response.data.artistDisplayName || response.data.culture;
//         const wikipediaUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(
//           searchTerm
//         )}`;

//         const wikipediaResponse = await axios.get(wikipediaUrl);
//         const page = wikipediaResponse.data.query.pages;
//         const firstPageId = Object.keys(page)[0];
//         const extract = page[firstPageId].extract;
//         setArtistInfo(extract || 'No information available');
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchArtwork();
//   }, []); // Empty dependency array to run the effect only once after the initial render

//   return (
//     <div className="ArtworkComponent">
//       {artwork && (
//         <div>
//           <h1>{artwork.title}</h1>
//           <p>Artist: {artwork.artistDisplayName}</p>
//           <p>Date: {artwork.objectDate}</p>
//           {artwork.primaryImage && (
//             <img src={artwork.primaryImage} alt={artwork.title} style={{ maxWidth: '100%' }} />
//           )}
//           <div dangerouslySetInnerHTML={{ __html: artistInfo }}></div> {/* Render HTML content */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ArtworkComponent;

