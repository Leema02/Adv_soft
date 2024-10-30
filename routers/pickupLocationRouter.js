const express = require('express');
const axios = require('axios');
const router = express.Router();

const FOURSQUARE_API_KEY = 'fsq3xa5JQXf0VZLz86e0r35Tzlimn9IEIfOG/6pqlFxGb2w='; 


function displayPickupLocations(data) {
    data.results.forEach(location => {
        console.log(`Name: ${location.name}`);
        console.log(`Address: ${location.location.formatted_address}`);
        console.log(`Distance: ${location.distance} meters`);
        console.log(`Category: ${location.categories.map(cat => cat.name).join(", ")}`);
        console.log("----");
    });
}


router.get('/nearby-pickup-locations', async (req, res) => {
    const { latitude, longitude, query } = req.query; 

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    try {
        const radius = 1000; //radius in meters
        const url = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=${radius}&query=${query}`;

        const response = await axios.get(url, {
            headers: {
                Authorization: FOURSQUARE_API_KEY,
            }
        });
        displayPickupLocations(response.data);

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching pickup locations:', error);
        res.status(500).json({ error: 'Failed to fetch pickup locations' });
    }
});

module.exports = router;
