// require("dotenv").config();
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "./Signin.css";
import env from "react-dotenv";

const Signin = ({ changeRoute, loadUser }) => {
  const { SERVER_URL } = env;
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const handleChangeEmail = (e) => {
    const value = e.target.value;
    setEmailInput(value);
  };
  const handleChangePassword = (e) => {
    const value = e.target.value;
    setPasswordInput(value);
  };
  const handleSignIn = (e) => {
    e.preventDefault();
    if (!/.{3,}\@.{2,}\..{2,}/.test(emailInput)) {
      alert("invalid email");
      return false;
    }
    fetch(SERVER_URL + "/signin", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== "invalid") {
          changeRoute("home");
          loadUser(data.id);
        } else {
          setPasswordInput("");
          alert("invalid Email or Password");
        }
      })
      .catch((err) => console.log(err));
    return false;
  };
  return (
    <div className="Signin-wrapper">
      <div className="Signin-content">
        <h2 className="title">Sign In</h2>
        <div className="Signin-form shadow-2">
          <form action="/" method="POST" onSubmit={handleSignIn}>
            <TextField
              label="Email"
              variant="outlined"
              className="form-control"
              fullWidth
              name="email"
              required
              value={emailInput}
              onChange={handleChangeEmail}
            />
            <TextField
              label="Password"
              variant="outlined"
              className="form-control"
              fullWidth
              type="password"
              autoComplete={"false"}
              name="password"
              required
              value={passwordInput}
              onChange={handleChangePassword}
            />
            <Button className="signin-btn" type="submit">
              Sign in
            </Button>
            <p className="form-text">
              don't have an account?{" "}
              <span
                onClick={() => {
                  changeRoute("signup");
                }}
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
