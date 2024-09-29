export function announce(message: string, durationInMs: number = 1000) {
  const announcementElement = document.getElementById("announcement");
  if (!announcementElement) {
    console.error("Could not find announcement element");
    return Promise.reject();
  }
  announcementElement.innerText = message;
  announcementElement.classList.add("visible");
  const promise = new Promise<void>((resolve) => {
    setTimeout(() => {
      announcementElement.classList.remove("visible");
      resolve();
    }, durationInMs);
  });
  return promise;
}