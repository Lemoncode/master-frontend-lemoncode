# Notifications Push

Create `solution/sw.js`

```js
self.addEventListener("push", (event) => {
  console.log("push!!!");
  const payload = event.data.text();

  const options = {
    data: {},
    actions: [
      {
        action: "view",
        title: "Ver",
        icon: "path/icono",
      },
      {
        action: "ignore",
        title: "Ignorar",
        icon: "path/icono",
      },
    ],
  };

  event.waitUntil(
    self.registration
      .showNotification(`Title: ${payload}`, options)
      .then(() => {
        console.log("Notification mostrada");
      }),
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log(event);
});

```

Update `solution/app.js`

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

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => {
        console.log(`Registration succeeded. Scope is ${reg.scope}`);
      })
      .catch((error) => {
        console.error("Registration failed", error);
      });
  }

  showNotificationRegister();
};

main();

```