// Usemos algunas características de ES6
const randomNumber = Math.random() * 100;
const messageToDisplay = `random number is ${randomNumber}`;

const messageElement = document.createElement("p");
messageElement.textContent = messageToDisplay;
document.body.appendChild(messageElement);
