import { useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="Home"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        color: "white",
      }}
    >
      <h1>Welcome to Tic Tac Toe</h1>
      <p>Click to continue!!!!</p>
      <Link to="/main">Join Game</Link>
    </div>
  );
};

export default Home;
