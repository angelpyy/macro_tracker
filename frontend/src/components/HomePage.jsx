import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/App.css";
import FoodModal from "./FoodModal";
import TargetModal from "./TargetModal";
import { FaPencilAlt } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [date, setDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [macros, setMacros] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [targets, setTargets] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 65,
  });
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [currentFood, setCurrentFood] = useState(null);
  const [editingMealId, setEditingMealId] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [foodList, setFoodList] = useState([]); // This would be fetched from the backend; TODO: implement backend

  const fetchFoodList = async () => {
    try {
      const response = await fetch('/api/foods'); // Will not work currently; TODO: implement backend
      const foods = await response.json();
      setFoodList(foods);
    } catch (error) {
      console.error('Error fetching food list:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!isAuthenticated && !token) {
      console.log("User is not authenticated, redirecting to login page...");
      navigate("/");
    } else {
      loadMealsFromServer();
      loadTargetsFromServer();
      fetchFoodList();
    }
  }, [isAuthenticated, navigate, date]);

  const loadMealsFromServer = async () => {
    try {
      // Set date that we will be looking at for meals.
      console.log("Fetching meals for", date.toISOString());
      const response = await fetch(`/api/getUserMeals?date=${date.toISOString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch meals");
      }

      const mealsData = await response.json();
      setMeals(mealsData);
      // updateMacros(mealsData);
    } catch (error) {
      console.error("Error loading meals:", error);
    }
  };

  const loadTargetsFromServer = async () => {
    try {
      const response = await fetch("/api/targets", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const targetsData = await response.json();
        setTargets(targetsData);
      } else {
        throw new Error("Failed to fetch targets");
      }
    } catch (error) {
      console.error("Error loading targets:", error);
    }
  };

  const addMealtoServer = async (newMeal) => {
    try {
      console.log("SENDING REQUEST: ", JSON.stringify({ date: date.toISOString(), meal: newMeal }));
      const response = await fetch("/api/addMeal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ date: date.toISOString(), meal: newMeal }),
      });


      if (!response.ok) {
        throw new Error("Failed to save meals");
      }
    } catch (error) {
      console.error("Error saving meals:", error);
    }
  };

  const saveTargetsToServer = async (updatedTargets) => {
    try {
      const response = await fetch("/api/targets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedTargets),
      });
      if (!response.ok) {
        throw new Error("Failed to save targets");
      }
      const savedTargets = await response.json();
      setTargets(savedTargets)
    } catch (error) {
      console.error("Error saving targets:", error);
    }
  };

  const addNewMeal = () => {
    // Create a new meal with a default name and no foods
    const newMeal = {
      name: `Meal ${meals.length + 1}`,
      foods: [ ],
    };

    // Use the spread operator to create a new array with the new meal added
    const updatedMeals = [...meals, newMeal];

    // Update the meals state with the new data and save to the server
    setMeals(updatedMeals);
    addMealtoServer(newMeal);
  };

  // open the food modal with the selected meal and food to allow editing
  const openFoodModal = (mealId, food = null) => {
    setCurrentMeal(mealId);
    setCurrentFood(food);
    setShowFoodModal(true);
  };

  const handleFoodSubmit = async (foodData) => {
    try {
      // another womp womp
    } catch (error) {
      console.error(`Error ${currentFood ? 'updating' : 'adding'} food in meal:`, error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const updateMacros = (updatedMeals) => {
    // certified womp womp
  }

  const handleTargetSubmit = (newTargets) => {
    setTargets(newTargets);
    saveTargetsToServer(newTargets);
    setShowTargetModal(false);
  };

  const handleMealNameUpdate = async (mealId, newName) => {
    console.log(`/api/meals/${mealId}`)
    try {
      const response = await fetch(`/api/meals/${mealId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        const updatedMeals = meals.map((meal) =>
          meal._id === mealId ? { ...meal, name: newName } : meal
        );

        console.log('~~ [Homepage.jsx/handleMealNameUpdate] ~~ || meal name has been updated: ', updatedMeals);
        setMeals(updatedMeals);
        setEditingMealId(null);
      } else {
        console.error("Failed to update meal name");
      }
    } catch (error) {
      console.error("Error updating meal name:", error);
    }
  };

  const MacroProgressBar = ({ value, maxValue, color }) => (
    <CircularProgressbar
      value={(value / maxValue) * 100}
      text={`${value}/${maxValue}`}
      styles={buildStyles({
        textSize: "16px",
        pathColor: color,
        textColor: "#333",
      })}
    />
  );

  return (
    <Container fluid>
      <Row className="mt-4">
        <Col md={8}>
          <h2>
            Meals for {date.toDateString()} -{" "}
            {user ? user.username : "Loading..."}
          </h2>
          {meals.map((meal) => (
            <Card key={meal._id} className="mb-3">
              <Card.Header>
                {editingMealId === meal._id ? (
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleMealNameUpdate(meal._id, e.target.mealName.value);
                    }}
                  >
                    <Form.Group className="d-flex">
                      <Form.Control
                        type="text"
                        name="mealName"
                        defaultValue={meal.name}
                        autoFocus
                      />
                      <Button
                        type="submit"
                        variant="success"
                        size="sm"
                        className="ms-2"
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="ms-2"
                        onClick={() => setEditingMealId(null)}
                      >
                        Cancel
                      </Button>
                    </Form.Group>
                  </Form>
                ) : (
                  <>
                    {meal.name}
                    <Button
                      variant="link"
                      onClick={() => setEditingMealId(meal._id)}
                    >
                      <FaPencilAlt />
                    </Button>
                  </>
                )}
              </Card.Header>
              <Card.Body>
                <ul>
                  {meal.foods.map((foodItem) => (
                    <li key={foodItem._id}>
                      {foodItem.food.name} - {foodItem.food.nutrients.calories * foodItem.servings} cal
                      <Button
                        variant="link"
                        onClick={() => openFoodModal(meal.id, food)}
                      >
                        Edit
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button onClick={() => openFoodModal(meal.id)}>Add Food</Button>
              </Card.Body>
            </Card>
          ))}
          <Button onClick={addNewMeal}>Add Meal</Button>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Calendar onChange={setDate} value={date} />
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <h3>Daily Progress</h3>
              <Row>
                <Col xs={6} className="mb-3">
                  <MacroProgressBar
                    value={macros.calories}
                    maxValue={targets.calories}
                    color="#FF9F1C"
                  />
                  <p className="text-center mt-2">Calories</p>
                </Col>
                <Col xs={6} className="mb-3">
                  <MacroProgressBar
                    value={macros.protein}
                    maxValue={targets.protein}
                    color="#2EC4B6"
                  />
                  <p className="text-center mt-2">Protein</p>
                </Col>
                <Col xs={6}>
                  <MacroProgressBar
                    value={macros.carbs}
                    maxValue={targets.carbs}
                    color="#E71D36"
                  />
                  <p className="text-center mt-2">Carbs</p>
                </Col>
                <Col xs={6}>
                  <MacroProgressBar
                    value={macros.fats}
                    maxValue={targets.fats}
                    color="#011627"
                  />
                  <p className="text-center mt-2">Fats</p>
                </Col>
              </Row>
              <Button onClick={() => setShowTargetModal(true)} className="mt-3">
                Edit Targets
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <FoodModal
        show={showFoodModal}
        handleClose={() => setShowFoodModal(false)}
        handleSubmit={handleFoodSubmit}
        food={currentFood}
        foodList={foodList}
      />
      <TargetModal
        show={showTargetModal}
        handleClose={() => setShowTargetModal(false)}
        handleSubmit={handleTargetSubmit}
        currentTargets={targets}
      />
    </Container>
  );
};

export default HomePage;
