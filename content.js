// code version 1.4.5 5.30.2023 (updated using chrome extension V3 standard found here https://developer.chrome.com/docs/extensions/reference/)
function extractFilesFromPage() {
  var downloadLinks = document.getElementById('etsyfiles');

  if (downloadLinks) {
    downloadLinks = downloadLinks.querySelectorAll('a');
  } else {
    console.log("element with ID 'etsfiles' not found");
  }

  const filelist = [];
  var fileExtensions = /(\.pdf|\.svg|\.zip|\.png|\.jpg|\.jpeg)$/i; // add or remove file extensions here

  for (var i = 0; i < downloadLinks.length; i++) {
    var link = downloadLinks[i];
    var fileUrl = link.href.toLowerCase();
    const fileExtension = fileUrl.split('.').pop();
    const fileName = link.innerText;
    filelist.push({ name: fileName, url: fileUrl });
  }

  console.log(filelist.length);
  return filelist;
}
extractFilesFromPage();


// extractFilesFromPage(function (files) {
//   chrome.runtime.sendMessage({ action: 'updateTotalFiles', totalFiles: files.length, files: files });
// });

