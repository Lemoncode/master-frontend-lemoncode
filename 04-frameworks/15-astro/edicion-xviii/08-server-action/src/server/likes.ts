let likeCount = 0; // Contador en memoria

export const getLikes = () => {
  return likeCount;
};

export const addLike = () => {
  likeCount += 1;
  return likeCount;
};
