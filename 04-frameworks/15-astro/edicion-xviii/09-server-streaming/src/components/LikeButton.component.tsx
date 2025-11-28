import { useState, useEffect } from "react";
import { actions } from "astro:actions";

const Like: React.FC = () => {
  const [likes, setLikes] = useState<number>(0);

  useEffect(() => {
    actions.getLikes().then((response) => {
      setLikes(response?.data?.likes ?? 0);
    });
  }, []);

  const handleLike = async () => {
    const result = await actions.addLike().then((response) => {
      setLikes(response?.data?.likes ?? 0);
    });
  };

  return (
    <button
      onClick={handleLike}
      style={{
        fontSize: "1.5rem",
        border: "none",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      👍 {likes}
    </button>
  );
};

export default Like;
