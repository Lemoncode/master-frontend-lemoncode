import React from "react";
import { Image } from "./image-list.vm";

interface Props {
  ImageCollection: Image[];
}

export const ImageListComponent: React.FC<Props> = (props) => {
  const imageList = props.ImageCollection;
  return (
    <ul>
      {imageList.map((image) => (
        <li key={image.id}>{image.description}</li>
      ))}
    </ul>
  );
};
