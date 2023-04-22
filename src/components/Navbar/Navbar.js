import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  navBtn: {
    fontWeight: "500",
    margin: "10px",
    fontSize: "1.1rem",
    color: "#444",
    transition: "0.3s",
    textTransform: "capitalize",
    border: "1px solid transparent",
    "&:hover": {
      borderColor: "#444",
    },
  },
}));
const NavBar = ({ login, changeRoute, user }) => {
  const classes = useStyles();
  return (
    <nav
      className="NavBar"
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {login ? (
        <React.Fragment>
          <p
            style={{
              margin: "23px 10px",
            }}
          >
            Welcome, {user && user.name}
          </p>
          <Button
            className={classes.navBtn}
            onClick={() => {
              changeRoute("signout");
            }}
          >
            Sign Out
          </Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Button
            className={classes.navBtn}
            onClick={() => {
              changeRoute("signup");
            }}
          >
            Sign Up
          </Button>
          <Button
            className={classes.navBtn}
            onClick={() => {
              changeRoute("signin");
            }}
          >
            Sign In
          </Button>
        </React.Fragment>
      )}
    </nav>
  );
};

export default NavBar;
