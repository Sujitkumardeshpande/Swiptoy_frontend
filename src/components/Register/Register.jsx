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
const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [error, setErrors] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setErrors("");
  };

  const dataSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/auth/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.data;

      if (responseData.error) {
        setErrors(responseData.error);
      } else {
        window.localStorage.setItem("username", responseData.name);
        window.localStorage.setItem("token", responseData.jwtToken);
        alert(responseData.success);
        navigate("/");
      }
    } catch (error) {
      toast("Something went wrong, please try again");
    }
  };

  const cancelButton = () => {
    navigate("/");
  };

  return (
    <>
      <div className={styles.registerContainer}>
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
        <div className={styles.registerBox}>
          <img
            src={cancel}
            alt="cancel icon"
            onClick={cancelButton}
            id={styles.cancelBtn}
          />

          <div className={styles.registerContentbox}>
            <h2 className={styles.loginH2}>Register to SwipTory</h2>
            <label>
              Username
              <input
                type="text"
                placeholder="Enter username"
                name="username"
                onChange={handleChange}
                value={userData.username}
              />
            </label>
            <label style={{ marginLeft: "6vw" }}>
              Password
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                name="password"
                onChange={handleChange}
                value={userData.password}
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
            <button className={styles.registerButton} onClick={dataSubmit}>
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
