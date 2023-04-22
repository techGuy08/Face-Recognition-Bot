import React from "react";
import Tilt from "react-tilt";
import "./Logo.css";
import logo from "./light-brain-education-symbol.svg";
const Logo = () => {
  return (
    <div className={"logo-wrapper"}>
      <Tilt
        className="Tilt ml3 shadow-2"
        options={{ max: 25 }}
      >
        <div className="Tilt-inner">
          <img src={logo} alt="logo" />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
