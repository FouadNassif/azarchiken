import restaurantJson from "./json/restaurant.json";

// The actual data lives in ./json/restaurant.json — this file just re-exports
// it with a stable name. Edit the JSON file directly, or use the /admin panel.
export const restaurantConfig = restaurantJson;
