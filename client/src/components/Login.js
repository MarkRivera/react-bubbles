import React, { useState, useEffect } from "react";
import "./Login.css";
import * as Yup from "yup";
import axios from "axios";

const Login = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    isRemembered: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isEmailFocused, setEmailFocus] = useState(false);
  const [isPasswordFocused, setPasswordFocus] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // Validation
  const formSchema = Yup.object().shape({
    email: Yup.string()
      .email("Be sure you've entered a valid Email Address")
      .required("Email address is required"),
    password: Yup.string()
      .min(3, "Password must be at least 3 characters")
      .required("A password is required!"),
  });

  useEffect(() => {
    formSchema.isValid(formState).then((valid) => {
      setButtonDisabled(!valid);
    });
  }, [formSchema, formState]);

  // Event Handlers

  const handleSubmit = (e) => {
    e.preventDefault();
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
      case "email":
        return setEmailFocus(true);
      case "password":
        return setPasswordFocus(true);
      default:
        return;
    }
  };

  const handleBlur = (e) => {
    switch (e.target.name) {
      case "email":
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
    <div className="form-container">
      <h1 className="form-title">Log in</h1>
      <form className="login form" onSubmit={handleSubmit}>
        <div className="email-input-container">
          <label className="email-label label">
            <input
              type="text"
              className={`email input ${
                errors.email.length ? "border-error" : ""
              }`}
              id="email"
              name="email"
              autoComplete="off"
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={formState.email}
              onChange={handleChange}
            />
            <label
              htmlFor="email"
              className={`placeholder ${isEmailFocused ? "shifted" : ""}`}
            >
              Email
            </label>
            {errors.email.length > 0 ? (
              <div className="error">{errors.email}</div>
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
        >
          {" "}
          Submit{" "}
        </button>
      </form>
    </div>
  );
};

export default Login;
