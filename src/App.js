import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    cityCounty: '', 
    population: '', 
    currentCompost: {volume: '', cost: ''},
    currentMulch: {volume: '', cost: ''},
    currentRNG: {volume: '', cost: ''},
    currentBiomass: {volume: '', cost: ''},
    currentOther: {volume: '', cost: ''},
  });

  const handleNext = () => {
    if (activeTab < 3) setActiveTab(activeTab + 1);
  };

  const handleBack = () => {
    if (activeTab > 1) setActiveTab(activeTab - 1);
  };

  const handleChange = (e) => {
    console.log('Change event triggered for:', e.target.name, 'with value:', e.target.value);
    const { name, value } = e.target;
    if (['volume', 'cost'].includes(name)) {
      const [prefix, type] = name.split('-');
      setFormData(prev => {
        const newState = {
          ...prev,
          [prefix]: {...prev[prefix], [type]: value}
        };
        console.log('New state for', name, ':', newState);
        return newState;
      });
    } else {
      setFormData(prev => {
        const newState = {...prev, [name]: value};
        console.log('New state for', name, ':', newState);
        return newState;
      });
    }
  };

  const validatePopulation = (value) => {
    return Number.isInteger(Number(value)) && Number(value) > 0;
  };

  return (
    <div className="App">
      <img src="/logo.png" alt="Logo" style={{ width: '100px', margin: '20px auto', display: 'block' }} />
      <h1>Valinor Energy</h1>
      <div className="background-div">
        <div className="card">
          <h2>SB 1383 Compliance Calculator</h2>
          <div className="tabs">
            <button className={activeTab === 1 ? 'active' : ''}>City/County</button>
            <button className={activeTab === 2 ? 'active' : ''}>Details</button>
            <button className={activeTab === 3 ? 'active' : ''}>Review</button>
          </div>

          <div className="tab-content">
            {activeTab === 1 && (
              <form>
                <h3>Jurisdiction Information</h3>
                <input 
                  type="text" 
                  name="cityCounty" 
                  value={formData.cityCounty} 
                  onChange={handleChange} 
                  placeholder="City/County" 
                />
                <input 
                  type="text" 
                  name="population" 
                  value={formData.population} 
                  onChange={handleChange} 
                  placeholder="Population" 
                  style={{ borderColor: formData.population && !validatePopulation(formData.population) ? 'red' : '' }}
                />
                <button type="button" onClick={handleNext} disabled={!validatePopulation(formData.population)}>Next</button>
              </form>
            )}
          {activeTab === 2 && (
            <form>
              <div className="city-county-info">
                <h4>City/County: {formData.cityCounty}</h4>
                <h4>Population: {formData.population ? parseInt(formData.population).toLocaleString() : ''}</h4>
                <h3>SB 1383 ROWP Procurement Requirement</h3>
                <p>Note: SB1383 requirement is .08 tons per person</p>
                <div className="calculation-table">
                  <div className="table-header">
                    <div>2024</div>
                    <div>2025 and beyond</div>
                  </div>
                  <div className="table-row">
                    <div>{(formData.population * 0.8 * 0.65).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    <div>{(formData.population * 0.8).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                  </div>
                </div>
              </div>
              <h2>Procurement Details</h2>
              {['Compost', 'Mulch', 'RNG', 'Biomass', 'Other'].map(item => (
                <div key={item} className="procurement-item">
                  <h3>Current Procurement of {item}</h3>
                  <div className="input-group">
                    <input 
                      type="text" 
                      name={`current${item}-volume`} 
                      value={formData[`current${item}`].volume} 
                      onChange={handleChange} 
                      placeholder={`Volume of ${item}`} 
                    />
                    <select 
                    name={`current${item}-unit`}
                    value={formData[`current${item}`]?.unit || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Unit</option>
                    {['tons', 'cubic yards', 'ton', 'DGE', 'kWh', 'therms'].map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                    <input 
                      type="text" 
                      name={`current${item}-cost`} 
                      value={formData[`current${item}`].cost} 
                      onChange={handleChange} 
                      placeholder={`Current Cost of ${item}`} 
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={handleBack}>Back</button>
              <button type="button" onClick={handleNext}>Next</button>
            </form>
          )}

        {activeTab === 3 && (
          <div>
            <h2>Review</h2>
            <p>City/County: {formData.cityCounty}</p>
            <p>Population: {formData.population}</p>
            {Object.entries(formData).filter(([key]) => key.startsWith('current')).map(([key, value]) => {
              if (key !== 'cityCounty' && key !== 'population') {
                return (
                  <div key={key}>
                    <p>{key.replace('current', '').replace(/([A-Z])/g, ' $1').trim()}:</p>
                    <p>Volume: {value.volume}</p>
                    <p>Cost: {value.cost}</p>
                  </div>
                );
              }
              return null;
            })}
            <button type="button" onClick={handleBack}>Back</button>
            <button type="submit" className="cta-button">Submit</button>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  );
}

export default App;