import { useState, useEffect } from "react";

// College cities database - expand this with major educational hubs
const COLLEGE_CITIES = {
  // India
  'Mumbai': ['Mumbai', 'Maharashtra'],
  'Delhi': ['Delhi', 'Delhi'],
  'Bangalore': ['Bangalore', 'Karnataka'],
  'Chennai': ['Chennai', 'Tamil Nadu'],
  'Kolkata': ['Kolkata', 'West Bengal'],
  'Hyderabad': ['Hyderabad', 'Telangana'],
  'Pune': ['Pune', 'Maharashtra'],
  'Ahmedabad': ['Ahmedabad', 'Gujarat'],
  'Jaipur': ['Jaipur', 'Rajasthan'],
  'Lucknow': ['Lucknow', 'Uttar Pradesh'],
  'Chandigarh': ['Chandigarh', 'Chandigarh'],
  'Indore': ['Indore', 'Madhya Pradesh'],
  'Bhopal': ['Bhopal', 'Madhya Pradesh'],
  'Nagpur': ['Nagpur', 'Maharashtra'],
  'Vadodara': ['Vadodara', 'Gujarat'],
  'Coimbatore': ['Coimbatore', 'Tamil Nadu'],
  'Kochi': ['Kochi', 'Kerala'],
  'Visakhapatnam': ['Visakhapatnam', 'Andhra Pradesh'],
  'Vijayawada': ['Vijayawada', 'Andhra Pradesh'],
  'Mangalore': ['Mangalore', 'Karnataka'],
  'Mysore': ['Mysore', 'Karnataka'],
  'Thiruvananthapuram': ['Thiruvananthapuram', 'Kerala'],
  'Guwahati': ['Guwahati', 'Assam'],
  'Patna': ['Patna', 'Bihar'],
  'Ranchi': ['Ranchi', 'Jharkhand'],
  'Bhubaneswar': ['Bhubaneswar', 'Odisha'],
  'Raipur': ['Raipur', 'Chhattisgarh'],

  // USA (major college cities)
  'New York': ['New York', 'New York'],
  'Los Angeles': ['Los Angeles', 'California'],
  'Chicago': ['Chicago', 'Illinois'],
  'Boston': ['Boston', 'Massachusetts'],
  'San Francisco': ['San Francisco', 'California'],
  'Seattle': ['Seattle', 'Washington'],
  'Austin': ['Austin', 'Texas'],
  'Denver': ['Denver', 'Colorado'],
  'Atlanta': ['Atlanta', 'Georgia'],
  'Miami': ['Miami', 'Florida'],
  'Philadelphia': ['Philadelphia', 'Pennsylvania'],
  'Washington DC': ['Washington', 'District of Columbia'],
  'San Diego': ['San Diego', 'California'],
  'Portland': ['Portland', 'Oregon'],
  'Nashville': ['Nashville', 'Tennessee'],
  'Salt Lake City': ['Salt Lake City', 'Utah'],
  'Madison': ['Madison', 'Wisconsin'],
  'Ann Arbor': ['Ann Arbor', 'Michigan'],
  'Chapel Hill': ['Chapel Hill', 'North Carolina'],
  'Charlottesville': ['Charlottesville', 'Virginia'],

  // UK
  'London': ['London', 'England'],
  'Manchester': ['Manchester', 'England'],
  'Birmingham': ['Birmingham', 'England'],
  'Edinburgh': ['Edinburgh', 'Scotland'],
  'Glasgow': ['Glasgow', 'Scotland'],
  'Bristol': ['Bristol', 'England'],
  'Leeds': ['Leeds', 'England'],
  'Liverpool': ['Liverpool', 'England'],
  'Newcastle': ['Newcastle', 'England'],
  'Sheffield': ['Sheffield', 'England'],
  'Oxford': ['Oxford', 'England'],
  'Cambridge': ['Cambridge', 'England'],

  // Canada
  'Toronto': ['Toronto', 'Ontario'],
  'Vancouver': ['Vancouver', 'British Columbia'],
  'Montreal': ['Montreal', 'Quebec'],
  'Calgary': ['Calgary', 'Alberta'],
  'Ottawa': ['Ottawa', 'Ontario'],
  'Edmonton': ['Edmonton', 'Alberta'],
  'Winnipeg': ['Winnipeg', 'Manitoba'],
  'Victoria': ['Victoria', 'British Columbia'],

  // Australia
  'Sydney': ['Sydney', 'New South Wales'],
  'Melbourne': ['Melbourne', 'Victoria'],
  'Brisbane': ['Brisbane', 'Queensland'],
  'Perth': ['Perth', 'Western Australia'],
  'Adelaide': ['Adelaide', 'South Australia'],
  'Canberra': ['Canberra', 'Australian Capital Territory'],
  'Hobart': ['Hobart', 'Tasmania'],
  'Darwin': ['Darwin', 'Northern Territory']
};

