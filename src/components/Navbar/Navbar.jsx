import React, { useState, useEffect } from "react";
import styles from "./Style.module.css";
import profileIcon from "./../../assets/hk.png";
import menuIcon from "./../../assets/menu-icon.svg";
import bookmarkIcon from "./../../assets/Vector.svg";
import cross from "./../../assets/cross.svg";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const isLoggedIn = !!localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    window.addEventListener("resize", () => {
      setInnerWidth(window.innerWidth);
    });
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
    navigate("/");
  };

  const [isProfileCardOpen, setProfileCardOpen] = useState(false);

  const toggleProfileCard = () => {
    setProfileCardOpen(!isProfileCardOpen);
  };

  return (
    <>
      <div className={styles.navbarContainer}>
        <div className={styles.pageTitle} onClick={() => navigate("/")}>
          SwipTory
        </div>
        {innerWidth > 600 ? (
          <div className={styles.navbarBtns}>
            {!isLoggedIn ? (
              <>
                <button
                  className={styles.registerBtn}
                  onClick={() => navigate("/register")}
                >
                  Register Now
                </button>
                <button
                  className={styles.signinBtn}
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                <Link to="/bookmarked" style={{ textDecoration: "none" }}>
                  <button className={styles.bookmarksBtn}>
                    <img src={bookmarkIcon} alt="" /> &nbsp; Bookmarks
                  </button>
                </Link>
                <button
                  className={styles.bookmarksBtn}
                  onClick={() => navigate("/addstory")}
                >
                  Add Story
                </button>
                <img
                  src={profileIcon}
                  alt="profile-icon"
                  className={styles.profileIcon}
                />
                <img
                  src={menuIcon}
                  alt="menu-icon"
                  className={styles.menuIcon}
                  onClick={toggleProfileCard}
                />
                {isProfileCardOpen && (
                  <div className={styles.profileCard}>
                    <img
                      src={cross}
                      alt="cancel btn"
                      onClick={toggleProfileCard}
                    />
                    <h1 className={styles.username}>{username}</h1>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className={styles.mobileview}>
            <img
              src={menuIcon}
              alt="menu-icon"
              className={styles.menuIcon}
              onClick={toggleProfileCard}
            />
            {isProfileCardOpen && (
              <div className={styles.profileCard}>
                <img
                  src={cross}
                  alt="cancel btn"
                  onClick={toggleProfileCard}
                  id={styles.crossBtn}
                />
                <div className={styles.profileContentbox}>
                  {!isLoggedIn ? (
                    <>
                      <button
                        className={styles.registerBtn}
                        onClick={() => navigate("/register")}
                      >
                        Register Now
                      </button>
                      <button
                        className={styles.signinBtn}
                        onClick={() => navigate("/login")}
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          gap: "40px",
                          marginRight: "100px",
                        }}
                      >
                        <img
                          src={profileIcon}
                          alt="profile-icon"
                          className={styles.profileIcon}
                        />
                        <h1 className={styles.username}>{username}</h1>
                      </div>
                      <Link to="/bookmarked" style={{ textDecoration: "none" }}>
                        <button className={styles.bookmarksBtn}>
                          <img src={bookmarkIcon} alt="" /> &nbsp; Bookmarks
                        </button>
                      </Link>
                      <button
                        className={styles.bookmarksBtn}
                        onClick={() => navigate("/addstory")}
                        style={{ paddingLeft: "40px" }}
                      >
                        Add Story
                      </button>
                      <button
                        className={styles.logoutBtn}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
