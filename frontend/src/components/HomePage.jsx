import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/App.css';
import { useNavigate } from 'react-router-dom';
import FoodModal from './FoodModal';
import TargetModal from './TargetModal';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const [date, setDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [macros, setMacros] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [targets, setTargets] = useState({ calories: 2000, protein: 150, carbs: 250, fat: 65 });
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [currentFood, setCurrentFood] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
   // const [foodList, setFoodList] = useState([]); // This would be fetched from the backend; TODO: implement backend

  // temporary placeholder for food list
  const foodList = [
    { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
    { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
    { name: 'Orange', calories: 62, protein: 1.2, carbs: 15, fat: 0.2 },
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.6 },
  ];

  // const fetchFoodList = async () => {
  //   try {
  //     const response = await fetch('/api/foods'); // Will not work currently; TODO: implement backend
  //     const foods = await response.json();
  //     setFoodList(foods);
  //   } catch (error) {
  //     console.error('Error fetching food list:', error);
  //   }
  // };
  
  useEffect(() => { 
    if (!isAuthenticated) { 
      console.log('User is not authenticated, redirecting to login page...');
      navigate('/');
    } else {
      loadMealsFromServer();
      loadTargetsFromServer();
    }
  }, [isAuthenticated, navigate, date]); 

  const loadMealsFromServer = async () => {
    try {
      const response = await fetch(`/api/meals?date=${date.toISOString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('response:', response);
      if (response.ok) {
        const mealsData = await response.json();
        setMeals(mealsData);
        updateMacros(mealsData);
      } else {
        throw new Error('Failed to fetch meals');
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const loadTargetsFromServer = async () => {
    try {
      const response = await fetch('/api/targets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const targetsData = await response.json();
        setTargets(targetsData);
      } else {
        throw new Error('Failed to fetch targets');
      }
    } catch (error) {
      console.error('Error loading targets:', error);
    }
  };

  const saveMealsToServer = async (updatedMeals) => {
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ date: date.toISOString(), meals: updatedMeals })
      });
      if (!response.ok) {
        throw new Error('Failed to save meals');
      }
    } catch (error) {
      console.error('Error saving meals:', error);
    }
  };

  const saveTargetsToServer = async (updatedTargets) => {
    try {
      const response = await fetch('/api/targets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedTargets)
      });
      if (!response.ok) {
        throw new Error('Failed to save targets');
      }
    } catch (error) {
      console.error('Error saving targets:', error);
    }
  };

  const loadMealsFromLocalStorage = () => {
    const storedMeals = localStorage.getItem(`meals_${date.toDateString()}`);
    if (storedMeals) {
      setMeals(JSON.parse(storedMeals));
      updateMacros(JSON.parse(storedMeals));
    } else {
      setMeals([
        { id: 1, name: 'Breakfast', foods: [] },
        { id: 2, name: 'Lunch', foods: [] },
      ]);
      setMacros({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    }
  };

  const loadTargetsFromLocalStorage = () => {
    const storedTargets = localStorage.getItem('macroTargets');
    if (storedTargets) {
      setTargets(JSON.parse(storedTargets));
    }
  };

  const saveMealsToLocalStorage = (updatedMeals) => {
    localStorage.setItem(`meals_${date.toDateString()}`, JSON.stringify(updatedMeals));
  };

  const saveTargetsToLocalStorage = (updatedTargets) => {
    localStorage.setItem('macroTargets', JSON.stringify(updatedTargets));
  }

  const addMeal = () => {
    const newMeal = {
      id: meals.length + 1,
      name: `Meal ${meals.length + 1}`,
      foods: [],
    };
    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);
    saveMealsToServer(updatedMeals);
  };

  // open the food modal with the selected meal and food to allow editing
  const openFoodModal = (mealId, food = null) => {
    setCurrentMeal(mealId);
    setCurrentFood(food);
    setShowFoodModal(true);
  };

  const handleFoodSubmit = (foodData) => {
    let updatedMeals;
    if (currentFood) {
      // we are editing an existing food
      updatedMeals = meals.map(meal => {
        if (meal.id === currentMeal) {
          const updatedFoods = meal.foods.map(food => 
            food === currentFood ? { ...food, ...foodData } : food
          );
          return { ...meal, foods: updatedFoods };
        }
        return meal;
      });
    } else {
      // we are instead adding food yayyy
      updatedMeals = meals.map(meal => {
        if (meal.id === currentMeal) {
          return { ...meal, foods: [...meal.foods, foodData] };
        }
        return meal;
      });
    }
    setMeals(updatedMeals);
    saveMealsToServer(updatedMeals);
    updateMacros(updatedMeals);
    setShowFoodModal(false);
  };

  const updateMacros = (updatedMeals) => {
    const newMacros = updatedMeals.reduce((acc, meal) => {
      meal.foods.forEach(food => {
        acc.calories += food.calories || 0;
        acc.protein += food.protein || 0;
        acc.carbs += food.carbs || 0;
        acc.fat += food.fat || 0;
      });
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    setMacros(newMacros);
  }

  const handleTargetSubmit = (newTargets) => {
    setTargets(newTargets);
    saveTargetsToServer(newTargets);
    setShowTargetModal(false);
  }

  const MacroProgressBar = ({ value, maxValue, color }) => (
    <CircularProgressbar
      value={(value / maxValue) * 100}
      text={`${value}/${maxValue}`}
      styles={buildStyles({
        textSize: '16px',
        pathColor: color,
        textColor: '#333',
      })}
    />
  );

  return (
    <Container fluid>
      <Row className="mt-4">
        <Col md={8}>
          <h2>Meals for {date.toDateString()} - {user ? user.username : 'Loading...'}</h2>
          {meals.map(meal => (
            <Card key={meal.id} className="mb-3">
              <Card.Header>{meal.name}</Card.Header>
              <Card.Body>
                <ul>
                  {meal.foods.map((food, index) => (
                    <li key={index}>
                      {food.name} - {food.calories} cal
                      <Button variant="link" onClick={() => openFoodModal(meal.id, food)}>Edit</Button>
                    </li>
                  ))}
                </ul>
                <Button onClick={() => openFoodModal(meal.id)}>Add Food</Button>
              </Card.Body>
            </Card>
          ))}
          <Button onClick={addMeal}>Add Meal</Button>
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
                  <MacroProgressBar value={macros.calories} maxValue={targets.calories} color="#FF9F1C" />
                  <p className="text-center mt-2">Calories</p>
                </Col>
                <Col xs={6} className="mb-3">
                  <MacroProgressBar value={macros.protein} maxValue={targets.protein} color="#2EC4B6" />
                  <p className="text-center mt-2">Protein</p>
                </Col>
                <Col xs={6}>
                  <MacroProgressBar value={macros.carbs} maxValue={targets.carbs} color="#E71D36" />
                  <p className="text-center mt-2">Carbs</p>
                </Col>
                <Col xs={6}>
                  <MacroProgressBar value={macros.fat} maxValue={targets.fat} color="#011627" />
                  <p className="text-center mt-2">Fat</p>
                </Col>
              </Row>
              <Button onClick={() => setShowTargetModal(true)} className="mt-3">Edit Targets</Button>
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