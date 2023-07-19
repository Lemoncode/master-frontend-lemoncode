import './app.css';
import logo from '/logo.png';
import { House, getHouseTitle } from '@<user-name>/house-helpers';
import { getHouseMotto } from '@<user-name>/motto-helpers';

function App() {
  return (
    <>
      <img src={logo} className="logo" />
      <h1>{getHouseTitle(House.lannister)}</h1>
      <h2>{getHouseMotto(House.lannister)}</h2>
    </>
  );
}

export default App;
