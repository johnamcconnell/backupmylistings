// code version 1.7.5 5.30.2023 (updated using chrome extension V3 standards found here https://developer.chrome.com/docs/extensions/reference/ )

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startDownloads') { // Update action name to match the one sent from popup.js
    const files = message.files;
    // Call the function to initiate downloads
    initiateDownloads(files);
  }
});

let totalFiles = 0;
let downloadsRunning = 0;

function updateDownloadStatistics() {
  // Send a message to the extension's user interface
  chrome.runtime.sendMessage({ action: 'updateDownloadStatistics', totalFiles, downloadsRunning });
}

// Function to initiate downloads based on the file information
function initiateDownloads(files) {
  console.log("initiating the downloads...");
  totalFiles = files.length;


  const delay = 500; //100 milisecond delay
  const now = new Date(); //current date and time
  let hours = now.getHours();
  const amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  
  const timestamp = now.getFullYear() + '-' +
    ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
    ('0' + now.getDate()).slice(-2) + '-' +
    ('0' + now.getHours()).slice(-2) +
    ('0' + now.getMinutes()).slice(-2)+ amPm;
  
  const folderName = 'backupmylistings - ' + timestamp + '/';


  // Iterate over the files and initiate downloads using chrome.downloads.download
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const downloadUrl = file.url;
    const filename = folderName + file.name; //* add a date-time to the folder name so that it is unique each time downloading occurs


    // Modify the download URL by appending a timestamp query parameter to bypass caching
    const timestampUrl = appendTimestampQueryParam(downloadUrl);

    setTimeout(() => {


      // Use chrome.downloads.download API to trigger the file download
      chrome.downloads.download({ url: timestampUrl, filename: filename, saveAs: false }, downloadId => {
        if (downloadId) {
          // Download started successfully
          console.log(`Download started for file: ${filename}`);
            downloadsRunning++;
            updateDownloadStatistics();
        } else {
          // Download failed
          console.error(`Download failed for file: ${filename}`);
        }
      });
    }, i * delay); // Multiply the index by the delay to stagger the downloads
  }
}

// Function to append a timestamp query parameter to a URL
function appendTimestampQueryParam(url) {
  const timestamp = new Date().getTime();
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_=${timestamp}`;
}






// // code version 1.5 5.24.2023
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
