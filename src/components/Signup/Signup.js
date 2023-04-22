// require("dotenv").config();
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "./Signup.css";
import env from "react-dotenv";

const Signup = ({ changeRoute, loadUser }) => {
  const { SERVER_URL } = env;
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const handleNameChange = (e) => {
    const { value } = e.target;
    setNameInput(value);
  };
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmailInput(value);
  };
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPasswordInput(value);
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    if (!/.{3,}\@.{2,}\..{2,}/.test(emailInput)) {
      alert("invalid email");
      return false;
    }
    fetch(SERVER_URL + "/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
        name: nameInput,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== "invalid") {
          changeRoute("home");
          loadUser(data.id);
        } else {
          alert("user already exist");
        }
      })
      .catch((err) => console.log(err));

    return false;
  };
  return (
    <div className="Signup-wrapper">
      <div className="Signup-content">
        <h2 className="title">Sign Up</h2>
        <div className="Signup-form shadow-2">
          <form action="/" method="POST" onSubmit={handleSignUp}>
            <TextField
              label="Name"
              variant="outlined"
              className="form-control"
              fullWidth
              required
              name="name"
              value={nameInput}
              onChange={handleNameChange}
            />
            <TextField
              label="Email"
              variant="outlined"
              className="form-control"
              fullWidth
              required
              name="email"
              type="email"
              value={emailInput}
              onChange={handleEmailChange}
            />
            <TextField
              label="Password"
              variant="outlined"
              className="form-control"
              fullWidth
              type="password"
              autoComplete={"false"}
              required
              name="password"
              value={passwordInput}
              onChange={handlePasswordChange}
            />
            <Button className="Signup-btn" type="submit">
              Sign Up
            </Button>
            <p className="form-text">
              already have an account?{" "}
              <span
                onClick={() => {
                  changeRoute("signin");
                }}
              >
                Sign in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
