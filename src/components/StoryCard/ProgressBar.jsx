import React, { useEffect, useState, useRef } from "react";
import "./ProgressBar.css";

const ProgressBar = ({ progress, maxProgress, intervalTime, segments }) => {
  const [displaySegments, setDisplaySegments] = useState(segments);
  const progressIncrement = maxProgress / segments;

  const progressInterval = useRef(null);

  useEffect(() => {
    const updateProgress = () => {
      setDisplaySegments((prevSegments) => {
        const newSegments = prevSegments - 1;
        if (newSegments <= 0) {
          clearInterval(progressInterval.current);
        }
        return newSegments;
      });
    };

    if (displaySegments > 0) {
      progressInterval.current = setInterval(
        updateProgress,
        intervalTime / segments
      );
    }

    return () => {
      clearInterval(progressInterval.current);
    };
  }, [displaySegments, intervalTime, segments]);

  return (
    <div className="progressbar-container">
      {[...Array(segments)].map((_, index) => (
        <div
          key={index}
          className={`progressbar-segment ${
            displaySegments >= index + 1 ? "filled" : ""
          }`}
        ></div>
      ))}
    </div>
  );
};

export default ProgressBar;
