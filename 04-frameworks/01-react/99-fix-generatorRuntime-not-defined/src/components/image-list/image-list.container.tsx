import React from "react";
import { ImageListComponent } from "./image-list.component";
import { Image } from "./image-list.vm";
import { getCatsCollection } from "./api/";
import { mapImageListFromApiToVM } from "./image-list.mapper";

export const ImageListContainer: React.FC = () => {
  const [images, setImages] = React.useState<Image[]>([]);

  const onLoadImageList = async () => {
    const apiImageList = await getCatsCollection();
    const viewModelImageList = mapImageListFromApiToVM(apiImageList);
    setImages(viewModelImageList);
  };

  React.useEffect(() => {
    onLoadImageList();
  }, []);

  return (
    <>
      <h1>Hello from Image List Container</h1>
      <ImageListComponent ImageCollection={images} />
    </>
  );
};
