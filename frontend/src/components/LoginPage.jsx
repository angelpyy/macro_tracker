import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

export var token = "";

function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [showAlert, setShowAlert] = useState(false);

	const navigate = useNavigate();

	const loginHandler = async (event) => {
    	event.preventDefault(); // prevent the default form submission behavior

    	const data = { username, password }; // create a JSON object with the username and password.

		// Validate inputs
		if (username.trim() === "") {
			setUsernameError("Username is required.");
			return;
		}
		if (username.includes(" ")) {
		setUsernameError("Username cannot contain spaces.");
		return;
		}
		if (password.trim() === "") {
		setPasswordError("Password is required.");
		return;
		}
		if (password.includes(" ")) {
		setPasswordError("Password cannot contain spaces.");
		return;
		}

		try {
			const response = await fetch("/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const responseData = await response.json();
			console.log(responseData); // log the response data to the console in the browser.
			token = responseData.token;
			navigate("/");
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const registerHandler = async (event) => {
    	event.preventDefault(); // prevent the default form submission behavior

    	const data = { username, password }; // create a JSON object with the username and password.

    	// Validate inputs
		if (username.trim() === "") {
			setUsernameError("Username is required.");
			return;
		}
		if (username.includes(" ")) {
			setUsernameError("Username cannot contain spaces.");
			return;
		}
		if (password.trim() === "") {
			setPasswordError("Password is required.");
			return;
		}
		if (password.includes(" ")) {
			setPasswordError("Password cannot contain spaces.");
			return;
		}

		try {
			const response = await fetch("/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				setShowAlert(true);
				throw new Error("Network response was not ok");
			}

			const responseData = await response.json();
			console.log(responseData); // log the response data to the console in the browser.
			token = responseData.token;
			navigate("/");
		} catch (error) {
			console.error("Error:", error);
		}
	};

	//use state handlers to keep data entered fresh and correct
	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
		setUsernameError("");
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
		setPasswordError("");
	};

	return (
		<div className="login_container">
		{" "}
		<div className="loginForm_wrapper">
			<Form>
			<Form.Group className="mb-3" controlId="username">
				<Form.Label>Username:</Form.Label>
				<Form.Control
					type="text"
					placeholder="Enter Username"
					value={username}
					onChange={handleUsernameChange}
					isInvalid={usernameError}
					required
				/>
				<Form.Control.Feedback type="invalid">
					{usernameError}
				</Form.Control.Feedback>
			</Form.Group>

			<Form.Group className="mb-3" controlId="password">
				<Form.Label>Password</Form.Label>
				<Form.Control
					type="password"
					placeholder="Enter Password"
					value={password}
					onChange={handlePasswordChange}
					isInvalid={passwordError}
					required
				/>
				<Form.Control.Feedback type="invalid">
					{passwordError}
				</Form.Control.Feedback>
			</Form.Group>
			<div className="buttons">
				<Button variant="primary" type="submit" onClick={loginHandler}>
					Login
				</Button>
				<Button variant="danger" type="button" onClick={registerHandler}>
					Register
				</Button>
			</div>
			</Form>
		</div>
		</div>
	);
}

export default LoginPage;