import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const TargetModal = ({ show, handleClose, handleSubmit, currentTargets }) => {
  const [targets, setTargets] = useState(currentTargets);

  useEffect(() => {
    setTargets(currentTargets);
  }, [currentTargets]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTargets({ ...targets, [name]: Number(value) });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Macro Targets</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Calories</Form.Label>
            <Form.Control
              type="number"
              name="calories"
              value={targets.calories}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Protein (g)</Form.Label>
            <Form.Control
              type="number"
              name="protein"
              value={targets.protein}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Carbs (g)</Form.Label>
            <Form.Control
              type="number"
              name="carbs"
              value={targets.carbs}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fat (g)</Form.Label>
            <Form.Control
              type="number"
              name="fat"
              value={targets.fat}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleSubmit(targets)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TargetModal;