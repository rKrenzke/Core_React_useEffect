import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === 'USER_BLUR'){
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
}; //Note that we created this reducer function outside of the compoenent function

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === 'USER_BLUR'){
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
}; //Note that we created this reducer function outside of the compoenent function


const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null
  })

  // useEffect(() => {
  //   console.log("Effect running");

  //   return () => {
  //     console.log("Effect CLEANUP");
  //   };
  // }, [enteredPassword]);

  //*Using object destructuring to pull out the value of a property (isValid) and assigning it to an alias (a different variable)
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid} = passwordState;

  useEffect(() => {
    //This is an example of 'debouncing'. In this case, without a setTimeout function, this side effect would be run after every keystroke (because the state variables are changed thru onChange), but this could be a problem if the side effect was instead sending an HTTP request. The timeout delay and clean-up function (clearTimeout) means that the useEffect logic (the form validation logic in this case) will not continually fire as the user types, but only after a brief pause (i.e. when the user has finisehd typing the email or password)
    const identifier = setTimeout(() => {
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    //Clean-up function
    return () => {
      clearTimeout(identifier);
    };
    //Dependencies
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'USER_INPUT', val: event.target.value})

    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // )
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "USER_BLUR"});
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "USER_BLUR"});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
