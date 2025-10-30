console.log("Page script loading...");

// Parse current URL
const currentUrl = new URL(window.location.href);
const pathname = currentUrl.pathname;
const searchParams = currentUrl.searchParams;

// Extract HTML file name (without extension)
const fileName = pathname.split("/").pop().replace(".html", "");

// Check if "solution" query param exists
const loadSolution = searchParams.has("solution");

console.log("Current file:", fileName);
console.log("Load solution:", loadSolution ? "Yes" : "No");

// Determine which CSS file to load
const cssFileName = loadSolution ? `${fileName}-solution.css` : `${fileName}.css`;

// Function to dynamically load CSS
function loadCSS(cssPath) {
  // Check if a link with this CSS already exists
  const existingLink = document.querySelector(`link[href="${cssPath}"]`);
  if (existingLink) {
    console.log("CSS already loaded:", cssPath);
    return;
  }

  // Create new link element
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = cssPath;

  // Add to head
  document.head.appendChild(link);

  console.log("CSS loaded:", cssPath);

  // Optional: Handle load events
  link.onload = () => console.log("CSS successfully loaded:", cssPath);
  link.onerror = () => console.error("Failed to load CSS:", cssPath);
}

// Load the corresponding CSS
loadCSS(cssFileName);

// Usage examples:
// URL: /pages/basic-transform.html → Loads: basic-transform.css
// URL: /pages/basic-transform.html?solution=true → Loads: basic-transform-solution.css
