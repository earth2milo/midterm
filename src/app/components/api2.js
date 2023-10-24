async function fetchColorsFromCoolorsAPI() {
    try {
      const response = await fetch('https://coolors.co/api/palettes/random', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
      return data[0].colors; // Extract colors from the API response
    } catch (error) {
      console.error('Error fetching colors from Coolors API:', error);
      return null;
    }
  }
  
  async function applyColorsToWebpage() {
    const colors = await fetchColorsFromCoolorsAPI();
    if (colors) {
      const [bgColor, textColor] = colors;
      document.body.style.backgroundColor = `#${bgColor}`;
      document.body.style.color = `#${textColor}`;
    }
  }
  
  // Call the function to apply colors when the page loads
  applyColorsToWebpage();