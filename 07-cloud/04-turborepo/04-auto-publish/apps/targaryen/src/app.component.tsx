import './app.css';
import logo from '/logo.png';
import { House, getHouseTitle } from '@<user-name>/house-helpers';
import { getHouseMotto } from '@<user-name>/motto-helpers';

function App() {
  return (
    <>
      <img src={logo} className="logo" />
      <h1>{getHouseTitle(House.targaryen)}</h1>
      <h2>{getHouseMotto(House.targaryen)}</h2>
    </>
  );
}

export default App;
