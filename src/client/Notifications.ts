export function onNotification<T extends keyof NotifTypes>(
  notificationName: T
) {
  return {
    do: (callback: (notification: NotifAs<T>) => void) => {
      dojo.subscribe(notificationName, null, callback);
    },
  };
}
