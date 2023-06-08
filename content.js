// code version 1.4.5 5.30.2023 (updated using chrome extension V3 standard found here https://developer.chrome.com/docs/extensions/reference/)
function extractFilesFromPage() {
  var downloadLinks = document.querySelectorAll('a');
  var files = [];
  var fileExtensions = /(\.pdf|\.svg|\.zip|\.png|\.jpg|\.jpeg)$/i; // add or remove file extensions here

  for (var i = 0; i < downloadLinks.length; i++) {
    var link = downloadLinks[i];
    var fileUrl = link.href.toLowerCase();
    const fileExtension = fileUrl.split('.').pop();
    const fileName = link.innerText.trim() + '.' + fileExtension;

    if (fileUrl.match(fileExtensions)) {
      files.push({ name: fileName, url: fileUrl });
    }
  }
  console.log(files);

  return files;
}

extractFilesFromPage(); // Retrieve the extracted files

// var files = extractFilesFromPage(); // Retrieve the extracted files

// // Send a message to the background script with the extracted files
// chrome.runtime.sendMessage({ action: "filesData", files: files }, function(response) {
//   // Handle the response from the background script if needed
// });



// // code version 1.3 5.25.2023
// function extractFilesFromPage() {
//   var downloadLinks = document.querySelectorAll('a');
//   var files = [];

//   for (var i = 0; i < downloadLinks.length; i++) {
//     var link = downloadLinks[i];
//     var fileName = link.innerText.trim();
//     var fileUrl = link.href;
//     files.push({ name: fileName, url: fileUrl });
//   }

//   return files;
// }

// // Send a message to the background script with the extracted files
// chrome.runtime.sendMessage({ action: "filesData", files: files });


// // code verson 1.2 5.24.2023
// function extractFilesFromPage() {
//   var downloadLinks = document.querySelectorAll('a');
//   var files = [];

//   for (var i = 0; i < downloadLinks.length; i++) {
//     var link = downloadLinks[i];
//     var fileName = link.innerText.trim();
//     var fileUrl = link.href;
//     files.push({ name: fileName, url: fileUrl });
//   }

//   return files;
// }

// // Send a message to the background script with the extracted files
// chrome.runtime.sendMessage({ action: "extractFiles", files: extractFilesFromPage() });


// // code version 1.1 5.24.2023
// function extractFilesFromPage() {
//   var downloadLinks = document.querySelectorAll('a');
//   var files = [];

//   for (var i = 0; i < downloadLinks.length; i++) {
//     var link = downloadLinks[i];
//     var fileName = link.innerText.trim();
//     var fileUrl = link.href;
//     files.push({ name: fileName, url: fileUrl });
//   }

//   return files;
// }

// // Send a message to the background script with the extracted files
// var files = extractFilesFromPage();
// if (files.length > 0) {
//   chrome.runtime.sendMessage({ action: "extractFiles", files: files }, function(response) {
//     // Handle the response from the background script
//     if (response && response.success) {
//       var files = response.files;
//       // Send the extracted files back to popup.js
//       chrome.runtime.sendMessage({ action: "updateStatus", status: "queuedToDownload", files: files });
//     }
//   });
// } else {
//   console.log("No files found on the page.");
// }


// code version 1.0 5.23.2023
// function extractFilesFromPage() {
//   var downloadLinks = document.querySelectorAll('a');
//   var files = [];

//   for (var i = 0; i < downloadLinks.length; i++) {
//     var link = downloadLinks[i];
//     var fileName = link.innerText.trim();
//     var fileUrl = link.href;
//     files.push({ name: fileName, url: fileUrl });
//   }

//   return files;
// }

// // Send a message to the background script with the extracted files
// chrome.runtime.sendMessage({ action: "extractFiles", files: extractFilesFromPage() });
