import React, { useEffect, useState } from "react";
import styles from "./Style.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loadingbar from "./../../assets/loadingbar.gif";
import apiBaseUrl from "./../../constants/api";
const Storybyuser = () => {
  const [stories, setStories] = useState([]);
  const [visibleSlides, setVisibleSlides] = useState(4);
  const [isLoading, setIsLoading] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    async function fetchStoriesByUser() {
      try {
        const jwtToken = localStorage.getItem("token");
        const response = await axios.get(
          `${apiBaseUrl}/api/story/storiesbyuser`,
          {
            headers: {
              Authorization: jwtToken,
            },
          }
        );
        setStories(response.data.userStories || []);
        setIsLoading(false);
      } catch (error) {
        toast("Error in fetching your stories:", error);
      }
    }

    fetchStoriesByUser();
  }, []);

  const handleSeeMore = () => {
    setVisibleSlides(stories.flatMap((story) => story.slides).length);
  };

  const handleSeeLess = () => {
    setVisibleSlides(4);
  };
  const storyLength = stories.map((story) => story.slides).flat();

  return (
    <>
      <div className={styles.storiesContainer}>
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

        <h2 className={styles.categoryTitle}>Your Stories</h2>
        {isLoading ? (
          <img src={loadingbar} alt="loadingbar" />
        ) : storyLength.length === 0 ? (
          <p style={{ fontSize: "1rem", fontWeight: "500" }}>
            Please add your new story.
          </p>
        ) : (
          <div className={styles.storyBoxContainer}>
            <div className={styles.storyBox}>
              {stories
                .flatMap((story) => story.slides)
                .slice(0, visibleSlides)
                .map((item, slideIndex) => (
                  <div key={slideIndex} className={styles.storyCard}>
                    <img
                      src={item.slideImageUrl}
                      alt="storypic"
                      onClick={() => navigate(`/story/${item._id}`)}
                    />
                    <div
                      className={styles.darkShadow}
                      onClick={() => navigate(`/story/${item._id}`)}
                    >
                      <div className={styles.storyTitle}>
                        {item.slideHeading}
                      </div>
                      <div className={styles.storyDescription}>
                        {item.slideDescription
                          .split(" ")
                          .slice(0, 16)
                          .join(" ") + "..."}
                      </div>
                    </div>
                    <Link to={`/editstory/${item._id}`}>
                      <button className={styles.editBtn}>&#x270E;Edit</button>
                    </Link>
                  </div>
                ))}
            </div>
            <div className={styles.seeMoreLess}>
              {visibleSlides === 4 ? (
                <button onClick={handleSeeMore} className={styles.seeMore}>
                  See more
                </button>
              ) : (
                <button onClick={handleSeeLess} className={styles.seeMore}>
                  See less
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Storybyuser;
