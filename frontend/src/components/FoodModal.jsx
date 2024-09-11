import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const FoodModal = ({ show, handleClose, handleSubmit, food, foodList }) => {
  const initialFoodData = {
    _id: "",
    name: "",
    brand: "Generic",
    servingSize: { value: 100, unit: "g" },
    nutrients: { calories: 0, protein: 0, carbs: 0, fats: 0 },
    servings: 1
  }
  const [showDebug, setShowDebug] = useState(false);
  const [foodData, setFoodData] = useState( food ? {
    ...food.food, // spread the food object to get the nested properties
    servings: food.servings // add the servings property
  } : initialFoodData );

  useEffect(() => {
    setFoodData( food || initialFoodData );
  }, [food]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFoodData(prevData => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value === '' ? '' : (child === 'unit' ? value : Number(value))
        }
      }));
    } else if (name === 'servings') {
      setFoodData(prevData => ({ 
        ... prevData,
        servings: value === '' ? '' : Number(value)
      }));
    } else {
      setFoodData(prevData => ({
        ...prevData,
        [name]: name === 'name' || name === 'brand' ? value : (value === '' ? '' : Number(value))
      }));
    }
  };

  // TODO: modify to handle controlled component for food selection
  const handleFoodSelect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "") {
      // Reset to initial values when "Custom Food" is selected
      setFoodData(initialFoodData);
    } else {
      const selectedFood = foodList.find((f) => f.name === selectedValue);
      if (selectedFood) {
        setFoodData({ ...selectedFood, servings: 1 });
      }
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
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              name="brand"
              value={foodData.brand}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Serving Size</Form.Label>
                <Form.Control
                  type="number"
                  name="servingSize.value"
                  value={foodData.servingSize.value}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Unit</Form.Label>
                <Form.Control
                  as="select"
                  name="servingSize.unit"
                  value={foodData.servingSize.unit}
                  onChange={handleInputChange}
                >
                  {["g", "oz", "ml", "fl oz", "cup", "tbsp", "tsp", "mL", "L", "pieces", "servings", "slices"].map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>Servings</Form.Label>
            <Form.Control
              type="number"
              name="servings"
              value={foodData.servings}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Calories</Form.Label>
            <Form.Control
              type="number"
              name="nutrients.calories"
              value={foodData.nutrients.calories}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Protein (g)</Form.Label>
            <Form.Control
              type="number"
              name="nutrients.protein"
              value={foodData.nutrients.protein}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Carbs (g)</Form.Label>
            <Form.Control
              type="number"
              name="nutrients.carbs"
              value={foodData.nutrients.carbs}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fat (g)</Form.Label>
            <Form.Control
              type="number"
              name="nutrients.fats"
              value={foodData.nutrients.fats}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Form.Check
          type="checkbox"
          label="Show Debug"
          checked={showDebug}
          onChange={(e) => setShowDebug(e.target.checked)}
        />
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleSubmit(foodData)}>
          Save Changes
        </Button>
      </Modal.Footer>
      {showDebug && (
        <pre className="mt-3 p-3 bg-light">
          {JSON.stringify(foodData, null, 2)}
        </pre>
      )}
    </Modal>
  );
};

export default FoodModal;