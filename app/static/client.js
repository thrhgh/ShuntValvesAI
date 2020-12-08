var el = x => document.getElementById(x);

function showPicker() {
  el("fileInput").click();
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();
  reader.onload = function(e) {
    el("image-picked").src = e.target.result;
    el("image-picked").className = "";
  };
  reader.readAsDataURL(input.files[0]);
}

function analyze() {
  //var uploadFiles = el("fileInput").files;

  //own
var reader = new FileReader();
var canvas = document.getElementById("image-picked");
var uploadFiles = canvas.toDataURL("png");

///***sanity check****
//
//var image = document.createElement('img');

//image.src = URL.createObjectURL(dataUrlToBlob(uploadFiles));
//document.body.appendChild(image);
// end sanity check
//  if (uploadFiles.length !== 1) alert("Please select a file to analyze!");

  el("analyze-button").innerHTML = "Analyzing...";
  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`,
    true);
  xhr.onerror = function() {
    alert(xhr.responseText);
  };
  xhr.onload = function(e) {
    if (this.readyState === 4) {
      var response = JSON.parse(e.target.responseText);
      el("result-label").innerHTML = `Shunt Valve: ${response["result"]} with a probability of ${response["probability"]} `;
    }
    el("analyze-button").innerHTML = "Analyze";
  };

  var fileData = new FormData();
  //fileData.append("file", uploadFiles[0]);
  fileData.append("file", dataUrlToBlob(uploadFiles));
  xhr.send(fileData);
}

/* function borrowed from http://stackoverflow.com/a/7261048/425197 */
function dataUrlToBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  return new Blob([ia], {type: mimeString});
}
