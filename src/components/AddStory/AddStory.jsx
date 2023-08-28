import React, { useState } from "react";
import styles from "./Style.module.css";
import cancel from "./../../assets/cancel.svg";
import { useNavigate } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiBaseUrl from "./../../constants/api";
const AddStory = () => {
  const navigate = useNavigate();
  const [error, setErrors] = useState("");
  const initialSlide = {
    slideHeading: "",
    slideDescription: "",
    slideImageUrl: "",
    category: "",
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [story, setStory] = useState([initialSlide]);

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

      const response = await axios.post(
        `${apiBaseUrl}/api/story/addstory`,
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
      toast("something went wrong, please try again", error.response.data);
    }
  };

  const handleAddSlide = () => {
    setErrors("");
    if (story.length < 6) {
      setStory((prevState) => [...prevState, initialSlide]);
      setCurrentSlide(story.length);
    }
  };

  const cancelButton = () => {
    navigate("/");
  };

  return (
    <>
      <div className={styles.addstoryContainer}>
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
        <div className={styles.addstoryBox}>
          <img src={cancel} alt="cancel-icon" onClick={cancelButton} />
          <div id={styles.heading2}>Add up to 6 slides</div>
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
            {story.length < 6 && (
              <div className={styles.slideBtn} onClick={handleAddSlide}>
                Add +
              </div>
            )}
          </div>
          <div className={styles.addstoryContentBox}>
            <div>
              <label>Heading:</label>
              <input
                type="text"
                name="slideHeading"
                value={story[currentSlide].slideHeading}
                onChange={handleChange}
                placeholder="Your heading"
                className={styles.addstoryInput}
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
                className={styles.addstoryInput}
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
                className={styles.addstoryInput}
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
                <option value="health and fitness">Health and Fitness</option>
                <option value="travel">Travel</option>
                <option value="movies">Movies</option>
                <option value="education">Education</option>
              </select>
            </div>
          </div>
          <p style={{ color: "red", marginLeft: "8rem", marginTop: "0" }}>
            {error && <span> {error}</span>}
          </p>
          <div className={styles.addstoryButtonsBox}>
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
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStory;
