import { Gallery } from './image-list.js';
const isServiceWorkerAvailable = () => "serviceWorker" in navigator;

const registerInRootScope = async (swURL) => {
  let registration = null;
  try {
    registration = await navigator.serviceWorker.register(swURL, {
      scope: "/",
    });
  } catch (error) {
    console.error(`Registration failed with error: ${error}`);
  } finally {
    return registration;
  }
};

const logRegistrationState = (registration) => {
  if (registration?.installing) {
    console.log("SW installing");
  }

  if (registration?.waiting) {
    console.log("SW installed");
  }

  if (registration?.active) {
    console.log("SW active");
  }
};

const registerServiceWorker = async () => {
  if (isServiceWorkerAvailable()) {
    const registration = await registerInRootScope("/sw.js");
    logRegistrationState(registration);
  }
};

const imgSection = document.querySelector("section");

const getImageBlob = async (url) => {
  const imageResponse = await fetch(url);
  
  if (!imageResponse.ok) {
    throw new Error(
      `Image did not load; error code: ${
        imageResponse.statusText || imageResponse.status
      }`,
    );
  }

  return imageResponse.blob();
};

const createGalleryFigure = async (galleryImage) => {
  try {
    console.log(galleryImage, galleryImage.url);

    const imageBlob = await getImageBlob(galleryImage.url);
    const myImage = document.createElement("img");
    const myCaption = document.createElement("caption");
    const myFigure = document.createElement("figure");
    const myName = document.createElement("span");
    myName.textContent = `${galleryImage.name}: `;
    const myCredit = document.createElement("span");
    myCredit.innerHTML = `Taken by ${galleryImage.credit}`;
    myCaption.append(myName, myCredit);
    myImage.src = window.URL.createObjectURL(imageBlob);
    myImage.setAttribute("alt", galleryImage.alt);
    myFigure.append(myImage, myCaption);
    imgSection.append(myFigure);
  } catch (error) {
    console.error(error);
  }
};

registerServiceWorker();
Gallery.images.map(createGalleryFigure);