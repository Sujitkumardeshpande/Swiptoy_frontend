import React, { useState, useEffect } from "react";
import styles from "./Style.module.css";
import cancel from "./../../assets/cancel.svg";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiBaseUrl from "./../../constants/api";
const EditStory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setErrors] = useState("");
  const initialSlide = {
    slideHeading: "",
    slideDescription: "",
    slideImageUrl: "",
    category: "",
  };
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [story, setStory] = useState([initialSlide]);

  useEffect(() => {
    setIsLoading(true);
    const fetchUserStories = async () => {
      try {
        const jwtToken = localStorage.getItem("token");
        const response = await axios.get(`${apiBaseUrl}/api/story/edit/${id}`, {
          headers: {
            Authorization: jwtToken,
          },
        });

        const foundStory = response.data.story.slides;
        setIsLoading(false);

        if (foundStory) {
          setStory(foundStory);
        } else {
          setErrors("Story not found");
        }
      } catch (error) {
        toast("Error fetching story", error.response.data);
      }
    };

    fetchUserStories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStory((prevState) => {
      const updatedSlides = prevState.map((slide, index) =>
        index === currentSlide ? { ...slide, [name]: value } : slide
      );
      setErrors("");
      return updatedSlides;
    });
  };

  const handleNextSlide = () => {
    if (currentSlide < story.length - 1) {
      setCurrentSlide((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prevIndex) => prevIndex - 1);
    }
  };

  const handlePostStory = async () => {
    try {
      const slides = story;
      const jwtToken = localStorage.getItem("token");
      const response = await axios.put(
        `${apiBaseUrl}/api/story/edit/${id}`,
        { slides },
        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );

      if (response.data.error) {
        setErrors(response.data.error);
      } else {
        navigate("/");
      }
    } catch (error) {
      toast("Error editing story", error.response.data);
    }
  };

  const cancelButton = () => {
    navigate("/");
  };

  return (
    <>
      <div className={styles.editstoryContainer}>
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
        <div className={styles.editstoryBox}>
          <img src={cancel} alt="cancel-icon" onClick={cancelButton} />
          <div id={styles.heading2}>Edit Story</div>
          <div className={styles.slideBtnContainer}>
            {story.map((_, index) => (
              <div
                key={index}
                className={`${styles.slideBtn} ${
                  currentSlide === index ? styles.active : ""
                }`}
              >
                Slide {index + 1}
              </div>
            ))}
          </div>
          <div className={styles.editstoryContentBox}>
            {!isLoading ? (
              <>
                <div>
                  <label>Heading:</label>
                  <input
                    type="text"
                    name="slideHeading"
                    value={story[currentSlide].slideHeading}
                    onChange={handleChange}
                    placeholder="Your heading"
                    className={styles.editstoryInput}
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <input
                    type="text"
                    name="slideDescription"
                    value={story[currentSlide].slideDescription}
                    onChange={handleChange}
                    placeholder="Story description"
                    className={styles.editstoryInput}
                    style={{ height: "80px" }}
                  />
                </div>
                <div>
                  <label>Image:</label>
                  <input
                    type="text"
                    name="slideImageUrl"
                    value={story[currentSlide].slideImageUrl}
                    onChange={handleChange}
                    placeholder="Add image url"
                    className={styles.editstoryInput}
                  />
                </div>
                <div>
                  <label>Category:</label>
                  <select
                    name="category"
                    value={story[currentSlide].category}
                    onChange={handleChange}
                  >
                    <option value="" defaultChecked>
                      Select Category
                    </option>
                    <option value="food">Food</option>
                    <option value="health and fitness">
                      Health and Fitness
                    </option>
                    <option value="travel">Travel</option>
                    <option value="movies">Movies</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </>
            ) : (
              <h2>Loading...</h2>
            )}
          </div>
          <p style={{ color: "red", marginLeft: "8rem", marginTop: "0" }}>
            {error && <span> {error}</span>}
          </p>
          <div className={styles.editstoryButtonsBox}>
            <div>
              <button
                className={styles.previousBtn}
                onClick={handlePreviousSlide}
              >
                Previous
              </button>
              <button className={styles.nextBtn} onClick={handleNextSlide}>
                Next
              </button>
            </div>
            <button className={styles.postBtn} onClick={handlePostStory}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditStory;
