import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const FoodModal = ({ show, handleClose, handleSubmit, food, foodList }) => {
  const [foodData, setFoodData] = useState(
    food || { name: "", calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  useEffect(() => {
    setFoodData(
      food || { name: "", calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  }, [food]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodData({
      ...foodData,
      // if name (of field being edited) is 'name', set value as is value, else convert value to number
      [name]: name === 'name' ? value : (value === '' ? '' : Number(value)),
    });
  };

  // TODO: modify to handle controlled component for food selection
  const handleFoodSelect = (e) => {
    const selectedFood = foodList.find((f) => f.name === e.target.value);
    if (selectedFood) {
      setFoodData(selectedFood);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{food ? "Edit Food" : "Add Food"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Select Food</Form.Label>
            <Form.Control as="select" onChange={handleFoodSelect}>
              <option value="">Custom Food</option>
              {foodList.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={foodData.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Calories</Form.Label>
            <Form.Control
              type="number"
              name="calories"
              value={foodData.calories}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Protein (g)</Form.Label>
            <Form.Control
              type="number"
              name="protein"
              value={foodData.protein}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Carbs (g)</Form.Label>
            <Form.Control
              type="number"
              name="carbs"
              value={foodData.carbs}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fat (g)</Form.Label>
            <Form.Control
              type="number"
              name="fats"
              value={foodData.fats}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleSubmit(foodData)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FoodModal;