import React from "react";
import { css } from "emotion";

const styles = {
  container: css`
    display: grid;
    grid-auto-flow: row;
    grid-gap: 0.5rem;
    justify-content: center;
    align-items: center;
  `,
  text: css`
    font-family: Poppins, san-serif;
    text-align: center;
  `,
  title: css`
    margin: 0;
  `,
  time: css`
    font-size: 3rem;
    margin: 1rem;
  `,
  date: css`
    margin: 0;
  `,
};

export const Clock: React.FC = () => {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={`${styles.text} ${styles.title}`}>Local Time</h3>
      <h1 className={`${styles.text} ${styles.time}`}>{now.toLocaleTimeString()}</h1>
      <h2 className={`${styles.text} ${styles.date}`}>{now.toLocaleDateString()}</h2>
    </div>
  );
};
