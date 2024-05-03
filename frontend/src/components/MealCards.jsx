import { Card, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import '../App.css';
import "bootstrap/dist/css/bootstrap.min.css";

function MealCards() { 
	const [meals, setMeals] = useState([ 
		{ id: 1, title: 'Meal 1' },
		{ id: 2, title: 'Meal 2' },  
	]);

	const addNewMeal = () => {
		const newId = meals[meals.length - 1].id + 1;
		setMeals([...meals, { id: newId, title: `Meal ${newId}` }]);
	};

	const logFood = () => {
		console.log("Food logged");

		return(
			<Modal>
				<Modal.Dialog>
					?
				</Modal.Dialog>
			</Modal>
		);
	};

    return(
			<Container fluid>
				<Col>
					{meals.map((meal) => (
						<Col key={meal.id} xs={12} md={6} lg={4}>
							<Card className='meal-card'>
								<Card.Body>
									<Card.Title>{meal.title}</Card.Title>
									<Button variant="primary" onClick={logFood} >Add Food</Button>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Col>
				<Row className="justify-content-start" > {/* New row for the button */}
					<Col xs="auto"> {/* This column will shrink to fit the content */}
						<Button variant="primary" size="sm" className='add-meal-button' onClick={addNewMeal}>Add New Meal</Button>
					</Col>
        </Row>
			</Container>
    );
}

export default MealCards;