# Notifications Registering

On this demo we are going to add `app.js` to the solution that we created on `01-manifests`

Copy `resources/logo.svg` to `solution/logo.svg`

Update `index.html`

```diff
# ....
  <body>
    <h1>Amazing App</h1>
+   <div>
+     <button id="showNotificactionButton">Mostrar notificación</button>
+   </div>
  </body>
# ....
```

Create `app.js`

```js
const invokeNotification = () => {
  const notification = new Notification("Notification title", {
    icon: "logo.svg",
    body: "This is notification body",
    data: {},
  });

  notification.onclick = () => window.open("https://lemoncode.net");
};

const showNotificationRegister = () => {
  const showNotificactionButton = document.getElementById(
    "showNotificactionButton",
  );

  showNotificactionButton.addEventListener("click", () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    } else {
        invokeNotification();
    }
  });
};

const main = () => {
  if (!Notification) {
    alert("Your browser dos not support notifications");
    return;
  } 

  showNotificationRegister();
};

main();

```

Update `index.html`

```diff
# ....
  <body>
    <h1>Amazing App</h1>
    <div>
      <button id="showNotificactionButton">Mostrar notificación</button>
    </div>
+   <script type="module" src="app.js"></script>
  </body>
# ....
```