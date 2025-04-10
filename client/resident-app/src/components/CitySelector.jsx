import React from 'react';

const CitySelector = ({ selectedCity, onChange }) => {
  const cities = ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'];

  return (
    <div className="city-selector">
      <label htmlFor="city-select">Select City: </label>
      <select 
        id="city-select"
        value={selectedCity}
        onChange={(e) => onChange(e.target.value)}
      >
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </div>
  );
};

export default CitySelector;