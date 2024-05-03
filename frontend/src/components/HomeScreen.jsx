import React, { useState, useEffect } from 'react';
import {Nested} from '@alptugidin/react-circular-progress-bar'
import MacroNavbar from './Navbar';
import MealCards from './MealCards';
import'../App.css';
import { Container, Row, Col, Card } from 'react-bootstrap';


function HomeScreen() {
  // TODO: Implement the food submission form
  // TODO: Fork the react-circular-progress-bar library and modify the Nested component
  const [nestedMacros, setNestedMacros] = useState({ cal: 0, fats: 0, carbs: 0, protein: 0});

  // comment
  const handleFoodSubmission = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
  };

  const handleChange = (event) => {
    // No action is required here
  };

  return (
    <div className="app">
      <Container fluid>
        <Row>
          <MacroNavbar /> 
        </Row>
        <Row>
          <Col> <MealCards /> </Col>
          <Col>
          <Row>
            <Card> I NEED TO PUT A CLANDER HERE </Card>
          </Row>
          <Row>
            <Card>
              <Nested className='gauges' 
                circles={[
                  {text: 'Calories', value: nestedMacros.cal, color: '#f2f1ae'},
                  {text: 'Fats', value: nestedMacros.fats, color: '#d5e6c5'},
                  {text: 'Carbs', value: nestedMacros.carbs, color: '#ebd0b7'},
                  {text: 'Protein', value: nestedMacros.protein, color: '#bfd0d9'},
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
            </Card>
          </Row>
            
          </Col>
        </Row>
        <Row className='justified-content-center'>
          <Col>bruh</Col>
          <Col>bruhh</Col>
          <Col>bruhhh</Col>
        </Row>
      </Container>
    </div>
  )
}

export default HomeScreen;
