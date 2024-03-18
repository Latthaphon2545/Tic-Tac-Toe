import { Link } from "react-router-dom";

const Main = () => {
  return (
    <div className="Main">
      <h1>Main</h1>
      <ul>
        <li>
          <Link to="/tr">3 x 3</Link>
        </li>
        <li>
          <Link to="/fo">4 x 4</Link>
        </li>
        <li>
          <Link to="/fi">5 x 5</Link>
        </li>
      </ul>
    </div>
  );
};

export default Main;
