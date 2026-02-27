import { useState, useEffect } from "react";

const Like: React.FC = () => {
  const [likes, setLikes] = useState<number>(0);

  useEffect(() => {
    // Cargar los likes desde localStorage al montar el componente
    const storedLikes = localStorage.getItem("likes");
    if (storedLikes) {
      setLikes(parseInt(storedLikes, 10));
    }
  }, []);

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    localStorage.setItem("likes", newLikes.toString());
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
