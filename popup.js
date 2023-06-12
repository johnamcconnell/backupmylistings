
// code version 1.5 5.30.2023 (updated to us the chrome extension V3 standard found here https://developer.chrome.com/docs/extensions/reference/)
document.addEventListener('DOMContentLoaded', function () {
  var backupFilesBtn = document.getElementById('backupFilesBtn');
  backupFilesBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ['content.js']
      }).then(function(results) {
        // Handle the results of content script execution
        var files = results[0] && results[0].result ? results[0].result : [];
        var totalFiles = files.length; // Get the total number of files
        startFileDownloads(files); // Pass the totalFiles as an argument
        console.log('results: ' + results);
      }).catch(function(error) {
        // Handle the error
        console.error(error);
      });
    });
  });
});

function startFileDownloads(files) {
  // Send a message to the background script with the files to download and totalFiles
  chrome.runtime.sendMessage({action: "startDownloads", files: files});
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "updateStatus") {
    var status = message.status;
    var fileList = message.files;
    var totalFiles = message.totalFiles;
    startFileDownloads(fileList); // Update function call to pass fileList instead of files

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

    // Update the totalFiles field
    updateTotalFiles(totalFiles);
  }
});

function clearStatus() {
  var statusFields = ["currentlyDownloadingList", "downloadErrorsList", "queuedToDownloadList", "successfullyDownloadedList"];
  statusFields.forEach(function(field) {
    var list = document.getElementById(field);
    if (list) { // Add a null check before clearing the list
      list.innerHTML = "";
    }
  });

  // Clear the totalFiles field
  updateTotalFiles(0);
}

function updateStatusField(fieldId, fileList) {
  var list = document.getElementById(fieldId);
  if (list) { // Add a null check before updating the status field
    fileList.forEach(function(file) {
      var listItem = document.createElement("li");
      listItem.textContent = file.name;
      list.appendChild(listItem);
    });
  }
}

function updateTotalFiles(totalFiles) {
  var totalFilesElement = document.getElementById("totalFiles");
  if (totalFilesElement) { // Add a null check before updating the totalFiles field
    totalFilesElement.textContent = totalFiles.toString();
  }
}


// creating a link to open chrome settings for users 
// chrome.tabs.create({url: 'chrome://settings/downloads'})


// // code version 1.4 5.24.2023
// document.addEventListener('DOMContentLoaded', function () {
//   var backupFilesBtn = document.getElementById('backupFilesBtn');
//   backupFilesBtn.addEventListener('click', function() {
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//       var activeTab = tabs[0];
//       chrome.scripting.executeScript({
//         target: { tabId: activeTab.id },
//         files: ['content.js']
//       }, function(results) {
//         // Handle the results of content script execution
//         var files = results[0] && results[0].result ? results[0].result : [];
//         var totalFiles = files.length; // Get the total number of files
//         startFileDownloads(files, totalFiles); // Pass the totalFiles as an argument
//       });
//     });
//   });
// });

