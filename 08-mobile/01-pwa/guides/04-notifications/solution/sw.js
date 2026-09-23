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