export default function useGeoLocation() {
    const [location, setLocation] = useState({
        city: null,
        state: null,
        country: null,
        method: null, // 'ip', 'gps', 'manual'
        loading: false,
        error: null,
    });

    // IP-based geolocation (privacy-friendly, no GPS required)
    const detectLocationByIP = async () => {
        try {
            setLocation(prev => ({ ...prev, loading: true }));

            // Use a privacy-focused IP geolocation service
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();

            if (data.error) throw new Error('IP detection failed');

            const detectedCity = data.city;
            const detectedState = data.region;
            const detectedCountry = data.country_name;

            // Check if detected city has colleges
            const hasColleges = COLLEGE_CITIES[detectedCity] ||
                              Object.values(COLLEGE_CITIES).some(([city, state]) =>
                                city.toLowerCase() === detectedCity.toLowerCase() &&
                                state.toLowerCase() === detectedState.toLowerCase()
                              );

            if (hasColleges) {
                setLocation({
                    city: detectedCity,
                    state: detectedState,
                    country: detectedCountry,
                    method: 'ip',
                    loading: false,
                    error: null
                });

                // Save to localStorage (client-side only)
                localStorage.setItem("user_location", JSON.stringify({
                    city: detectedCity,
                    state: detectedState,
                    country: detectedCountry,
                    method: 'ip',
                    timestamp: Date.now()
                }));
            } else {
                // City doesn't have colleges, suggest manual selection
                setLocation(prev => ({
                    ...prev,
                    loading: false,
                    error: `No colleges found in ${detectedCity}. Please select your city manually.`
                }));
            }

        } catch (err) {
            console.error("IP geolocation failed", err);
            setLocation(prev => ({
                ...prev,
                loading: false,
                error: "Could not detect location. Please select manually."
            }));
        }
    };

    // GPS-based detection (more accurate but requires permission)
    const detectLocationByGPS = () => {
        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, error: "Geolocation not supported" }));
            return;
        }

        setLocation(prev => ({ ...prev, loading: true }));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // Use a more privacy-focused reverse geocoding
                    // Option 1: Use a local city database instead of API
                    // Option 2: Use a privacy-first service

                    // For now, use a minimal API call
                    const res = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    const data = await res.json();

                    const detectedCity = data.city || data.locality;
                    const detectedState = data.principalSubdivision;
                    const detectedCountry = data.countryName;

                    if (detectedCity && COLLEGE_CITIES[detectedCity]) {
                        setLocation({
                            city: detectedCity,
                            state: detectedState,
                            country: detectedCountry,
                            method: 'gps',
                            loading: false,
                            error: null
                        });

                        localStorage.setItem("user_location", JSON.stringify({
                            city: detectedCity,
                            state: detectedState,
                            country: detectedCountry,
                            method: 'gps',
                            timestamp: Date.now()
                        }));
                    } else {
                        // Fallback to IP detection
                        await detectLocationByIP();
                    }

                } catch (err) {
                    console.error("GPS geocoding failed", err);
                    // Fallback to IP detection
                    await detectLocationByIP();
                }
            },
            (error) => {
                console.error("GPS permission denied", error);
                // Fallback to IP detection
                detectLocationByIP();
            },
            {
                enableHighAccuracy: false, // Less accurate but faster and more private
                timeout: 10000,
                maximumAge: 300000 // 5 minutes cache
            }
        );
    };

    // Manual city selection
    const setManualLocation = (city, state = null, country = null) => {
        if (COLLEGE_CITIES[city]) {
            const [collegeCity, collegeState] = COLLEGE_CITIES[city];
            setLocation({
                city: collegeCity,
                state: collegeState || state,
                country: country || 'India', // Default assumption
                method: 'manual',
                loading: false,
                error: null
            });

            localStorage.setItem("user_location", JSON.stringify({
                city: collegeCity,
                state: collegeState || state,
                country: country || 'India',
                method: 'manual',
                timestamp: Date.now()
            }));
        } else {
            setLocation(prev => ({
                ...prev,
                error: `${city} is not in our college database. Please choose from available cities.`
            }));
        }
    };

    // Clear location data
    const clearLocation = () => {
        setLocation({
            city: null,
            state: null,
            country: null,
            method: null,
            loading: false,
            error: null
        });
        localStorage.removeItem("user_location");
    };

    // Auto-load from storage on mount
    useEffect(() => {
        const stored = localStorage.getItem("user_location");
        if (stored) {
            try {
                const locationData = JSON.parse(stored);
                // Check if data is recent (within 30 days)
                if (locationData.timestamp && (Date.now() - locationData.timestamp) < 30 * 24 * 60 * 60 * 1000) {
                    setLocation({
                        ...locationData,
                        loading: false,
                        error: null
                    });
                }
            } catch (e) {
                console.error("Failed to parse stored location", e);
            }
        }
    }, []);

    // Get available cities for manual selection
    const getAvailableCities = () => {
        return Object.keys(COLLEGE_CITIES).sort();
    };

    return {
        ...location,
        detectLocationByIP,
        detectLocationByGPS,
        setManualLocation,
        clearLocation,
        getAvailableCities,
        availableCities: getAvailableCities()
    };
}