document.addEventListener('DOMContentLoaded', function () {
  var backupFilesBtn = document.getElementById('backupFilesBtn');
  const downloadsRunningElement = document.getElementById('downloadsRunning');
  let totalFilesStatus = document.getElementById('totalFiles');

  backupFilesBtn.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ['content.js']
      }).then(function (results) {
        // Handle the results of content script execution
        var filelist = results[0] && results[0].result ? results[0].result : [];
        var totalFiles = filelist.length; // Get the total number of files
        startFileDownloads(filelist, totalFiles); // Pass the files and totalFiles as arguments
        console.log('results: ' + results);
      }).catch(function (error) {
        // Handle the error
        console.error(error);
      });
    });
  });



  // Listen for messages from the service worker
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'updateDownloadStatistics') {
      downloadsRunningElement.textContent = message.downloadsRunning;

      // Update the download statistics in the user interface - **revert code if error
      // const downloadsRunningElement = document.getElementById('downloadsRunning');
      // downloadsRunningElement.textContent = `${message.downloadsRunning}`;
      // console.log(message);
      
    }
  });
});




function startFileDownloads(filelist, totalFiles) {
  var backupFilesBtn = document.getElementById('backupFilesBtn');
  backupFilesBtn.disabled = true;


  // Reset the download count to 0
  chrome.runtime.sendMessage({ action: "resetDownloadCount" });
  // Send a message to the background script with the files to download and totalFiles
  chrome.runtime.sendMessage({ action: "startDownloads", files: filelist, totalFiles: totalFiles });
  // Update the total files count in the UI
  // var totalFilesStatus = document.getElementById('totalFiles');
  // totalFilesStatus.textContent = totalFiles;
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "downloadsComplete") {
    // Enable the download button
    var backupFilesBtn = document.getElementById('backupFilesBtn');
    backupFilesBtn.disabled = false;
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "updateStatus") {
    var status = message.status;
    var fileList = message.files;

    // Clear previous status
    clearStatus();

    // Update the corresponding status field with the file list
    switch (status) {
      case "currentlyDownloading":
        updateStatusField("currentlyDownloadingList", fileList);
        break;
      case "downloadErrors":
        updateStatusField("downloadErrorsList", fileList);
        break;
      case "queuedToDownload":
        updateStatusField("queuedToDownloadList", fileList);
        break;
      case "successfullyDownloaded":
        updateStatusField("successfullyDownloadedList", fileList);
        break;
    }
  }
});



function clearStatus() {
  var statusFields = ["currentlyDownloadingList", "downloadErrorsList", "queuedToDownloadList", "successfullyDownloadedList"];
  statusFields.forEach(function (field) {
    var list = document.getElementById(field);
    if (list) { // Add a null check before clearing the list
      list.innerHTML = "";
    }
  });
}

function updateStatusField(fieldId, fileList) {
  var list = document.getElementById(fieldId);
  if (list) { // Add a null check before updating the status field
    fileList.forEach(function (filelist) {
      var listItem = document.createElement("li");
      listItem.textContent = filelist.name;
      list.appendChild(listItem);
    });
  }
}

