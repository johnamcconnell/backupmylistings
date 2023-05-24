// code version 1.5 5.24.2023
// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractFiles") {
    const files = message.files;
    const totalFiles = files.length;
    let completedDownloads = 0;

    // Send a message to the browser action popup to update the status and totalFiles
    chrome.runtime.sendMessage({ action: "updateStatus", status: "queuedToDownload", files, totalFiles });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Use the file.name and file.url to download the file
      chrome.downloads.download({ url: file.url, filename: file.name }, (downloadId) => {
        if (downloadId) {
          // Download started successfully, update the status to "currentlyDownloading"
          chrome.runtime.sendMessage({ action: "updateStatus", status: "currentlyDownloading", files: [file], totalFiles });
        } else {
          // Download failed, update the status to "downloadErrors"
          chrome.runtime.sendMessage({ action: "updateStatus", status: "downloadErrors", files: [file], totalFiles });
        }

        // Increment the count of completed downloads
        completedDownloads++;

        // Check if all downloads are completed
        if (completedDownloads === totalFiles) {
          // All downloads completed, update the status to "successfullyDownloaded"
          chrome.runtime.sendMessage({ action: "updateStatus", status: "successfullyDownloaded", files, totalFiles });
        }
      });
    }
  }
});


// // code version 1.4 5.24.2023
// // Listen for messages from the content script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "extractFiles") {
//     const files = message.files;
//     const totalFiles = files.length;
//     let completedDownloads = 0;

//     // Send a message to the browser action popup to update the status and totalFiles
//     chrome.runtime.sendMessage({ action: "updateStatus", status: "queuedToDownload", files, totalFiles });

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       // Use the file.name and file.url to download the file
//       chrome.downloads.download({ url: file.url, filename: file.name }, (downloadId) => {
//         if (downloadId) {
//           // Download started successfully, update the status to "currentlyDownloading"
//           chrome.runtime.sendMessage({ action: "updateStatus", status: "currentlyDownloading", files: [file], totalFiles });
//         } else {
//           // Download failed, update the status to "downloadErrors"
//           chrome.runtime.sendMessage({ action: "updateStatus", status: "downloadErrors", files: [file], totalFiles });
//         }

//         // Increment the count of completed downloads
//         completedDownloads++;

//         // Check if all downloads are completed
//         if (completedDownloads === totalFiles) {
//           // All downloads completed, update the status to "successfullyDownloaded"
//           chrome.runtime.sendMessage({ action: "updateStatus", status: "successfullyDownloaded", files, totalFiles });
//         }
//       });
//     }
//   }
// });











// // code version 1.3 5.24.2023
// // Listen for messages from the content script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "extractFiles") {
//     const files = message.files;

//     // Send a message to the browser action popup to update the status
//     chrome.runtime.sendMessage({ action: "updateStatus", status: "queuedToDownload", files });

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       // Use the file.name and file.url to download the file
//       chrome.downloads.download({ url: file.url, filename: file.name }, (downloadId) => {
//         if (downloadId) {
//           // Download started successfully, update the status to "currentlyDownloading"
//           chrome.runtime.sendMessage({ action: "updateStatus", status: "currentlyDownloading", files: [file] });
//         } else {
//           // Download failed, update the status to "downloadErrors"
//           chrome.runtime.sendMessage({ action: "updateStatus", status: "downloadErrors", files: [file] });
//         }
//       });
//     }
//   }
// });



// // code version 1.2 5.24.2023
// // Listen for messages from the content script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "extractFiles") {
//     const files = message.files;

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       // Use the file.name and file.url to download the file
//       chrome.downloads.download({ url: file.url, filename: file.name });
//     }
//   }
// });


// // code version 1.1 5.24.2023
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "extractFiles") {
//     const files = message.files;

//     // Send a response back to content.js
//     sendResponse({ success: true, files: files });

//     // Notify popup.js about the files to be downloaded
//     chrome.runtime.sendMessage({ action: "updateStatus", status: "queuedToDownload", files: files });
//   }
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "startDownloads") {
//     const files = message.files;

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       // Use the file.name and file.url to download the file

//       // Notify popup.js about the currently downloading file
//       chrome.runtime.sendMessage({ action: "updateStatus", status: "currentlyDownloading", files: [file] });

//       chrome.downloads.download({ url: file.url, filename: file.name }, function(downloadId) {
//         if (downloadId) {
//           // Notify popup.js about the successfully downloaded file
//           chrome.runtime.sendMessage({ action: "updateStatus", status: "successfullyDownloaded", files: [file] });
//         } else {
//           // Notify popup.js about the download error
//           chrome.runtime.sendMessage({ action: "updateStatus", status: "downloadErrors", files: [file] });
//         }
//       });
//     }
//   }
// });


// code version 1.1 5.23.2023
// // Listen for messages from content scripts
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "extractFiles") {
//     const files = message.files;

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       // Use the file.name and file.url to download the file
//       chrome.downloads.download({ url: file.url, filename: file.name });
//     }
//   }
// });
