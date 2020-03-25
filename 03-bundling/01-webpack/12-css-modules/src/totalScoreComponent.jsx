import React from "react";
import { getTotalScore } from "./averageService";
const classes = require("./totalScoreComponentStyles.scss");

export const TotalScoreComponent = () => {
  const [totalScore, setTotalScore] = React.useState(0);

  React.useEffect(() => {
    const scores = [10, 20, 30, 40, 50];
    setTotalScore(getTotalScore(scores));
  }, []);

  return (
    <div>
      <span className={classes.resultBackground}>
        Students total score: {totalScore}
      </span>
    </div>
  );
};
