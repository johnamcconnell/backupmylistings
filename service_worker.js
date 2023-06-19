// code version 1.7.5 5.30.2023 (updated using chrome extension V3 standards found here https://developer.chrome.com/docs/extensions/reference/ )

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startDownloads') { // Update action name to match the one sent from popup.js
    const files = message.files;
    // Call the function to initiate downloads
    initiateDownloads(files);
  } else if (message.action === 'resetDownloadCount') {
    downloadsRunning = 0;
  }
});

let totalFiles = 0;
let downloadsRunning = 0;

function updateDownloadStatistics() {
  // Send a message to the extension's user interface
  chrome.runtime.sendMessage({ action: 'updateDownloadStatistics', downloadsRunning });
}

// function updateTotalFiles() {
//   chrome.runtime.sendMessage({ action: 'updateTotalFiles', files });
// }

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

          // Check if all downloads are complete
          if (downloadsRunning === totalFiles) {
            // Enable the download button
            chrome.runtime.sendMessage({ action: 'downloadsComplete' });
          }
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
