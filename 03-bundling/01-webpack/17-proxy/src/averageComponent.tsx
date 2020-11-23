import React from "react";
import { getAvg } from "./averageService";
//const classes = require("./averageComponentStyles.scss").default;
import classes from "./averageComponentStyles.scss";
//import { resultBackground } from "./averageComponentStyles.scss";
//import { resultBackground } from "./averageComponentStyles.css";

console.log(classes);

export const AverageComponent = () => {
  const [average, setAverage] = React.useState(0);

  React.useEffect(() => {
    const scores = [90, 75, 60, 99, 94, 30];
    setAverage(getAvg(scores));
  }, []);

  //className={classes["result-background"]}
  return (
    <div>
      <span className={classes.resultBackground}>
        Students average: {average}
      </span>
      <div className={`jumbotron ${classes.resultBackground}`}>
        <h1>Jumbotron students average: {average}</h1>
      </div>
    </div>
  );
};
