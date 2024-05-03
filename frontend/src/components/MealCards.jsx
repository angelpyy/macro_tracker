import { Card, Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

export function MealCards({ updateMacros }) {
	const [showModal, setShowModal] = useState(false);
	const [macroInput, setMacroInput] = useState({ cal: 0, fat: 0, carb: 0, protein: 0 });
	const [meals, setMeals] = useState([
		{ id: 1, title: 'Meal 1' },
		{ id: 2, title: 'Meal 2' },
	]);


	const addNewMeal = () => {
		const newId = meals[meals.length - 1].id + 1;
		setMeals([...meals, { id: newId, title: `Meal ${newId}` }]);
	};

	const handleMacroChange = (event) => {
    const { name, value } = event.target;
    setMacroInput(prevState => {
        const newValues = {
            ...prevState,
            [name]: value === "" ? 0 : Number(value)
        };

        // Calculate calories based on the updated values
        newValues.cal = (newValues.fat * 9) + (newValues.carb * 4) + (newValues.protein * 4);
        return newValues;
    });
};



	const handleMacroSubmit = () => {
		updateMacros(macroInput);
		setShowModal(false);
	};
	return (
		<Container fluid>
			<Col>
				{meals.map((meal) => (
					<Col key={meal.id} xs={12} md={6} lg={4}>
						<Card className='meal-card'>
							<Card.Body>
								<Card.Title>{meal.title}</Card.Title>
								<Button variant="primary" onClick={() => setShowModal(true)}>Add Food</Button>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Col>

			<Row className="justify-content-start"> {/* New row for the button */}
				<Col xs="auto"> {/* This column will shrink to fit the content */}
					<Button variant="primary" size="sm" className='add-meal-button' onClick={addNewMeal}>Add New Meal</Button>
				</Col>
			</Row>

			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Add Macros</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group>
							<Form.Label>Fats (g)</Form.Label>
							<Form.Control type='number'name="fat" value={macroInput.fat} onChange={handleMacroChange} />
						</Form.Group>
						<Form.Group>
							<Form.Label>Carbs (g)</Form.Label>
							<Form.Control type='number' name="carb" value={macroInput.carb} onChange={handleMacroChange} />
						</Form.Group>
						<Form.Group>
							<Form.Label>Protein (g)</Form.Label>
							<Form.Control type='number' name="protein" value={macroInput.protein} onChange={handleMacroChange} />
						</Form.Group>
						<Form.Group>
							<Form.Label>Calories</Form.Label>
							<Form.Control type='number' name="cal" readOnly value={macroInput.cal} />
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
					<Button variant="primary" onClick={handleMacroSubmit}>Save Changes</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
}

export default MealCards;