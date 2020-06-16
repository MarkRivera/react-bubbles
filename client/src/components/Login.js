import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Login.css";
import * as Yup from "yup";
import axios from "axios";

const Login = () => {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const [isEmailFocused, setEmailFocus] = useState(false);
  const [isPasswordFocused, setPasswordFocus] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const history = useHistory();

  // Validation
  const formSchema = Yup.object().shape({
    username: Yup.string().required("Email address is required"),
    password: Yup.string().required("A password is required!"),
  });

  useEffect(() => {
    formSchema.isValid(formState).then((valid) => {
      setButtonDisabled(!valid);
    });
  }, [formSchema, formState]);

  const clearForm = () => {
    setFormState({
      username: "",
      password: "",
    });
  };

  // Event Handlers

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleClick = (e) => {
    axios
      .post("http://localhost:5000/api/login", formState)
      .then((res) => {
        localStorage.setItem("token", res.data.payload);
        history.push("/bubbles");
      })
      .catch((err) => {
        console.log(err);
        clearForm();
      });
  };

  const handleChange = (e) => {
    e.persist();
    Yup.reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then((valid) => {
        setErrors({
          ...errors,
          [e.target.name]: "",
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors[0],
        });
      });

    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleFocus = (e) => {
    switch (e.target.name) {
      case "username":
        return setEmailFocus(true);
      case "password":
        return setPasswordFocus(true);
      default:
        return;
    }
  };

  const handleBlur = (e) => {
    switch (e.target.name) {
      case "username":
        return e.target.value <= 0 ? setEmailFocus(false) : setEmailFocus(true);
      case "password":
        return e.target.value <= 0
          ? setPasswordFocus(false)
          : setPasswordFocus(true);
      default:
        return;
    }
  };

  return (
    <div className="form-container" onSubmit={handleSubmit}>
      <h1 className="form-title">Log in</h1>
      <form className="login form" onSubmit={handleSubmit}>
        <div className="username-input-container">
          <label className="username-label label">
            <input
              type="text"
              className={`username input ${
                errors.username.length ? "border-error" : ""
              }`}
              id="username"
              name="username"
              autoComplete="off"
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={formState.username}
              onChange={handleChange}
            />
            <label
              htmlFor="username"
              className={`placeholder ${isEmailFocused ? "shifted" : ""}`}
            >
              Username
            </label>
            {errors.username.length > 0 ? (
              <div className="error">{errors.username}</div>
            ) : null}
          </label>
        </div>

        <div className="password-input-container">
          <label className="password-label label">
            <input
              type="text"
              className={`password input ${
                errors.password.length ? "border-error" : ""
              }`}
              name="password"
              autoComplete="off"
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={formState.password}
              onChange={handleChange}
            />
            <label
              htmlFor="password"
              className={`placeholder ${isPasswordFocused ? "shifted" : ""}`}
            >
              Password
            </label>
            {errors.password.length > 0 ? (
              <div className="error">{errors.password}</div>
            ) : null}
          </label>
        </div>

        <button
          className={`submit-btn ${buttonDisabled ? "disabled" : ""}`}
          disabled={buttonDisabled}
          onClick={handleClick}
        >
          {" "}
          Submit{" "}
        </button>
      </form>
    </div>
  );
};

export default Login;
