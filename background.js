// code version 1.1.5 5.25.2023 (updated using the chrome extension v3 standard found here https://developer.chrome.com/docs/extensions/reference/)

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  downloadsRunningReset = '';
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