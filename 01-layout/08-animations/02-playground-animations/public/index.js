console.log("This is your playground, experiment with native CSS animations!");

/**
 * ℹ️ Section definitions here
 * title: Section name, will be displayed as a label
 * cardNames: Friendly names for each card to be represented.
 * The page route is extracted by converting the card name to kebab-case.
 */

const sectionDefinition = [
  { title: "Transform", cardNames: ["Basic transform", "3D transform"] },
  {
    title: "Transition",
    cardNames: ["Basic transition", "Entrance", "Cool icons", "CSS Jitter", "Tooltip", "List pick"],
  },
  { title: "Animation", cardNames: ["List scroll", "Gallery flip"] },
];

/**
 * Script for dynamic creation of the sections defined above.
 */

const createCardSection = (title, cardNames) => {
  const cardSection = document.createElement("section");
  cardSection.innerHTML = `
    <p class="category">${title}</p>
    <div class="container">
    ${cardNames
      ?.map(name => {
        const route = toKebabCase(name);
        return `
          <div class="card">
            <p>${name}</p>
            <a href="/pages/${route}/practice.html">Practice</a>
            <a href="/pages/${route}/solution.html">Solution</a>
          </div>
        `;
      })
      .join("")}
    </div>
    `;
  return cardSection;
};

document.addEventListener("DOMContentLoaded", () => {
  // Once the DOM is ready, we dynamically add elements.
  const main = document.querySelector("main");
  for (const { title, cardNames } of sectionDefinition) {
    main.appendChild(createCardSection(title, cardNames));
  }
});

/**
 * Helpers
 */
const toKebabCase = str =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
