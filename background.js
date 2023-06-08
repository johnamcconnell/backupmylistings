// code version 1.1.5 5.25.2023 (updated using the chrome extension v3 standard found here https://developer.chrome.com/docs/extensions/reference/)

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "startDownloads") {
    var files = message.files;
    var totalFiles = message.totalFiles;
    downloadFiles(files, totalFiles);
  }
});

function downloadFiles(files, totalFiles) {
  var downloadedFiles = 0;
  var failedDownloads = [];

  files.forEach(function(file) {
    var downloadUrl = file.url;
    var fileName = file.name;

    chrome.downloads.download({ url: downloadUrl, filename: fileName }, function(downloadId) {
      if (downloadId !== undefined) {
        downloadedFiles++;
      } else {
        failedDownloads.push(file);
      }

      if (downloadedFiles + failedDownloads.length === totalFiles) {
        if (failedDownloads.length > 0) {
          handleDownloadErrors(failedDownloads);
        } else {
          handleSuccessfulDownloads();
        }
      }
    });
  });
}

function handleSuccessfulDownloads() {
  // Handle successful downloads here
  console.log("All files downloaded successfully");
}

function handleDownloadErrors(failedDownloads) {
  // Handle failed downloads here
  console.error("Failed to download some files:", failedDownloads);
}



// ---this code seems to be causing some issues so trying a different version of listener for the event messages JAM 6.8.23
// Listen for messages from content scripts
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "extractFiles") {
//     const files = message.files;

//     // Send a message to the service worker with the extracted files
//     navigator.serviceWorker.ready
//       .then(registration => {
//         registration.active.postMessage({ action: "downloadFiles", files: files });
//       })
//       .catch(error => {
//         console.error("Failed to send message to service worker:", error);
//       });
//   }
// });
// ---end of test commented code

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
