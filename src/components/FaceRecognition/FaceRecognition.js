import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({
  imgUrl,
  faceBoxes,
  genderClass = "",
  emotionState = {
    isFound: false,
  },
  ageRange,
}) => {
  return (
    <div className={`faceRecognition-wrapper ${!imgUrl ? "dn" : ""}`}>
      <div className="faceRecognition-content center">
        <img
          src={imgUrl}
          alt="face Recognition"
          className="faceRecognition-img"
        />
        {faceBoxes &&
          faceBoxes.map((box, i) => (
            <div
              key={i}
              className={`facebox ${genderClass} ${
                emotionState.isFound ? "emotion" : ""
              }`}
              style={box}
            >
              {emotionState.isFound && <span className="emotion">{emotionState.value}</span>}
              {ageRange && <span className={`age`}>{ageRange}</span>}
            </div>
          ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
