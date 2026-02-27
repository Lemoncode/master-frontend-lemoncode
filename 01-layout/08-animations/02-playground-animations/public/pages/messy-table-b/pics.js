const gallery = document.querySelector(".gallery");

// Images constants
const imgCount = 30;
const imgWidth = 300;
const imgHeight = 200;

// Messy positionning constants
const deviationRange = { min: -5, max: 25 }; // Deviation from side in % of picture size
const rotationRange = { min: -180, max: 180 }; // In degrees

// Change to 'selected' and to 'discarded' if selected is already applied.
let discardedCount = imgCount;

// Function to randomize placement around 4 viewport borders assuming,
// by default, original picture position as viewport center (50%, 50%).
const messyPositioning = (originX = 50, originY = 50) => {
  // Pick a random side
  const randomSide = Math.floor(Math.random() * 4);

  // Pick a random deviation across the side and a positioning along the side
  const randomDeviation =
    Math.random() * (deviationRange.max - deviationRange.min) + deviationRange.min;
  const deviationAcrossSidePx = ((randomSide <= 1 ? imgHeight : imgWidth) * randomDeviation) / 100;
  const positionAlongSide = Math.random() * 100;
  const rotation = Math.random() * (rotationRange.max - rotationRange.min) + rotationRange.min;

  switch (randomSide) {
    case 0: // top
      return [
        `${positionAlongSide - originX}vw`,
        `calc(-${originY}vh + ${deviationAcrossSidePx}px)`,
        `${rotation}deg`,
      ];
    case 1: // bottom
      return [
        `${positionAlongSide - originX}vw`,
        `calc(${100 - originY}vh + ${deviationAcrossSidePx}px)`,
        `${rotation}deg`,
      ];
    case 2: // left
      return [
        `calc(-${originX}vw + ${deviationAcrossSidePx}px)`,
        `${positionAlongSide - originY}vh`,
        `${rotation}deg`,
      ];
    case 3: // right
      return [
        `calc(${100 - originX}vw + ${deviationAcrossSidePx}px)`,
        `${positionAlongSide - originY}vh`,
        `${rotation}deg`,
      ];
  }
};

// Picsum API image generator with random (messy) positioning
for (let i = 0; i < imgCount; i++) {
  const img = document.createElement("img");
  img.src = `https://picsum.photos/${imgWidth}/${imgHeight}?random=${Math.random()}`;
  img.alt = `Random photo ${i}`;

  // Random positioning and rotation
  const [x, y, rotation] = messyPositioning();

  // Create css variables with desired positioning to be fed
  // from css stylesheet.
  img.style.setProperty("--tx", x);
  img.style.setProperty("--ty", y);
  img.style.setProperty("--rotation", rotation);
  img.addEventListener("click", function () {
    if (!this.classList.contains("selected")) {
      this.classList.add("selected");
    } else {
      this.classList.replace("selected", "discarded");
      this.style.setProperty("--discardedCount", discardedCount--);
    }
  });

  gallery?.appendChild(img);
}
