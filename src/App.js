import React, { useState, useEffect } from "react";
import "./App.css";
import "tachyons";
import Particles from "react-particles-js";
import Navbar from "./components/Navbar/Navbar";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Signup from "./components/Signup/Signup";
import env from "react-dotenv";

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

function App() {
  const { API_PAT, API_USER_ID, API_APP_ID, SERVER_URL } = env;
  const [imageUrl, setImageURL] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [faceBoxes, setfaceBoxes] = useState(null);
  const [Route, setRoute] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [genderClass, setGenderClass] = useState("");
  const [emotionState, setEmotionState] = useState({});
  const [ageRange, setAgeRange] = useState("");

  useEffect(() => {
    let saveData = JSON.parse(sessionStorage.getItem("user")) || null;
    if (saveData) {
      setUser(saveData);
      setIsLoggedIn(true);
    }
  }, [""]);

  const loadUser = (id) => {
    fetch(SERVER_URL + "/profile/" + id, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setIsLoggedIn(true);
      })
      .catch((err) => console.log(err));
  };
  const handleURLChange = (e) => {
    const { value } = e.target;
    setInputUrl(value);
  };
  const getClarifaiApiObject = (url) => {
    const PAT = API_PAT;

    const USER_ID = API_USER_ID;
    const APP_ID = API_APP_ID;

    const IMAGE_URL = url;
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
            },
          },
        },
      ],
    });
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };
    return requestOptions;
  };
  const handleDetectClick = (e) => {
    setfaceBoxes(null);
    setImageURL(inputUrl.trim());

    // Change these to whatever model and image URL you want to use
    const MODEL_ID = "face-detection";
    let requestOptions = getClarifaiApiObject(inputUrl);
    setGenderClass("");
    setEmotionState({});
    setAgeRange("");
    fetch(
      "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
      requestOptions
    )
      .then((response) => response.json())
      .then(function (response) {
        const Boxes = response.outputs[0].data.regions.map(
          (el) => el.region_info.bounding_box
        );
        const posBoxes = Boxes.map((el) => calculateFaceLocation(el));
        if (Boxes.length === 1) {
          fetch(
            "https://api.clarifai.com/v2/models/" +
              "gender-demographics-recognition" +
              "/outputs",
            requestOptions
          )
            .then((response) => response.json())
            .then((response) => {
              const genderData = response.outputs[0].data.concepts.sort(
                (a, b) => b.value - a.value
              );
              if (genderData[0].name === "Masculine") {
                setGenderClass("gender-male");
              } else if (genderData[0].name === "Feminine") {
                setGenderClass("gender-female");
              }
            });
          fetch(
            "https://api.clarifai.com/v2/models/" +
              "face-sentiment-recognition" +
              "/outputs",
            requestOptions
          )
            .then((response) => response.json())
            .then((response) => {
              const emotionData = response.outputs[0].data.concepts.sort(
                (a, b) => b.value - a.value
              );
              setEmotionState({
                isFound: true,
                value: emotionData[0].name,
              });
              fetch(
                "https://api.clarifai.com/v2/models/" +
                  "age-demographics-recognition" +
                  "/outputs",
                requestOptions
              )
                .then((response) => response.json())
                .then((response) => {
                  const ageData = response.outputs[0].data.concepts.sort(
                    (a, b) => b.value - a.value
                  );
                  setAgeRange(ageData[0].name);
                });
            });
        } else {
          console.log("a lot more faces");
        }
        setfaceBoxes(posBoxes);
        if (user) {
          fetch(SERVER_URL + "/image", {
            method: "PUT",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              id: user.id,
              email: user.email,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              loadUser(user.id);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const calculateFaceLocation = (data) => {
    const imgElement = document.querySelector(".faceRecognition-img");
    const width = Number(imgElement.width);
    const height = Number(imgElement.height);
    return {
      left: data.left_col * width,
      top: data.top_row * height,
      right: width - data.right_col * width,
      bottom: height - data.bottom_row * height,
    };
  };
  const changeRouteTo = (route) => {
    if (route === "signout") {
      route = "signin";
      setIsLoggedIn(false);
      setUser(null);
      setImageURL("");
      setInputUrl("");
      sessionStorage.clear();
    }
    setRoute(route);
  };

  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Navbar login={isLoggedIn} changeRoute={changeRouteTo} user={user} />
      {(Route === "signin" || (Route === "home" && !isLoggedIn)) && (
        <Signin changeRoute={changeRouteTo} loadUser={loadUser} />
      )}
      {Route === "signup" && (
        <Signup changeRoute={changeRouteTo} loadUser={loadUser} />
      )}
      {Route === "home" && isLoggedIn && (
        <React.Fragment>
          <Logo />
          <Rank user={user} />
          <ImageLinkForm
            Url={inputUrl}
            onUrlChange={handleURLChange}
            onDetectClick={handleDetectClick}
          />
          <FaceRecognition
            imgUrl={imageUrl}
            faceBoxes={faceBoxes}
            genderClass={genderClass}
            emotionState={emotionState}
            ageRange={ageRange}
          />
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
