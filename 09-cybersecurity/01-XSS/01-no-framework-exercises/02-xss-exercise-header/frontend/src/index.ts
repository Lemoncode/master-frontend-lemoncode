const form = document.getElementById("MyForm");

const loginData = {
  user: document.getElementById("user"),
  password: document.getElementById("password"),
};

// Aquí se hace el login
form.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const user = document.querySelector("#user") as HTMLInputElement | null;
  const password = document.querySelector(
    "#password"
  ) as HTMLInputElement | null;

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: user?.value,
      password: password?.value,
    }),
  })
    .then((resp) => {
      // Aquí es donde se obtiene el token de autorización
      // y lo almacenamos en la variable global window["authHeader"]
      window["authHeader"] = resp.headers.get("Authorization");
      document.getElementById("MyForm").style.display = "none";
      document.getElementById("AddBio").style.display = "flex";
      console.log(...resp.headers);
    })
    .catch((err) => console.log(err));
});

document.getElementById("sendBio").addEventListener("click", (e) => {
  const textArea = document.getElementById("bio") as HTMLInputElement | null;
  const contenido = textArea?.value;

  fetch("http://localhost:3000/bio", {
    method: "POST",
    headers: {
      Authorization: window["authHeader"],
      "Content-type": "application/json",
      Accept: "application/json",
    },
  })
    .then((resp) => (document.getElementById("result").innerHTML = contenido))
    .catch((error) => console.log(error));
});

// Paste this example in text area: <a onClick="alert('Gracias por su token de autorización')">Click aquí para ver tu biografía</a>

document.getElementById("getPrivateData").addEventListener("click", (e) => {
  fetch("http://localhost:3000/private-area", {
    method: "GET",
    headers: {
      Authorization: window["authHeader"],
      "Content-type": "application/json",
      Accept: "application/json",
    },
  })
    .then((resp) => resp.json())
    .then(
      (resp) =>
        (document.getElementById(
          "resultPrivateData"
        ).innerHTML = `<p>Mi nombre es <b>${resp.nombre}</b> y esta es mi historia: <i>${resp.bio}</i></p>`)
    )
    .catch((error) => console.log(error));
});
