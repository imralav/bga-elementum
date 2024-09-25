export function onNotification(notificationName: string) {
  return {
    do: (callback: (notification: Notif) => void) => {
      dojo.subscribe(notificationName, null, callback);
    },
  };
}
