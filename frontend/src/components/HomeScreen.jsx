import React, { useState, useEffect } from 'react';
import { food } from './Food';
import {Nested} from '@alptugidin/react-circular-progress-bar'

function HomeScreen() {
  // TODO: Implement the food submission form
  // TODO: Fork the react-circular-progress-bar library and modify the Nested component
  const [randomNestedValue, setRandomNestedValue] = useState({ v1: 0, v2: 0, v3: 0, v4: 0});
  useEffect(() => {
  setRandomNestedValue({
    v1: Math.floor(Math.random() * 100),
    v2: Math.floor(Math.random() * 100),
    v3: Math.floor(Math.random() * 100),
    v4: Math.floor(Math.random() * 100),
    });
  }, []);

  const handleFoodSubmission = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
  };

  const handleChange = (event) => {
    // No action is required here
  };


  return (
  <div className="app">
    <h1>this is me when i macros</h1>
    <div className="gauges">
      <Nested 
        circles={[
          {text: 'Calories', value: randomNestedValue.v1, color: '#f2f1ae'},
          {text: 'Fats', value: randomNestedValue.v2, color: '#d5e6c5'},
          {text: 'Carbs', value: randomNestedValue.v3, color: '#ebd0b7'},
          {text: 'Protein', value: randomNestedValue.v4, color: '#bfd0d9'},
        ]}
        sx={{
          bgColor: '#cbd5e1',
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
          strokeLinecap: 'round',
          loadingTime: 1000,
          valueAnimation: true,
        }}
      />
    </div>
  </div>
  );
}

export default HomeScreen;
