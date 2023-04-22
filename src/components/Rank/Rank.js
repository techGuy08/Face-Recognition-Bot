import React from "react";
import "./Rank.css";

const Rank = ({ user }) => {
  return (
    <div className="Rank">
      <p>{`${user ? user.name + ", " : null} You Have ${
        user.entries
      } Entries.`}</p>
      <p>You Are Rank: {user && "#" + user.rank}</p>
    </div>
  );
};

export default Rank;
