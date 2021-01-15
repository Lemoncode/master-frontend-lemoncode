import { Image } from './image-list.api.model';
import { mockImagesCats, mockImagesKities } from './image-list.mock-data';

let imagesCats = [...mockImagesCats];
let imagesKities = [...mockImagesKities];

export const getCatsCollection = async (): Promise<Image[]> => {
    return imagesCats;
}

export const getKitiesCollection = async (): Promise<Image[]> => {
    return imagesKities;
}