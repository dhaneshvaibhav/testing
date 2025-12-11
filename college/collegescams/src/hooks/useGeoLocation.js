import { useState, useEffect } from "react";

export default function useGeoLocation() {
    const [location, setLocation] = useState({
        city: null,
        state: null,
        loading: false,
        error: null,
    });

    const fetchLocation = () => {
        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, error: "Geolocation not supported" }));
            return;
        }

        setLocation(prev => ({ ...prev, loading: true }));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Use OpenStreetMap Nominatim API (Free, requires User-Agent)
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();

                    const address = data.address || {};
                    const city = address.city || address.town || address.village || address.county;
                    const state = address.state;

                    setLocation({
                        city,
                        state,
                        loading: false,
                        error: null
                    });

                    // Save to local storage for persistence
                    localStorage.setItem("user_location", JSON.stringify({ city, state }));

                } catch (err) {
                    console.error("Geocoding failed", err);
                    setLocation(prev => ({ ...prev, loading: false, error: "Failed to detect location" }));
                }
            },
            (error) => {
                setLocation(prev => ({ ...prev, loading: false, error: "Permission denied or unavailable" }));
            }
        );
    };

    // Auto-load from storage on mount
    useEffect(() => {
        const stored = localStorage.getItem("user_location");
        if (stored) {
            try {
                const { city, state } = JSON.parse(stored);
                setLocation({ city, state, loading: false, error: null });
            } catch (e) { }
        }
    }, []);

    return { ...location, detectLocation: fetchLocation };
}
