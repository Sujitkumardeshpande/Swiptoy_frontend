import React, { useState } from "react";
import styles from "./Style.module.css";
import cancel from "./../../assets/cancel.svg";
import eyeOutline from "./../../assets/eye.png";
import eyeOffOutline from "./../../assets/hide.png";
import { useNavigate } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiBaseUrl from "./../../constants/api";
const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setErrors] = useState();

  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setErrors("");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/auth/login`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response.data;

      if (responseData.error) {
        setErrors(responseData.error);
      } else {
        window.localStorage.setItem("username", responseData.name);
        window.localStorage.setItem("token", responseData.jwtToken);

        navigate("/");
      }
    } catch (error) {
      toast("something went wrong, please try again");
    }
  };
  const cancelButton = () => {
    navigate("/");
  };
  return (
    <>
      <div className={styles.loginContainer}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className={styles.loginBox}>
          <img
            src={cancel}
            alt="cancel icon"
            onClick={cancelButton}
            className={styles.cancelBtn}
          />

          <div className={styles.loginContentBox}>
            <h2 className={styles.loginH2}>Login to SwipTory</h2>
            <label>
              Username
              <input
                type="text"
                placeholder="Enter username"
                name="username"
                onChange={handleChange}
                value={loginData.username}
              />
            </label>
            <label style={{ marginLeft: "6vw" }}>
              Password
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                name="password"
                onChange={handleChange}
                value={loginData.password}
              />
              {showPassword ? (
                <img
                  src={eyeOffOutline}
                  alt="Hide Password"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeIcon}
                />
              ) : (
                <img
                  src={eyeOutline}
                  alt="Show Password"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeIcon}
                />
              )}
            </label>
            <p style={{ color: "red" }}>{error && <span> {error}</span>}</p>

            <button className={styles.loginButton} onClick={handleSubmit}>
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
