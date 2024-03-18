import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="Home">
      <h1>Halo in my Gamw</h1>
      <p>Click to continue!!!!</p>
      <Link to="/main">Start Game</Link>
    </div>
  );
};

export default Home;
