import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

export let token = "";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const { username, password } = formData;

    if (username.trim() === "") {
      newErrors.username = "Username is required.";
    } else if (username.includes(" ")) {
      newErrors.username = "Username cannot contain spaces.";
    }

    if (password.trim() === "") {
      newErrors.password = "Password is required.";
    } else if (password.includes(" ")) {
      newErrors.password = "Password cannot contain spaces.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setServerError(""); // reset server error message
  };

  // endpoint is either "login" or "register"
  const handleSubmit = async (event, endpoint) => {
    event.preventDefault();

    // break if username and password are not valid
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || `${endpoint} failed!`);
      }

      token = responseData.token;
      localStorage.setItem("token", token);
      navigate("/home");

      // lil debug ts
      console.log(token);
    } catch (error) {
      console.error("Error:", error);
      setServerError(error.message || "An unknown error occurred. Please try again.");
    }
  };

  return (
    <div className="login_container">
      <div className="loginForm_wrapper">
        <Form>
          {["username", "password"].map((field) => (
            <Form.Group key={field} className="mb-3">
              <Form.Label>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Form.Label>
              <Form.Control
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                isInvalid={errors[field]}
              />
              <Form.Control.Feedback type="invalid">
                {errors[field]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
          <div className="buttons">
            <Button
              variant="primary"
              type="submit"
              onClick={(event) => handleSubmit(event, "login")}
            >
              Login
            </Button>
            <Button
              variant="primary"
              type="submit"
              onClick={(event) => handleSubmit(event, "register")}
            >
              Register
            </Button>
          </div>
        </Form>
        {serverError && (
          <Alert
            variant="danger"
            onClose={() => setServerError("")}
            dismissible
          >
            {serverError}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
