// src/App.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [appraisals, setAppraisals] = useState([]);
  const [inputs, setInputs] = useState({});

  // Fetch pending appraisals from the backend
  const fetchAppraisals = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/appraisals`);
      setAppraisals(response.data);
    } catch (error) {
      console.error('Error fetching appraisals:', error);
      alert('Error fetching appraisals.');
    }
  };

  useEffect(() => {
    fetchAppraisals();
  }, []);

  // Handle input changes
  const handleInputChange = (id, field, value) => {
    setInputs({
      ...inputs,
      [id]: {
        ...inputs[id],
        [field]: value,
      },
    });
  };

  // Submit updated appraisal to the backend
  const handleSubmit = async (id) => {
    const input = inputs[id];
    if (!input || !input.appraisalValue || !input.humanDescription) {
      alert('Please fill in both fields before submitting.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/appraisals/${id}`, {
        appraisalValue: input.appraisalValue,
        humanDescription: input.humanDescription,
      });
      alert('Appraisal updated successfully');
      fetchAppraisals(); // Refresh the list
    } catch (error) {
      console.error('Error updating appraisal:', error);
      alert('Error updating appraisal.');
    }
  };

  return (
    <div className="App">
      <h1>Pending Appraisals</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Appraisal Type</th>
            <th>Identifier</th>
            <th>Email</th>
            <th>Category</th>
            <th>Status</th>
            <th>URL</th>
            <th>Current Description</th>
            <th>Human Description</th>
            <th>Appraisal Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appraisals.map((appraisal) => (
            <tr key={appraisal.id}>
              <td>{appraisal.date}</td>
              <td>{appraisal.appraisalType}</td>
              <td>{appraisal.identifier}</td>
              <td>{appraisal.email}</td>
              <td>{appraisal.category}</td>
              <td>{appraisal.status}</td>
              <td>
                <a href={appraisal.url} target="_blank" rel="noopener noreferrer">
                  Edit
                </a>
              </td>
              <td>{appraisal.currentDescription}</td>
              <td>
                <textarea
                  value={inputs[appraisal.id]?.humanDescription || ''}
                  onChange={(e) => handleInputChange(appraisal.id, 'humanDescription', e.target.value)}
                  rows="3"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={inputs[appraisal.id]?.appraisalValue || ''}
                  onChange={(e) => handleInputChange(appraisal.id, 'appraisalValue', e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => handleSubmit(appraisal.id)}>Submit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
