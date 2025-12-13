import React, { useState, useEffect } from 'react';
import useGeoLocationImproved from '../hooks/useGeoLocationImproved';

export default function CollegeLocationFilter({ onLocationChange, onCollegesFiltered }) {
  const {
    city,
    state,
    country,
    method,
    loading,
    error,
    detectLocationByIP,
    detectLocationByGPS,
    setManualLocation,
    clearLocation,
    availableCities
  } = useGeoLocationImproved();

  const [selectedCity, setSelectedCity] = useState('');
  const [showManualSelector, setShowManualSelector] = useState(false);
  const [filteredColleges, setFilteredColleges] = useState([]);

  // College database with locations
  const COLLEGE_DATABASE = [
    // Mumbai colleges
    { name: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra', type: 'Engineering' },
    { name: 'University of Mumbai', city: 'Mumbai', state: 'Maharashtra', type: 'University' },
    { name: 'KJ Somaiya College', city: 'Mumbai', state: 'Maharashtra', type: 'Arts & Science' },
    { name: 'St. Xavier\'s College', city: 'Mumbai', state: 'Maharashtra', type: 'Arts & Science' },
    { name: 'NMIMS University', city: 'Mumbai', state: 'Maharashtra', type: 'Management' },

    // Delhi colleges
    { name: 'IIT Delhi', city: 'Delhi', state: 'Delhi', type: 'Engineering' },
    { name: 'Delhi University', city: 'Delhi', state: 'Delhi', type: 'University' },
    { name: 'JNU', city: 'Delhi', state: 'Delhi', type: 'University' },
    { name: 'AIIMS Delhi', city: 'Delhi', state: 'Delhi', type: 'Medical' },
    { name: 'IIM Delhi', city: 'Delhi', state: 'Delhi', type: 'Management' },

    // Bangalore colleges
    { name: 'IIT Bangalore', city: 'Bangalore', state: 'Karnataka', type: 'Engineering' },
    { name: 'IISc Bangalore', city: 'Bangalore', state: 'Karnataka', type: 'Research' },
    { name: 'Christ University', city: 'Bangalore', state: 'Karnataka', type: 'University' },
    { name: 'RV College of Engineering', city: 'Bangalore', state: 'Karnataka', type: 'Engineering' },
    { name: 'PES University', city: 'Bangalore', state: 'Karnataka', type: 'Engineering' },

    // Chennai colleges
    { name: 'IIT Madras', city: 'Chennai', state: 'Tamil Nadu', type: 'Engineering' },
    { name: 'Anna University', city: 'Chennai', state: 'Tamil Nadu', type: 'University' },
    { name: 'Loyola College', city: 'Chennai', state: 'Tamil Nadu', type: 'Arts & Science' },
    { name: 'SRM Institute of Science and Technology', city: 'Chennai', state: 'Tamil Nadu', type: 'Engineering' },

    // Pune colleges
    { name: 'IIT Pune', city: 'Pune', state: 'Maharashtra', type: 'Engineering' },
    { name: 'COEP Pune', city: 'Pune', state: 'Maharashtra', type: 'Engineering' },
    { name: 'Symbiosis International University', city: 'Pune', state: 'Maharashtra', type: 'University' },
    { name: 'Fergusson College', city: 'Pune', state: 'Maharashtra', type: 'Arts & Science' },

    // Add more colleges as needed...
  ];

  // Filter colleges based on detected location
  useEffect(() => {
    if (city) {
      const relevantColleges = COLLEGE_DATABASE.filter(college =>
        college.city.toLowerCase() === city.toLowerCase() ||
        college.state.toLowerCase() === state.toLowerCase()
      );

      setFilteredColleges(relevantColleges);
      onLocationChange && onLocationChange({ city, state, country, method });
      onCollegesFiltered && onCollegesFiltered(relevantColleges);
    }
  }, [city, state, country, method]);

  const handleManualCitySelect = (cityName) => {
    setManualLocation(cityName);
    setShowManualSelector(false);
    setSelectedCity('');
  };

  const getLocationStatus = () => {
    if (loading) return 'Detecting location...';
    if (error) return `Location error: ${error}`;
    if (city) return `📍 ${city}, ${state} (${method} detection)`;
    return 'Location not detected';
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#1a1a1a',
      borderRadius: '10px',
      margin: '20px 0',
      border: '1px solid #333'
    }}>
      <h3 style={{ color: '#00FFE4', marginBottom: '15px' }}>
        🎓 College Location Algorithm
      </h3>

      <div style={{ marginBottom: '15px' }}>
        <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '10px' }}>
          <strong>Status:</strong> {getLocationStatus()}
        </p>

        {city && (
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ color: '#fff', marginBottom: '10px' }}>
              📚 Colleges in {city}:
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '10px'
            }}>
              {filteredColleges.slice(0, 6).map((college, index) => (
                <div key={index} style={{
                  backgroundColor: '#2a2a2a',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #444'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#00FFE4', fontSize: '14px' }}>
                    {college.name}
                  </div>
                  <div style={{ color: '#ccc', fontSize: '12px' }}>
                    {college.type}
                  </div>
                </div>
              ))}
            </div>
            {filteredColleges.length > 6 && (
              <p style={{ color: '#888', fontSize: '12px', marginTop: '10px' }}>
                And {filteredColleges.length - 6} more colleges...
              </p>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={detectLocationByIP}
          disabled={loading}
          style={{
            backgroundColor: '#00FFE4',
            color: '#000',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          🌐 Detect by IP (Private)
        </button>

        <button
          onClick={detectLocationByGPS}
          disabled={loading}
          style={{
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          📍 Use GPS (Precise)
        </button>

        <button
          onClick={() => setShowManualSelector(!showManualSelector)}
          style={{
            backgroundColor: '#ff6b6b',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ✏️ Select Manually
        </button>

        {city && (
          <button
            onClick={clearLocation}
            style={{
              backgroundColor: '#666',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗑️ Clear Location
          </button>
        )}
      </div>

      {showManualSelector && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#2a2a2a',
          borderRadius: '5px'
        }}>
          <h4 style={{ color: '#fff', marginBottom: '10px' }}>Select Your City:</h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '3px'
              }}
            >
              <option value="">Choose a city...</option>
              {availableCities.map(cityName => (
                <option key={cityName} value={cityName}>{cityName}</option>
              ))}
            </select>
            <button
              onClick={() => selectedCity && handleManualCitySelect(selectedCity)}
              disabled={!selectedCity}
              style={{
                backgroundColor: '#00FFE4',
                color: '#000',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '3px',
                cursor: selectedCity ? 'pointer' : 'not-allowed'
              }}
            >
              Select
            </button>
          </div>
        </div>
      )}

      <div style={{
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#fff3cd',
        borderRadius: '3px',
        border: '1px solid #ffeaa7'
      }}>
        <p style={{ color: '#856404', fontSize: '12px', margin: 0 }}>
          <strong>Privacy Note:</strong> Location data is stored locally on your device only.
          We never send your location to our servers. IP detection is approximate and GPS requires your permission.
        </p>
      </div>
    </div>
  );
}