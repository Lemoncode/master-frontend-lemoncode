import "./app.css";
import logo from "/logo.png";
import { House, getHouseTitle } from "@<user-name>/house-helpers";
import { getHouseMotto } from "@<user-name>/motto-helpers";

function App() {
  return (
    <>
      <img src={logo} className="logo" />
      <h1>{getHouseTitle(House.stark)}</h1>
      <h2>{getHouseMotto(House.stark)}</h2>
    </>
  );
}

export default App;
