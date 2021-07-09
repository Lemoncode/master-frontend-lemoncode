import React from "react";
import { css } from "emotion";
import { getQuote, QuoteResponse } from "./quote.api";

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    box-sizing: border-box;
    background-image: url("https://picsum.photos/800/600");
    background-size: cover;
    background-position: 50%;
  `,
  text: css`
    font-family: Poppins, san-serif;
    text-shadow: 0px 0px 5px black;
    color: white;
    text-align: center;
  `,
};

export const Quote: React.FC = () => {
  const [quote, setQuote] = React.useState<QuoteResponse>();

  React.useEffect(() => {
    getQuote().then(setQuote);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.text}>{quote?.content}</h1>
      <h3 className={styles.text}>{`- ${quote?.author}`}</h3>
    </div>
  );
};
