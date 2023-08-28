import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProgressBar from "./ProgressBar";
import styles from "./Style.module.css";
import previousStoryBtn from "./../../assets/ooui_next-ltr.svg";
import nextStoryBtn from "./../../assets/ooui_next-ltr (1).svg";
import bookmarkedIcon from "./../../assets/Group 21.svg";
import likedIcon from "./../../assets/likes.svg";
import shareIcon from "./../../assets/shareicon.svg";
import cancelIcon from "./../../assets/storycross.svg";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiBaseUrl from "./../../constants/api";
const StoryCard = () => {
  const [story, setStory] = useState(null);
  const { id } = useParams();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const [likesCount, setLikesCount] = useState(0);
  const [showLinkShareBar, setShowLinkShareBar] = useState(false);
  const [enableAutoSlideChange, setEnableAutoSlideChange] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/api/story/${id}`)
      .then((response) => {
        setStory(response.data.story.slides);
      })
      .catch((error) => {
        toast("Error fetching story", error);
      });
  }, [id]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const jwtToken = localStorage.getItem("token");
      setIsLoggedIn(!!jwtToken);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 100 / (story?.length || 1);
        if (newProgress >= 100) {
          clearInterval(progressInterval.current);
          setTimeout(() => {
            setProgress(0);
          }, 2000);
        }
        return newProgress;
      });
    };

    if (enableAutoSlideChange && currentSlideIndex < (story?.length || 1) - 1) {
      progressInterval.current = setInterval(
        updateProgress,
        2000 / (story?.length || 1)
      );
    } else {
      clearInterval(progressInterval.current);
      setProgress(0);
    }

    return () => {
      clearInterval(progressInterval.current);
    };
  }, [currentSlideIndex, enableAutoSlideChange, story]);

  const handleNextSlide = () => {
    setEnableAutoSlideChange(false);
    setCurrentSlideIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % story.length;
      return newIndex !== 0 ? newIndex : prevIndex;
    });

    setTimeout(() => {
      setEnableAutoSlideChange(true);
    }, 2000);
  };

  const handlePreviousSlide = () => {
    setEnableAutoSlideChange(false);
    setCurrentSlideIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? story.length - 1 : prevIndex - 1;
      return newIndex !== story.length - 1 ? newIndex : prevIndex;
    });

    setTimeout(() => {
      setEnableAutoSlideChange(true);
    }, 2000);
  };

  const handleShare = () => {
    const currentSlideId = story[currentSlideIndex]._id;
    const baseLink = process.env.REACT_APP_BASE_URL;
    const linkToCopy = `${baseLink}/story/${currentSlideId}`;

    navigator.clipboard.writeText(linkToCopy).then(() => {
      setShowLinkShareBar(true);
    });
  };

  useEffect(() => {
    if (showLinkShareBar) {
      const timeout = setTimeout(() => {
        setShowLinkShareBar(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showLinkShareBar]);

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const currentSlideId = story[currentSlideIndex]._id;
      const jwtToken = localStorage.getItem("token");
      const response = await axios.post(
        `${apiBaseUrl}/api/story/bookmark/${currentSlideId}`,
        null,
        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );

      if (response.status === 200) {
        toast("Story bookmarked successfully");
      }
    } catch (error) {
      toast("Error bookmarking the story", error);
    }
  };

  const handleLiked = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const currentSlideId = story[currentSlideIndex]._id;
      const jwtToken = localStorage.getItem("token");
      const response = await axios.post(
        `${apiBaseUrl}/api/story/like/${currentSlideId}`,
        null,
        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );
      const likes = await axios.get(
        `${apiBaseUrl}/api/story/like/${currentSlideId}`
      );

      if (response.status === 200) {
        setLikesCount(likes.data.likes);
        toast("Story liked successfully");
      }
    } catch (error) {
      toast("Error liking the story", error);
    }
  };

  if (!story || story.length === 0) {
    return (
      <img
        src="https://i.gifer.com/80ZN.gif"
        className={styles.loading}
        alt="Loading"
      />
    );
  }

  const currentSlide = story[currentSlideIndex];
  const progressBarSegments = story.length;
  const isLastSlide = currentSlideIndex === story.length - 1;

  return (
    <>
      <div className={styles.storyContainer}>
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
        <div className={styles.storycardBox}>
          <img
            src={previousStoryBtn}
            alt="backbutton"
            onClick={handlePreviousSlide}
            id={styles.previousBtn}
            className={
              currentSlideIndex === 0 ? styles.disabledBtn : styles.enabledBtn
            }
          />
          <div className={styles.storycard}>
            <div className={styles.upperDarkshade}>
              <ProgressBar
                progress={progress}
                maxProgress={100}
                intervalTime={10000}
                segments={progressBarSegments}
              />
              <div>
                <img
                  src={cancelIcon}
                  alt="cancelbutton"
                  onClick={() => navigate("/")}
                />
                <img
                  src={shareIcon}
                  alt="sharebutton"
                  className={styles.sharebtn}
                  onClick={handleShare}
                />
              </div>
            </div>
            <div className={styles.leftrightBtnBox}>
              <div
                className={styles.leftBtn}
                onClick={handlePreviousSlide}
              ></div>
              <div className={styles.rightBtn} onClick={handleNextSlide}></div>
            </div>
            <img
              src={currentSlide.slideImageUrl}
              alt=""
              className={styles.storyImg}
            />
            {showLinkShareBar && (
              <div className={styles.linkSharebar}>
                Link copied to clipboard
              </div>
            )}
            <div className={styles.lowerDarkshade}>
              <div className={styles.storyTitle}>
                {currentSlide.slideHeading}
              </div>
              <div className={styles.storyDescription}>
                {currentSlide.slideDescription}
              </div>
              <div className={styles.bookmarksLikesContainer}>
                {isLoggedIn && (
                  <>
                    <div onClick={handleBookmark}>
                      <img
                        src={bookmarkedIcon}
                        alt="bookmarkicon"
                        className={styles.bookmarkIcon}
                      />
                    </div>
                    <div onClick={handleLiked}>
                      <img src={likedIcon} alt="like icon" />
                      <span>{likesCount}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <img
            src={nextStoryBtn}
            alt="nextbutton"
            onClick={handleNextSlide}
            id={styles.previousBtn}
            className={
              currentSlideIndex === story.length - 1
                ? styles.disabledBtn
                : styles.enabledBtn
            }
          />
        </div>
      </div>
    </>
  );
};

export default StoryCard;
