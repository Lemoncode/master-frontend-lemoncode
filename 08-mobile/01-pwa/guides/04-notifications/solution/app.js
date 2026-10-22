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
