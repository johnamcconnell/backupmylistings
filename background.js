// code version 1.1.5 5.25.2023 (updated using the chrome extension v3 standard found here https://developer.chrome.com/docs/extensions/reference/)
// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractFiles") {
    const files = message.files;

    // Send a message to the service worker with the extracted files
    navigator.serviceWorker.ready
      .then(registration => {
        registration.active.postMessage({ action: "downloadFiles", files: files });
      })
      .catch(error => {
        console.error("Failed to send message to service worker:", error);
      });
  }
});

// Listen for messages from the service worker
navigator.serviceWorker.addEventListener('message', event => {
  const message = event.data;
  if (message.action === "updateStatus") {
    // Send a message to the browser action popup to update the status
    chrome.runtime.sendMessage({ action: "updateStatus", status: message.status, files: message.files }, response => {
      // Handle the response from the browser action popup if needed
    });
  }
});



// // code version 1.0 5.24.2023
// // Listen for messages from content scripts
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "extractFiles") {
//     const files = message.files;

//     // Send a message to the service worker with the extracted files
//     chrome.runtime.sendMessage({ action: "downloadFiles", files: files });
//   }
// });

// // Listen for messages from the service worker
// chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
//   if (message.action === "updateStatus") {
//     // Send a message to the browser action popup to update the status
//     chrome.runtime.sendMessage({ action: "updateStatus", status: message.status, files: message.files });
//   }
// });
