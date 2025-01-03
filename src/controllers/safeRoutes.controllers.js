import fetch from "node-fetch";
import { SafeRoute } from "../models/safeRoutes.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Enter the current location
const getSafeRoute = asyncHandler(async(req, res) => {
     const{startLocation, destination} = req.body

     if(!startLocation || !destination) {
        throw new ApiError(400, "Required Start and End both locations")
     }

// api key and url og geoapify routing api
const apiKey = process.env.GEOAPIFY_API_KEY;
const routingBaseUrl = "https://api.geoapify.com/v1/routing";
const placesBaseUrl = "https://api.geoapify.com/v1/places";
const mapTileBaseUrl = "https://maps.geoapify.com/v1/tile/osm-carto";

// help to generate map tile 
const generateMapTileUrl = (lat, lon, zoom) => {
   const tileX = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
   const tileY = Math.floor(
       (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)
   );
   return `${mapTileBaseUrl}/${zoom}/${tileX}/${tileY}.png?apiKey=${apiKey}`;
};

// format url with user location
     const routingUrl = `${routingBaseUrl}?waypoints=${encodeURIComponent(startLocation)}|${encodeURIComponent(destination)}&mode=drive&apiKey=${apiKey}`;

     try {
         // call Geoapify routing api
         const response = await fetch(routingUrl, {method: "GET"});

         // api response
         if(!response.ok) {
            throw new ApiError(400, "Failed to fetch routing data");
         }
         const data = await response.json();

         //Call geoapify places api 
         const placesUrl = `${placesBaseUrl}?categories=shelters&filter=distance:${startLocation},10000&apiKey=${apiKey}`;
         const placesResponse = await fetch(placesUrl, {method: "GET"});

         if(!placesResponse) {
            throw new ApiError(400, "Failed to fetch places data");
         }
         const placesData = await placesResponse.json();

         //generate map tiles url 
         const [startLat, startLon] = startLocation.split(",").map(Number);
         const [destLat, destLon] = destination.split(",").map(Number);
         const midpointLat = (startLat + destLat) / 2;
         const midpointLon = (startLon + destLon) / 2;
         const zoomLevel = 15;
         const mapTileUrl = generateMapTileUrl(midpointLat, midpointLon, zoomLevel);
         
         //save location to db
         const locationUpload = await SafeRoute.create([
            startLocation,
            destination,
         ])

         if(!locationUpload) {
            throw new ApiError(400, "Location fetch failed")
         }

         return res
         .status(200)
         .json(new ApiResponse(200, {
            route: data,
            places: placesData.features,
            mapTileUrl: mapTileUrl,
            location: locationUpload,
            }, "Route and location data fetched successfully"))
     } catch (error) {
         throw new ApiError(500, error.message || "Internal Server Error")
     }
    
})

export{
    getSafeRoute
}