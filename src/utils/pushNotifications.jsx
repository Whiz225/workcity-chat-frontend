export const requestNotificationPermission = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const swRegistration = await navigator.serviceWorker.ready;
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });
      return subscription;
    }
    return null;
  } catch (err) {
    console.error("Error requesting notification permission:", err);
    return null;
  }
};

export const registerPushNotifications = async () => {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered");
    } catch (err) {
      console.error("Service Worker registration failed:", err);
    }
  }
};