// function startFileDownloads(files, totalFiles) {
//   // Send a message to the service worker with the files to download and totalFiles
//   chrome.runtime.sendMessage({ action: "startDownloads", files: files, totalFiles: totalFiles });
// }

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.action === "updateStatus") {
//     var status = message.status;
//     var fileList = message.files;
//     var totalFiles = message.totalFiles;
//     var files = message.files;
//     startFileDownloads(files); // Retrieve the totalFiles from the message

//     // Clear previous status
//     clearStatus();

//     // Update the corresponding status field with the file list
//     switch (status) {
//       case "currentlyDownloading":
//         updateStatusField("currentlyDownloadingList", fileList);
//         break;
//       case "downloadErrors":
//         updateStatusField("downloadErrorsList", fileList);
//         break;
//       case "queuedToDownload":
//         updateStatusField("queuedToDownloadList", fileList);
//         break;
//       case "successfullyDownloaded":
//         updateStatusField("successfullyDownloadedList", fileList);
//         break;
//     }

//     // Update the totalFiles field
//     updateTotalFiles(totalFiles);
//   }
// });

// function clearStatus() {
//   var statusFields = ["currentlyDownloadingList", "downloadErrorsList", "queuedToDownloadList", "successfullyDownloadedList"];
//   statusFields.forEach(function(field) {
//     var list = document.getElementById(field);
//     if (list) { // Add a null check before clearing the list
//       list.innerHTML = "";
//     }
//   });

//   // Clear the totalFiles field
//   updateTotalFiles(0);
// }

// function updateStatusField(fieldId, fileList) {
//   var list = document.getElementById(fieldId);
//   if (list) { // Add a null check before updating the status field
//     fileList.forEach(function(file) {
//       var listItem = document.createElement("li");
//       listItem.textContent = file.name;
//       list.appendChild(listItem);
//     });
//   }
// }

// function updateTotalFiles(totalFiles) {
//   var totalFilesElement = document.getElementById("totalFiles");
//   if (totalFilesElement) { // Add a null check before updating the totalFiles field
//     totalFilesElement.textContent = totalFiles.toString();
//   }
// }




// // code version 1.3 5.24.2023
// document.addEventListener('DOMContentLoaded', function () {
//   var backupFilesBtn = document.getElementById('backupFilesBtn');
//   backupFilesBtn.addEventListener('click', function() {
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//       var activeTab = tabs[0];
//       chrome.scripting.executeScript({
//         target: { tabId: activeTab.id },
//         files: ['content.js']
//       }, function(results) {
//         // Handle the results of content script execution
//         var files = results[0].result;
//         var totalFiles = files.length; // Get the total number of files
//         startFileDownloads(files, totalFiles); // Pass the totalFiles as an argument
//       });
//     });
//   });
// });

// function startFileDownloads(files, totalFiles) {
//   // Send a message to the service worker with the files to download and totalFiles
//   chrome.runtime.sendMessage({ action: "startDownloads", files: files, totalFiles: totalFiles });
// }

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.action === "updateStatus") {
//     var status = message.status;
//     var fileList = message.files;
//     var totalFiles = message.totalFiles; // Retrieve the totalFiles from the message

//     // Clear previous status
//     clearStatus();

//     // Update the corresponding status field with the file list
//     switch (status) {
//       case "currentlyDownloading":
//         updateStatusField("currentlyDownloadingList", fileList);
//         break;
//       case "downloadErrors":
//         updateStatusField("downloadErrorsList", fileList);
//         break;
//       case "queuedToDownload":
//         updateStatusField("queuedToDownloadList", fileList);
//         break;
//       case "successfullyDownloaded":
//         updateStatusField("successfullyDownloadedList", fileList);
//         break;
//     }

//     // Update the totalFiles field
//     updateTotalFiles(totalFiles);
//   }
// });

// function clearStatus() {
//   var statusFields = ["currentlyDownloadingList", "downloadErrorsList", "queuedToDownloadList", "successfullyDownloadedList"];
//   statusFields.forEach(function(field) {
//     var list = document.getElementById(field);
//     list.innerHTML = "";
//   });

//   // Clear the totalFiles field
//   updateTotalFiles(0);
// }

// function updateStatusField(fieldId, fileList) {
//   var list = document.getElementById(fieldId);
//   fileList.forEach(function(file) {
//     var listItem = document.createElement("li");
//     listItem.textContent = file.name;
//     list.appendChild(listItem);
//   });
// }

// function updateTotalFiles(totalFiles) {
//   var totalFilesElement = document.getElementById("totalFiles");
//   totalFilesElement.textContent = totalFiles.toString();
// }


// // code version 1.2 5.24.2023
// document.addEventListener('DOMContentLoaded', function () {
//   var backupFilesBtn = document.getElementById('backupFilesBtn');
//   backupFilesBtn.addEventListener('click', function() {
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//       var activeTab = tabs[0];
//       chrome.scripting.executeScript({
//         target: { tabId: activeTab.id },
//         files: ['content.js']
//       }, function(results) {
//         // Handle the results of content script execution
//         var files = results[0].result;
//         var totalFiles = files.length; // Get the total number of files
//         startFileDownloads(files, totalFiles); // Pass the totalFiles as an argument
//       });
//     });
//   });
// });

// function startFileDownloads(files, totalFiles) {
//   // Send a message to the service worker with the files to download and totalFiles
//   chrome.runtime.sendMessage({ action: "startDownloads", files: files, totalFiles: totalFiles });
// }

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.action === "updateStatus") {
//     var status = message.status;
//     var fileList = message.files;
//     var totalFiles = message.totalFiles; // Retrieve the totalFiles from the message

//     // Clear previous status
//     clearStatus();

//     // Update the corresponding status field with the file list
//     switch (status) {
//       case "currentlyDownloading":
//         updateStatusField("currentlyDownloadingList", fileList);
//         break;
//       case "downloadErrors":
//         updateStatusField("downloadErrorsList", fileList);
//         break;
//       case "queuedToDownload":
//         updateStatusField("queuedToDownloadList", fileList);
//         break;
//       case "successfullyDownloaded":
//         updateStatusField("successfullyDownloadedList", fileList);
//         break;
//     }

//     // Update the totalFiles field
//     updateTotalFiles(totalFiles);
//   }
// });

// function clearStatus() {
//   var statusFields = ["currentlyDownloadingList", "downloadErrorsList", "queuedToDownloadList", "successfullyDownloadedList"];
//   statusFields.forEach(function(field) {
//     var list = document.getElementById(field);
//     list.innerHTML = "";
//   });

//   // Clear the totalFiles field
//   updateTotalFiles(0);
// }

// function updateStatusField(fieldId, fileList) {
//   var list = document.getElementById(fieldId);
//   fileList.forEach(function(file) {
//     var listItem = document.createElement("li");
//     listItem.textContent = file.name;
//     list.appendChild(listItem);
//   });
// }

// function updateTotalFiles(totalFiles) {
//   var totalFilesElement = document.getElementById("totalFiles");
//   totalFilesElement.textContent = totalFiles.toString();
// }




// //code version 1.1 5.24.2023
// document.addEventListener('DOMContentLoaded', function () {
//   var backupFilesBtn = document.getElementById('backupFilesBtn');
//   backupFilesBtn.addEventListener('click', function() {
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//       var activeTab = tabs[0];
//       chrome.scripting.executeScript({
//         target: { tabId: activeTab.id },
//         files: ['content.js']
//       }, function(results) {
//         // Handle the results of content script execution
//         var files = results[0].result;
//         startFileDownloads(files);
//       });
//     });
//   });
// });

// function startFileDownloads(files) {
//   // Send a message to the service worker with the files to download
//   chrome.runtime.sendMessage({ action: "startDownloads", files: files });
// }

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.action === "updateStatus") {
//     var status = message.status;
//     var fileList = message.files;

//     // Clear previous status
//     clearStatus();

//     // Update the corresponding status field with the file list
//     switch (status) {
//       case "currentlyDownloading":
//         updateStatusField("currentlyDownloadingList", fileList);
//         break;
//       case "downloadErrors":
//         updateStatusField("downloadErrorsList", fileList);
//         break;
//       case "queuedToDownload":
//         updateStatusField("queuedToDownloadList", fileList);
//         break;
//       case "successfullyDownloaded":
//         updateStatusField("successfullyDownloadedList", fileList);
//         break;
//     }
//   }
// });

// function clearStatus() {
//   var statusFields = ["currentlyDownloadingList", "downloadErrorsList", "queuedToDownloadList", "successfullyDownloadedList"];
//   statusFields.forEach(function(field) {
//     var list = document.getElementById(field);
//     list.innerHTML = "";
//   });
// }

// function updateStatusField(fieldId, fileList) {
//   var list = document.getElementById(fieldId);
//   fileList.forEach(function(file) {
//     var listItem = document.createElement("li");
//     listItem.textContent = file.name;
//     list.appendChild(listItem);
//   });
// }

// code version1.0 5.23.2023
// document.addEventListener('DOMContentLoaded', function() {
//   var backupFilesBtn = document.getElementById('backupFilesBtn');
//   backupFilesBtn.addEventListener('click', function() {
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//       var activeTab = tabs[0];
//       chrome.scripting.executeScript({
//         target: { tabId: activeTab.id },
//         files: ['content.js']
//       }, function(results) {
//         // Handle the results of content script execution
//       });
//     });
//   });
// });
