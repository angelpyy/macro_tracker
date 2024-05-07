import React, { useState, useEffect } from 'react';
import MealCards from './MealCards';
import'../App.css';
import { Container, Row, Col, Card } from 'react-bootstrap';


function HomePage() {
  // TODO: Implement the food submission form
  // TODO: Fork the react-circular-progress-bar library and modify the Nested component
  const [nestedMacros, setNestedMacros] = useState({ cal: 0, fat: 0, carb: 0, protein: 0 });

  const updateMacros = (newMacros) => {
    setNestedMacros({
      cal: nestedMacros.cal + newMacros.cal,
      fat: nestedMacros.fat + newMacros.fat,
      carb: nestedMacros.carb + newMacros.carb,
      protein: nestedMacros.protein + newMacros.protein,
    });
  };

  return (
    <div className="app">
      <Container fluid>
        <Row>
          <Col> 
            <MealCards updateMacros={updateMacros}/> 
          </Col>
          <Col>
            <Row>
              <Card> I NEED TO PUT A CLANDER HERE </Card>
            </Row>
            <Row>
              <Card>
                <Card.Body>
                  <Card.Title>Calories</Card.Title>
                  <Card.Text> { nestedMacros.cal != null ? nestedMacros.cal : '0' } </Card.Text>
                  <Card.Title>Fats</Card.Title>
                  <Card.Text> { nestedMacros.fat != null ? nestedMacros.fat : '0' } </Card.Text>
                  <Card.Title>Carbs</Card.Title>
                  <Card.Text> { nestedMacros.carb != null ? nestedMacros.carb : '0' } </Card.Text>
                  <Card.Title>Protein</Card.Title>
                  <Card.Text> { nestedMacros.protein != null ? nestedMacros.protein : '0' } </Card.Text>
                </Card.Body>
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

export default HomePage;
