// code version 1.0 5.24.2023
// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractFiles") {
    const files = message.files;

    // Send a message to the service worker with the extracted files
    chrome.runtime.sendMessage({ action: "downloadFiles", files: files });
  }
});

// Listen for messages from the service worker
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (message.action === "updateStatus") {
    // Send a message to the browser action popup to update the status
    chrome.runtime.sendMessage({ action: "updateStatus", status: message.status, files: message.files });
  }
});
